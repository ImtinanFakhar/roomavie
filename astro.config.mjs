import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // All builds share the production identity, including Pages previews.
  // Do not let SITE_URL or CF_PAGES_URL publish a different canonical hostname.
  site: 'https://www.roomavie.com/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  compressHTML: true,
  devToolbar: { enabled: false },
});
