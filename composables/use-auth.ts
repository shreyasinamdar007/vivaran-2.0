export function useAuth() {
  const user = useState<any>("user", () => null);
  const loading = useState<boolean>("authLoading", () => true);

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

  return {
    user,
    loading,
    fetchUser,
  };
}
