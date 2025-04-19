import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      title: 'RideDB',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  runtimeConfig: {
    session: {
      name: 'nuxt_session',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      password: process.env.NUXT_SESSION_PASSWORD!,
    },
  },

  css: ['@/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/test-utils/module',
  ],

  nitro: {
    preset: 'bun',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },
});
