// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "nuxt-mongoose", "@pinia/nuxt"],
  css: ["./assets/css/main.css", "@fontsource/inter/400.css", "@fontsource/inter/500.css", "@fontsource/inter/600.css", "@fontsource/inter/700.css", "@fontsource/montserrat/600.css", "@fontsource/montserrat/700.css", "@fontsource/roboto-mono/400.css", "@fontsource/roboto-mono/500.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: "./server/models",
    devtools: true,
  },
  ssr: true,
});
