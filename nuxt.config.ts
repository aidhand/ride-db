import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: ["@/assets/css/main.css"],

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",

    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },
});
