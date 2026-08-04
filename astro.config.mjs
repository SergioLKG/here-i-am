import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sergiodominguez.vercel.app',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap()
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true
    }
  },

  adapter: vercel()
});