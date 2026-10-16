import { handleContact } from './contact.js';
export async function contactMiddleware(req, res, next) {
  if (req.url?.split('?')[0] !== '/api/contact') return next();
  try {
    const chunks = []; let size = 0, tooLarge = false;
    if (Number(req.headers['content-length']) > 9 * 1024 * 1024) {
      req.resume(); res.writeHead(413, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ message: 'Filerne er for store. Vælg højst 8 MB samlet.' })); return;
    }
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 9 * 1024 * 1024) { tooLarge = true; chunks.length = 0; }
      if (!tooLarge) chunks.push(chunk);
    }
    if (tooLarge) { res.writeHead(413, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ message: 'Filerne er for store. Vælg højst 8 MB samlet.' })); return; }
    const url = new URL(req.url, `${req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}`);
    const request = new Request(url, { method: req.method, headers: req.headers, ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: Buffer.concat(chunks) }) });
    // Only honor a forwarding header behind an explicitly trusted reverse proxy.
    const peer = process.env.TRUST_PROXY === 'true' ? String(req.headers['x-forwarded-for'] || '').split(',').at(-1).trim() : '';
    const response = await handleContact(request, peer || req.socket.remoteAddress || 'unknown');
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ message: 'Beskeden kunne ikke sendes. Prøv igen, eller ring til os.' }));
  }
}
