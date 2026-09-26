# Roomavie

A responsive, statically generated Astro home decor publication based on the supplied visual reference.

## Run locally

Use Node.js 22.19 or later. `.node-version` and `.nvmrc` select the latest Node 22 release for Cloudflare Pages and local version managers.

```sh
npm install
npm run dev
```

`npm run build` runs TypeScript/Astro checks and creates the production site in `dist/`. `npm run preview` serves that build locally.

`npm run verify` checks generated pages for metadata, valid structured data, working local links and image assets, accessible image dimensions/alt text, and sitemap output.

## Configure before publishing

Copy `.env.example` to `.env`. Set `SITE_URL` to the real production URL; it controls canonicals, social metadata, structured data, robots.txt, and the generated sitemap. Set `PUBLIC_CONTACT_EMAIL` to the monitored contact inbox.

To enable actual newsletter subscriptions, set `PUBLIC_NEWSLETTER_ENDPOINT` to your form/newsletter provider's public POST endpoint. The form sends an `email` field using a standard HTML form submission. Without an endpoint, it honestly displays a coming-soon message and does not send or store addresses. Never put private provider API keys in public environment variables.

Header/footer social links currently open the corresponding platforms or home decor searches. Replace them with your brand profiles when available. Confirm ownership/licensing of the reference imagery and review the privacy/terms copy for your production services before publishing.

## Editing

- Articles, categories, and image mappings: `src/data/content.ts`
- Home layout: `src/pages/index.astro`
- Colors, typography, and responsive styles: `src/styles/global.css`
- Shared metadata: `src/layouts/Layout.astro`
- Newsletter: `src/components/Newsletter.astro`

The site includes 11 article pages, 5 category pages, an article index with category filters, native-dialog search, mobile navigation, about/contact pages, and a custom 404 page. Core content/navigation remains available without JavaScript. No React runtime, remote fonts, analytics, or third-party client scripts are shipped.

Local photos use Astro's image pipeline for WebP generation and responsive source sets. Images have explicit dimensions; below-the-fold photos are lazy loaded and the cover image receives high priority. The reference photo crops are intentionally retained to match the design; their resolution is limited by the supplied screenshot.

`scripts/extract-reference.mjs` documents how the photographic assets were extracted. Re-run it with the original reference path if needed. Use higher-resolution original photography in `src/assets/images/` for a sharper large-screen result.

## Deploy to Cloudflare Pages

The site is entirely static. Images are optimized during the build, and the generated `dist/404.html` supplies Pages' custom error page. `public/_headers` enables one-year immutable caching for fingerprinted Astro assets and sets standard response headers. No server adapter, Pages Functions, or runtime secrets are needed.

1. In Cloudflare, open **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Select **ImtinanFakhar/roomavie** and use these build settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build:pages` |
| Build output directory | `dist` |
| Root directory | Leave empty (repository root) |
| Node version | Latest Node 22, selected by `.node-version` |

3. Add `SITE_URL` to the **build** environment variables if using a custom domain, for example `https://roomavie.com`. Add `PUBLIC_CONTACT_EMAIL` and optionally `PUBLIC_NEWSLETTER_ENDPOINT` as appropriate. Configure production and preview environments separately if you need different values.
4. Select **Save and Deploy**. Subsequent pushes to `main` trigger production builds through Cloudflare's Git integration.

If `SITE_URL` is not configured, a Cloudflare build derives the stable project origin from `CF_PAGES_URL`; deployment hashes and branch names are removed so canonical URLs and the sitemap do not point at a temporary preview hostname. Local builds still default to `https://roomavie.com`.

`wrangler.jsonc` declares the Pages project name and output directory for Cloudflare tooling. The Cloudflare dashboard controls Git build settings and build environment variables; Wrangler runtime variables are not used for static build-time settings.

Validate exactly as Pages does with `npm run build:pages`. The lockfile is committed for reproducible installs; `npm ci` can also be used for a clean installation.

See [Cloudflare's Astro deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Node version configuration](https://developers.cloudflare.com/pages/configuration/build-image/), and [static headers documentation](https://developers.cloudflare.com/pages/configuration/headers/).
