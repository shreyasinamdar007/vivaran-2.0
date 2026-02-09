// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

import "./lib/env";
import { useRuntimeConfig } from "nuxt/app";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "nuxt-mongoose"],
  css: ["./assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    mongoDbUri: useRuntimeConfig().mongoDbUri || "mongodb://localhost:27017/vivaran",
    jwtSecret: useRuntimeConfig().jwtSecret || "vivaran_shi_2026",
  },
  mongoose: {
    uri: useRuntimeConfig().mongoDbUri || "mongodb://localhost:27017/vivaran",
    options: {},
    modelsDir: "./server/models",
    devtools: true,
  },
  ssr: true,
});
