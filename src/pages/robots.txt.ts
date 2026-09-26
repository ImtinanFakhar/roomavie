import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: Pinterestbot\nUser-agent: Pinterest\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
