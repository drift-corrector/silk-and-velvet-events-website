import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://silkandvelvetevents.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  prefetch: true,
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      // The CMS and the post-submit page have no business in search results.
      filter: (page) => !page.includes('/admin') && !page.includes('/thanks'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
