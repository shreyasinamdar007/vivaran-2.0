import { useAuthStore } from "~/stores/auth/auth";

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const auth = useAuthStore(nuxtApp.$pinia);

  if (!auth.user) {
    await auth.fetchUser();
  }

  if (!auth.isAuthenticated) {
    return navigateTo("/login");
  }
});
