//this store manages toast notifications.  It provides methods to add and remove toasts, and automatically removes them after a specified duration.  The store is not persisted, as toasts are temporary UI elements.

"use client";

import { create } from "zustand";

let id = 0;

export const useToastStore = create((set, get) => ({
    toasts: [],

    addToast: ({ message, type = "info", duration = 3000 }) => {
        const toastId = ++id;

        // const audio = new Audio("/sounds/toast.mp3");
        // audio.volume = 0.5;
        // audio.play().catch(() => {});

        set((state) => {
            const updated = [...state.toasts, { id: toastId, message, type }];
            return {
                toasts: updated.slice(-3), 
            };
        });

        // auto remove
        setTimeout(() => {
            get().removeToast(toastId);
        }, duration);
    },

    removeToast: (toastId) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== toastId),
        })),
}));