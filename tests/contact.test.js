import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createContactHandler } from '../server/contact.js';
import { validateEnquiry, validateAttachments, enquiryText, createRequestId } from '../src/contact-rules.js';
const env = { RESEND_API_KEY: 'test-only', CONTACT_TO_EMAIL: 'recipient@example.com', CONTACT_FROM_EMAIL: 'sender@example.com', CONTACT_RESPONSE_TIME: 'Aftalt svartid til test' };
const enquiry = { name: 'Testkunde', email: 'test@example.com', message: 'Jeg ønsker en afskærmning til haven.', callback: true, phone: '+45 41 35 20 25', jobType: 'Afskærmning', length: '250', width: '120,5', height: '150', material: 'Sort' };
function post(data = enquiry, files = [], id = randomUUID(), origin = 'https://finnz.test') {
  const form = new FormData();
  for (const [key, value] of Object.entries(data)) form.set(key, String(value));
  form.set('requestId', id); files.forEach(file => form.append('files', file));
  return new Request('https://finnz.test/api/contact', { method: 'POST', headers: { Origin: origin }, body: form });
}
test('validates contact details, callbacks, finite dimensions and allowed selections', () => {
  assert.deepEqual(validateEnquiry(enquiry), {});
  assert.match(createRequestId(), /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.ok(validateEnquiry({ ...enquiry, phone: ' '.repeat(100) + '41352025' }).phone);
  assert.equal(Object.keys(validateEnquiry({})).length, 3);
  assert.ok(validateEnquiry({ ...enquiry, phone: '12' }).phone);
  assert.ok(validateEnquiry({ ...enquiry, email: 'test@example.com\nBcc:bad' }).email);
  for (const length of ['-2', '0', 'NaN', 'Infinity', '50001', '12x']) assert.ok(validateEnquiry({ ...enquiry, length }).length);
  assert.ok(validateEnquiry({ ...enquiry, material: 'Valnød', jobType: 'Invented' }).material);
  assert.match(enquiryText(enquiry), /Ring mig gerne op på: \+45/);
  assert.match(enquiryText(enquiry), /Bredde: 120,5 cm/);
  assert.doesNotMatch(enquiryText({ ...enquiry, callback: false }), /Ring mig gerne op/);
});
test('limits count, individual size, aggregate size and file formats', () => {
  const file = { type: 'image/png', size: 2 * 1024 * 1024 };
  assert.equal(validateAttachments([file]), '');
  assert.ok(validateAttachments(Array(5).fill(file)));
  assert.ok(validateAttachments([{ ...file, size: 4 * 1024 * 1024 }]));
  assert.ok(validateAttachments(Array(4).fill({ ...file, size: 3 * 1024 * 1024 })));
  assert.ok(validateAttachments([{ ...file, type: 'image/svg+xml' }]));
});
test('reports readiness without exposing mail credentials; refuses unconfigured delivery', async () => {
  const handle = createContactHandler({ env: {} });
  assert.deepEqual(await (await handle(new Request('https://finnz.test/api/contact'))).json(), { ready: false, responseTime: '' });
  assert.equal((await handle(post())).status, 503);
  const configured = await (await createContactHandler({ env })(new Request('https://finnz.test/api/contact'))).json();
  assert.deepEqual(configured, { ready: true, responseTime: env.CONTACT_RESPONSE_TIME });
  assert.ok(!JSON.stringify(configured).includes(env.RESEND_API_KEY));
});
test('sends reply-to, all enquiry details and binary attachments only after validation', async () => {
  let sent;
  const handle = createContactHandler({ env, fetchMail: async (url, options) => { sent = { url, options, body: JSON.parse(options.body) }; return Response.json({ id: 'provider-reference' }); } });
  const bytes = new Uint8Array([137,80,78,71,13,10,26,10,1,2,3]);
  const response = await handle(post(enquiry, [new File([bytes], 'skitse.png', { type: 'image/png' })]));
  assert.equal(response.status, 200); assert.equal((await response.json()).sent, true);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.deepEqual(sent.body.to, [env.CONTACT_TO_EMAIL]);
  assert.equal(sent.body.reply_to, enquiry.email);
  assert.match(sent.body.text, /Farveønske: Sort/);
  assert.match(sent.body.text, /Højde: 150 cm/);
  assert.equal(sent.body.attachments[0].content, Buffer.from(bytes).toString('base64'));
  assert.match(sent.options.headers['Idempotency-Key'], /^finnz-/);
});
test('rejects malformed attachments, bad fields, honeypot and cross-origin submissions without sending', async () => {
  let calls = 0;
  const handle = createContactHandler({ env, fetchMail: async () => { calls++; throw new Error('Must not send'); } });
  const fake = new File(['this is not a png'], 'fake.png', { type: 'image/png' });
  assert.equal((await handle(post(enquiry, [fake]), 'a')).status, 422);
  assert.equal((await handle(post({ ...enquiry, email: 'broken' }), 'b')).status, 422);
  assert.equal((await handle(post({ ...enquiry, website: 'spam' }), 'c')).status, 400);
  assert.equal((await handle(post(enquiry, [], randomUUID(), 'https://outside.test'), 'd')).status, 403);
  assert.equal((await handle(post(enquiry, [], 'invalid'), 'e')).status, 400);
  assert.equal((await handle(new Request('https://finnz.test/api/contact', { method: 'DELETE' }))).status, 405);
  assert.equal(calls, 0);
});
test('provider rejection and network failure never return a success; retries retain idempotency', async () => {
  const keys = []; let first = true;
  const handle = createContactHandler({ env, fetchMail: async (url, options) => {
    keys.push(options.headers['Idempotency-Key']);
    if (first) { first = false; throw new Error('Network error'); }
    return Response.json({ id: 'retried-reference' });
  } });
  const id = randomUUID();
  const failed = await handle(post(enquiry, [], id)); assert.equal(failed.status, 502); assert.equal((await failed.json()).sent, undefined);
  assert.equal((await handle(post(enquiry, [], id))).status, 200); assert.equal(keys[0], keys[1]);
  const rejected = createContactHandler({ env, fetchMail: async () => Response.json({ message: 'Rejected' }, { status: 403 }) });
  assert.equal((await rejected(post())).status, 502);
});
test('rate limits repeated submissions and expires the window', async () => {
  let clock = 1000;
  const handle = createContactHandler({ env, now: () => clock });
  for (let i=0; i<5; i++) assert.equal((await handle(post({ ...enquiry, email: '' }), 'visitor')).status, 422);
  const response = await handle(post(), 'visitor'); assert.equal(response.status, 429); assert.equal(response.headers.get('Retry-After'), '600');
  clock += 600001;
  assert.equal((await handle(post({ ...enquiry, email: '' }), 'visitor')).status, 422);
});
