import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sergiodominguez.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    tailwind(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          en: 'en',
          es: 'es'
        }
      }
    })
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true
    }
  }
});

