import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isMobile } from "../utils/device";
import { toast } from "../utils/toast";
import { Project } from "../types";

const MAX_DESKTOP: number = 3;
const MAX_MOBILE: number = 2;

export interface CompareState {
    items: Project[];
}

export interface CompareActions {
    add: (property: Project) => void;
    remove: (id: string) => void;
    clear: () => void;
    setUserStorageKey: () => void;
}

const getStorageKey = () => {
    if (typeof window === "undefined") return "justflip-compare-storage-guest";

    try {
        const rawAuth = localStorage.getItem("auth-store");
        if (rawAuth) {
            const parsed = JSON.parse(rawAuth);
            const user = parsed?.state?.user;
            // Supports both 'id' or '_id' depending on your backend
            const userId = user?.id || user?._id; 

            if (userId) {
                return `justflip-compare-storage-${userId}`;
            }
        }
    } catch (error) {
        console.error("Error reading auth-store for compare key:", error);
    }

    return "justflip-compare-storage-guest";
};

export const useCompareStore = create<CompareState & CompareActions>()(
    persist(
        (set, get) => ({
            items: [],

            add: (property) => {
                let items = get().items;

                const exists = items.find((i) => i.id === property.id);
                if (exists) {
                    toast.warn("Already added");
                    return;
                }

                const limit = isMobile() ? MAX_MOBILE : MAX_DESKTOP;

                if (items.length >= limit) {
                    if (isMobile()) {
                        items = items.slice(1);
                        toast.warn("Old property removed (mobile limit)");
                    } else {
                        toast.error(`Only ${limit} properties allowed`);
                        return;
                    }
                }

                set({ items: [...items, property] });
                toast.success("Added to compare");
            },

            remove: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
                toast.success("Removed");
            },

            clear: () => {
                set({ items: [] });
                toast.success("Cleared all");
            },

            setUserStorageKey: () => {
                if (typeof window === "undefined") return;
                const key = getStorageKey();
                const storedData = localStorage.getItem(key);
                if (storedData) {
                    try {
                        const parsed = JSON.parse(storedData);
                        set({ items: parsed.state?.items || [] });
                    } catch {
                        set({ items: [] });
                    }
                } else {
                    set({ items: [] });
                }
            }
        }),
        {
            name: "justflip-compare-storage",
            storage: createJSONStorage(() => ({
                getItem: () => localStorage.getItem(getStorageKey()),
                setItem: (name, value) => localStorage.setItem(getStorageKey(), value),
                removeItem: () => localStorage.removeItem(getStorageKey()),
            })),
            skipHydration: true,
        }
    )
);