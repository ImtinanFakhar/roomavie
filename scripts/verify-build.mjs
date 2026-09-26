import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('dist');
async function walk(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(items.map((item) => item.isDirectory() ? walk(path.join(directory, item.name)) : path.join(directory, item.name)))).flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
const errors = [];
let largestInlineScript = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const label = path.relative(root, page);
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(([, attributes]) => !attributes.includes('application/') && !attributes.includes('src=')).map(([, , body]) => body).join('\n');
  largestInlineScript = Math.max(largestInlineScript, gzipSync(inlineScripts).length);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${label}: expected one h1`);
  for (const expression of [/<title>[^<]+<\/title>/, /name="description" content="[^"]+"/, /rel="canonical"/, /property="og:image"/, /type="application\/ld\+json"/]) {
    if (!expression.test(html)) errors.push(`${label}: missing ${expression}`);
  }
  for (const [, image] of html.matchAll(/<img\b([^>]+)>/g)) {
    if (!/\balt=/.test(image) || !/\bwidth=/.test(image) || !/\bheight=/.test(image)) errors.push(`${label}: image missing alt or dimensions`);
  }
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const url = raw.split(/[?#]/)[0];
    const file = path.join(root, decodeURIComponent(url));
    try {
      const info = await stat(file);
      if (info.isDirectory()) await stat(path.join(file, 'index.html'));
    } catch { errors.push(`${label}: missing target ${url}`); }
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      if (!data['@context'] || !data['@type']) throw new Error('schema');
      if (data.image) {
        const image = new URL(data.image);
        if (image.pathname.startsWith('/_astro/')) await stat(path.join(root, image.pathname));
      }
    } catch { errors.push(`${label}: invalid structured data or missing schema image`); }
  }
}
for (const required of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '_headers', '404.html']) {
  if (!files.includes(path.join(root, required))) errors.push(`Missing ${required}`);
}
const headers = await readFile(path.join(root, '_headers'), 'utf8');
if (!headers.includes('/_astro/*') || !headers.includes('max-age=31536000, immutable')) errors.push('Missing immutable caching for fingerprinted assets');
const clientScripts = files.filter((file) => file.endsWith('.js'));
const scriptBytes = (await Promise.all(clientScripts.map(async (file) => gzipSync(await readFile(file)).length))).reduce((a, b) => a + b, 0);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Verified ${pages.length} HTML pages: metadata, structured data, image dimensions, and all local links/assets. Sitemap and robots.txt present. Client JavaScript: ${scriptBytes} external bytes, max ${largestInlineScript} inline bytes gzipped per page.`);
