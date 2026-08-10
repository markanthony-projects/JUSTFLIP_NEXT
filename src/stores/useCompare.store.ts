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
}

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
            }
        }),
        {
            name: "justflip-compare-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
);