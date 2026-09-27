import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('dist');
const productionOrigin = 'https://www.roomavie.com';
async function walk(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(items.map((item) => item.isDirectory() ? walk(path.join(directory, item.name)) : path.join(directory, item.name)))).flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
const errors = [];
const indexableCanonicals = new Set();
const articleCanonicals = new Set();
function checkProductionUrl(raw, label) {
  try {
    const url = new URL(raw);
    if (url.origin !== productionOrigin) errors.push(`${label}: expected ${productionOrigin}, got ${url.origin}`);
    return url;
  } catch { errors.push(`${label}: invalid absolute URL ${raw}`); }
}
function checkSchemaUrls(value, label) {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) {
    const url = new URL(value);
    if (url.hostname === 'roomavie.com' || url.hostname.endsWith('.roomavie.com') || url.hostname.endsWith('.pages.dev')) checkProductionUrl(value, label);
  } else if (Array.isArray(value)) {
    value.forEach((item) => checkSchemaUrls(item, label));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => checkSchemaUrls(item, `${label}.${key}`));
  }
}
let largestInlineScript = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const label = path.relative(root, page);
  const pinterestVerification = [...html.matchAll(/<meta\b[^>]*name="p:domain_verify"[^>]*content="([^"]+)"/g)];
  if (pinterestVerification.length !== 1 || pinterestVerification[0]?.[1] !== 'f512a5cbd4f4d01edbc98279f315d9f3') errors.push(`${label}: missing or conflicting Pinterest domain verification tag`);
  const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(([, attributes]) => !attributes.includes('application/') && !attributes.includes('src=')).map(([, , body]) => body).join('\n');
  largestInlineScript = Math.max(largestInlineScript, gzipSync(inlineScripts).length);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${label}: expected one h1`);
  for (const expression of [/<title>[^<]+<\/title>/, /name="description" content="[^"]+"/, /rel="canonical"/, /property="og:image"/, /type="application\/ld\+json"/]) {
    if (!expression.test(html)) errors.push(`${label}: missing ${expression}`);
  }
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if (canonical) {
    const url = checkProductionUrl(canonical, `${label}: canonical`);
    if (url?.search || url?.hash) errors.push(`${label}: canonical must not contain a query or fragment`);
    if (label !== '404.html') {
      const expected = new URL(path.relative(root, page).replaceAll(path.sep, '/').replace(/index\.html$/, ''), `${productionOrigin}/`).href;
      if (canonical !== expected) errors.push(`${label}: canonical must identify its own page (${expected})`);
      indexableCanonicals.add(canonical);
      if (/name="robots" content="[^"]*\b(?:noindex|none|noimageindex)\b/i.test(html)) errors.push(`${label}: public page blocks indexing or images`);
    }
  }
  for (const field of ['og:url', 'og:image', 'twitter:image']) {
    const value = html.match(new RegExp(`<(?:meta)\\b[^>]*(?:property|name)="${field}"[^>]*content="([^"]+)"`))?.[1];
    if (!value) errors.push(`${label}: missing ${field}`);
    else {
      const url = checkProductionUrl(value, `${label}: ${field}`);
      if (field === 'og:url' && value !== canonical) errors.push(`${label}: Open Graph URL differs from canonical`);
      if (field.endsWith('image') && url) {
        try { await stat(path.join(root, url.pathname)); }
        catch { errors.push(`${label}: missing social image ${url.pathname}`); }
      }
    }
  }
  if (/\b(?:data-pin-nopin|nopin)\s*=|(?:name|property)="pinterest(?:-rich-pin)?"\s+content="(?:nopin|false)"/i.test(html)) errors.push(`${label}: Pinterest saving or Rich Pins disabled`);
  for (const [, ownUrl] of html.matchAll(/(?:href|src|content)="(https?:\/\/(?:[a-z0-9.-]+\.)?roomavie\.com[^"\s]*)"/gi)) checkProductionUrl(ownUrl, `${label}: site URL`);
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
      checkSchemaUrls(data, `${label}: structured data`);
      if (data['@type'] === 'BlogPosting' && (!data.headline || !data.description || !data.author?.name || !data.image || data.mainEntityOfPage !== canonical)) errors.push(`${label}: incomplete article sharing metadata`);
      if (data['@type'] === 'BlogPosting') {
        articleCanonicals.add(canonical);
        if (!/^\/(?:decor-ideas|small-spaces|living-room|bedroom|seasonal)\/[^/]+\/$/.test(new URL(canonical).pathname)) errors.push(`${label}: article URL must include its category and post slug`);
      }
      if (data.image) {
        const image = new URL(data.image);
        if (image.pathname.startsWith('/_astro/')) await stat(path.join(root, image.pathname));
      }
    } catch { errors.push(`${label}: invalid structured data or missing schema image`); }
  }
}
for (const required of ['robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', '_headers', '_redirects', '404.html']) {
  if (!files.includes(path.join(root, required))) errors.push(`Missing ${required}`);
}
const redirects = (await readFile(path.join(root, '_redirects'), 'utf8')).split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).map((line) => line.split(/\s+/));
const redirectSources = new Set();
for (const [source, target, status] of redirects) {
  if (redirectSources.has(source)) errors.push(`Duplicate redirect: ${source}`);
  redirectSources.add(source);
  if (status !== '301' || !articleCanonicals.has(`${productionOrigin}${target}`)) errors.push(`Invalid article migration redirect: ${source} -> ${target} ${status}`);
  if (indexableCanonicals.has(`${productionOrigin}${source}`)) errors.push(`Redirect source must not also be a canonical page: ${source}`);
}
for (const [, target] of redirects) if (redirectSources.has(target)) errors.push(`Redirect chain: ${target}`);
for (const canonical of articleCanonicals) {
  const target = new URL(canonical).pathname;
  const slug = target.split('/')[2];
  const source = slug === 'how-to-make-a-small-home-feel-less-cluttered' ? `/${slug}/` : `/blog/${slug}/`;
  if (!redirects.some(([from, to]) => from === source && to === target)) errors.push(`Missing permalink migration: ${source} -> ${target}`);
}
const headers = await readFile(path.join(root, '_headers'), 'utf8');
if (!headers.includes('/_astro/*') || !headers.includes('max-age=31536000, immutable')) errors.push('Missing immutable caching for fingerprinted assets');
if (/X-Robots-Tag:[^\n]*\b(?:noindex|none|noimageindex)\b/i.test(headers)) errors.push('Response headers block indexing or images');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
const groups = robots.split(/\r?\n\s*\r?\n/).map((group) => ({
  agents: [...group.matchAll(/^User-agent:\s*(.+)$/gmi)].map(([, agent]) => agent.trim().toLowerCase()),
  allowsRoot: /^Allow:\s*\/\s*$/mi.test(group),
  blocksPaths: /^Disallow:\s*\S/m.test(group),
  delay: /^Crawl-delay:/mi.test(group),
}));
for (const agent of ['pinterestbot', 'pinterest', '*']) {
  const group = groups.find(({ agents }) => agents.includes(agent));
  if (!group?.allowsRoot || group.blocksPaths || group.delay) errors.push(`robots.txt: ${agent} must have explicit unrestricted access without crawl delays`);
}
if (!robots.includes(`Sitemap: ${productionOrigin}/sitemap-index.xml`)) errors.push('robots.txt: wrong sitemap origin');
const sitemapPages = new Set();
for (const file of files.filter((file) => /sitemap[^/\\]*\.xml$/.test(file))) {
  const xml = await readFile(file, 'utf8');
  const isIndex = xml.includes('<sitemapindex');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  if (!locations.length) errors.push(`${path.basename(file)}: empty sitemap`);
  for (const location of locations) {
    const url = checkProductionUrl(location, path.basename(file));
    if (isIndex && url) {
      try { await stat(path.join(root, url.pathname)); }
      catch { errors.push(`Missing sitemap referenced by index: ${url.pathname}`); }
    } else if (!isIndex) {
      sitemapPages.add(location);
      if (!indexableCanonicals.has(location)) errors.push(`Sitemap contains a non-canonical or non-indexable page: ${location}`);
    }
  }
}
for (const canonical of indexableCanonicals) if (!sitemapPages.has(canonical)) errors.push(`Sitemap missing ${canonical}`);
const clientScripts = files.filter((file) => file.endsWith('.js'));
const scriptBytes = (await Promise.all(clientScripts.map(async (file) => gzipSync(await readFile(file)).length))).reduce((a, b) => a + b, 0);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Verified ${pages.length} HTML pages: metadata, structured data, image dimensions, and all local links/assets. Canonical/social/schema URLs and ${sitemapPages.size} sitemap entries use ${productionOrigin}. Pinterestbot and Pinterest explicitly allowed; no indexing or pinning opt-outs on public pages. Client JavaScript: ${scriptBytes} external bytes, max ${largestInlineScript} inline bytes gzipped per page.`);
