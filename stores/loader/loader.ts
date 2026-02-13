import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    isLoading: false,
    message: "Loading...",
  }),

  actions: {
    show(message?: string) {
      this.isLoading = true;
      if (message)
        this.message = message;
    },
    hide() {
      this.isLoading = false;
      this.message = "Loading...";
    },
  },
});
