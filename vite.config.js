import { defineConfig, loadEnv } from 'vite';
import { contactMiddleware } from './server/http.js';
export default defineConfig(({ mode }) => {
  // Server-only values remain in Node; Vite exposes only VITE_ values to the browser.
  const local = loadEnv(mode, process.cwd(), '');
  for (const key of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'CONTACT_RESPONSE_TIME', 'PUBLIC_SITE_URL', 'TRUST_PROXY']) if (!process.env[key] && local[key]) process.env[key] = local[key];
  const origin = (process.env.PUBLIC_SITE_URL || local.PUBLIC_SITE_URL || 'https://xn--finnz-trogdesign-1ob.dk').replace(/\/$/, '');
  const title = 'Finnz Træ & Design — Træ med karakter';
  const description = 'Havehuse, terrasser og afskærmning i træ. Se projekterne, find dit udtryk og fortæl os om din idé.';
  return { plugins: [{ name: 'finnz-social', transformIndexHtml() { return [
    { tag: 'link', attrs: { rel: 'canonical', href: origin + '/' } },
    ...Object.entries({ 'og:type': 'website', 'og:locale': 'da_DK', 'og:site_name': 'Finnz Træ & Design', 'og:title': title, 'og:description': description, 'og:url': origin + '/', 'og:image': origin + '/social/finnz-preview.jpg', 'og:image:width': '1536', 'og:image:height': '1024', 'og:image:type': 'image/jpeg', 'og:image:alt': 'Sort træbeklædning og lys afskærmning i en grøn have — stemningsvisualisering' }).map(([property, content]) => ({ tag: 'meta', attrs: { property, content } })),
    ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': origin + '/social/finnz-preview.jpg' }).map(([name, content]) => ({ tag: 'meta', attrs: { name, content } })),
  ]; } }, { name: 'finnz-contact', configureServer(server) { server.middlewares.use(contactMiddleware); }, configurePreviewServer(server) { server.middlewares.use(contactMiddleware); } }] };
});
