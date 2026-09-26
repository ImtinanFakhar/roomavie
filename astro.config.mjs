import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'SITE_');
const pagesDeployment = process.env.CF_PAGES_URL ? new URL(process.env.CF_PAGES_URL) : undefined;
// Pages supplies a deployment-specific URL. Canonicals use the stable project URL.
const pagesSite = pagesDeployment?.hostname.endsWith('.pages.dev')
  ? `https://${pagesDeployment.hostname.split('.').slice(-3).join('.')}`
  : pagesDeployment?.origin;

export default defineConfig({
  site: process.env.SITE_URL || env.SITE_URL || pagesSite || 'https://roomavie.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  compressHTML: true,
  devToolbar: { enabled: false },
});
