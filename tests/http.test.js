import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { contactMiddleware } from '../server/http.js';
async function withServer(run) {
  const server = createServer((req, res) => contactMiddleware(req, res, () => { res.writeHead(404); res.end(); }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('Node adapter serves the contact capabilities and delegates unrelated paths', async () => {
  await withServer(async origin => {
    const response = await fetch(origin + '/api/contact');
    assert.equal(response.status, 200);
    const config = await response.json(); assert.equal(typeof config.ready, 'boolean'); assert.equal(typeof config.responseTime, 'string');
    assert.equal((await fetch(origin + '/other')).status, 404);
  });
});
test('Node adapter rejects an oversized request with a real HTTP 413 response', async () => {
  await withServer(async origin => {
    const response = await fetch(origin + '/api/contact', { method: 'POST', body: Buffer.alloc(10 * 1024 * 1024) });
    assert.equal(response.status, 413); assert.match((await response.json()).message, /8 MB/);
  });
});
test('Node adapter bounds chunked bodies while preserving the 413 response', async () => {
  await withServer(async origin => {
    const result = await new Promise((resolve, reject) => {
      const req = request(origin + '/api/contact', { method: 'POST' }, res => {
        const chunks = []; res.on('data', chunk => chunks.push(chunk)); res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      });
      req.on('error', reject);
      for (let i = 0; i < 160; i++) req.write(Buffer.alloc(65536));
      req.end();
    });
    assert.equal(result.status, 413); assert.match(result.body, /8 MB/);
  });
});
