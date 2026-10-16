import { readFileSync, writeFileSync } from 'node:fs';

// A square SVG viewport preserves the proportions of the unmodified source image.
const icon = readFileSync(new URL('../public/brand/mark-outlined.webp', import.meta.url));
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640"><image x="0" y="0" width="640" height="640" preserveAspectRatio="xMidYMid meet" href="data:image/webp;base64,${icon.toString('base64')}"/></svg>\n`;
writeFileSync(new URL('../public/favicon.svg', import.meta.url), favicon);
