import { validateEnquiry, validateAttachments, enquiryText } from '../src/contact-rules.js';
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const validAddress = value => typeof value === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
export function contactConfig(env) {
  return { ready: Boolean(env.RESEND_API_KEY && validAddress(env.CONTACT_TO_EMAIL) && validAddress(env.CONTACT_FROM_EMAIL)), responseTime: String(env.CONTACT_RESPONSE_TIME || '').trim().slice(0, 160) };
}
export function fileMatchesType(bytes, type) {
  const starts = values => values.every((value, index) => bytes[index] === value);
  if (type === 'image/jpeg') return starts([255, 216, 255]);
  if (type === 'image/png') return starts([137, 80, 78, 71, 13, 10, 26, 10]);
  if (type === 'application/pdf') return starts([37, 80, 68, 70, 45]);
  return type === 'image/webp' && Buffer.from(bytes.subarray(0, 4)).toString() === 'RIFF' && Buffer.from(bytes.subarray(8, 12)).toString() === 'WEBP';
}
export function createContactHandler({ env = process.env, fetchMail = fetch, now = Date.now } = {}) {
  const attempts = new Map();
  return async function contact(request, ip = 'local') {
    const config = contactConfig(env);
    if (request.method === 'GET') return json(config);
    if (request.method !== 'POST') return json({ message: 'Denne metode understøttes ikke.' }, 405, { Allow: 'GET, POST' });
    const origin = request.headers.get('origin');
    const expectedOrigin = env.PUBLIC_SITE_URL ? new URL(env.PUBLIC_SITE_URL).origin : new URL(request.url).origin;
    if (origin && origin !== expectedOrigin && origin !== new URL(request.url).origin) return json({ message: 'Åbn formularen fra Finnz’ hjemmeside.' }, 403);
    if (!config.ready) return json({ message: 'Onlineafsendelse er ikke åbnet endnu. Ring til os, eller gem din besked.' }, 503);
    const stamp = now();
    for (const [key, value] of attempts) if (stamp - value.start > 600000) attempts.delete(key);
    const limit = attempts.get(ip) || { start: stamp, count: 0 };
    if (limit.count >= 5 || attempts.size > 5000) return json({ message: 'Vent lidt, før du prøver igen. Du kan også ringe til os.' }, 429, { 'Retry-After': '600' });
    limit.count++; attempts.set(ip, limit);
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) return json({ message: 'Formularen kunne ikke læses. Prøv igen.' }, 400);
    let form;
    try { form = await request.formData(); } catch { return json({ message: 'Formularen kunne ikke læses. Prøv igen.' }, 400); }
    if (form.get('website')) return json({ message: 'Beskeden kunne ikke sendes.' }, 400);
    const data = Object.fromEntries(['name', 'email', 'phone', 'jobType', 'length', 'width', 'height', 'message', 'material'].map(key => [key, typeof form.get(key) === 'string' ? form.get(key) : '']));
    data.callback = form.get('callback') === 'true';
    const errors = validateEnquiry(data);
    const files = form.getAll('files');
    if (files.some(file => typeof file.arrayBuffer !== 'function')) errors.files = 'Vedhæftningerne kunne ikke læses.';
    else { const error = validateAttachments(files); if (error) errors.files = error; }
    if (Object.keys(errors).length) return json({ message: 'Ret de markerede felter.', errors }, 422);
    const attachments = [];
    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (!fileMatchesType(bytes, file.type)) return json({ message: 'Ret vedhæftningerne.', errors: { files: 'Filens indhold matcher ikke formatet. Vælg JPG, PNG, WebP eller PDF.' } }, 422);
      attachments.push({ filename: file.name.replace(/[^\p{L}\p{N} ._()-]/gu, '_').slice(0, 120) || 'vedhaeftning', content: Buffer.from(bytes).toString('base64') });
    }
    const id = form.get('requestId');
    if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)) return json({ message: 'Genåbn formularen, og prøv igen.' }, 400);
    try {
      const response = await fetchMail('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `finnz-${id}` },
        body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: data.email.trim(), subject: `Ny henvendelse: ${data.jobType || 'En idé i træ'}`, text: enquiryText(data), attachments }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.id) throw new Error('Mail provider rejected request');
      return json({ sent: true, reference: result.id });
    } catch { return json({ message: 'Vi kunne ikke bekræfte afsendelsen. Prøv igen, eller ring til os. Dine oplysninger er bevaret.' }, 502); }
  };
}
export const handleContact = createContactHandler();
