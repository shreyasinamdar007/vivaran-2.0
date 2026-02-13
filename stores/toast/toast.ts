import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number; // Duration in milliseconds
};

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] as Toast[],
    nextId: 1,
  }),

  actions: {
    show(message: string, type: ToastType = "info", duration: number = 5000) {
      const id = this.nextId++;
      this.toasts.push({ id, message, type, duration });
      setTimeout(() => {
        this.remove(id);
      }, duration);
    },
    remove(id: number) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    },
  },
});
