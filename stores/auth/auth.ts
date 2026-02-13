import { defineStore } from "pinia";

type User = {
  id: string;
  email: string;
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  // 🔹 Fetch logged-in user
  const fetchUser = async () => {
    try {
      loading.value = true;
      user.value = await $fetch("/api/users/me", {
        credentials: "include",
      });
    }
    catch {
      user.value = null;
    }
    finally {
      loading.value = false;
    }
  };

  // 🔹 Login
  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });

      await fetchUser();
    }
    finally {
      loading.value = false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    user.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    login,
    logout,
  };
});
