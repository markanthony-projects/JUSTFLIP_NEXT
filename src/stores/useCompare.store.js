// import { create } from "zustand";
// import { compareStorage } from "../services/CompareProject.Service";
// import { isMobile } from "../utils/device";
// import { toast } from "../utils/toast";

// const MAX_DESKTOP = 3;
// const MAX_MOBILE = 2;

// export const useCompareStore = create((set, get) => ({
//     items: [],

//     init: () => {
//         const stored = compareStorage.get();
//         set({ items: stored });
//     },

//     add: (property) => {
//         let items = get().items;

//         const exists = items.find((i) => i.id === property.id);
//         if (exists) {
//             toast.warn("Already added");
//             return;
//         }

//         const limit = isMobile() ? MAX_MOBILE : MAX_DESKTOP;

//         if (items.length >= limit) {
//             if (isMobile()) {
//                 items = items.slice(1);
//                 toast.warn("Old property removed (mobile limit)");
//             } else {
//                 toast.error(`Only ${limit} properties allowed`);
//                 return;
//             }
//         }

//         const updated = [...items, property];

//         set({ items: updated });
//         compareStorage.set(updated);
//         toast.success("Added to compare");
//     },

//     remove: (id) => {
//         const updated = get().items.filter((i) => i.id !== id);
//         set({ items: updated });
//         compareStorage.set(updated);
//         toast.success("Removed");
//     },

//     clear: () => {
//         set({ items: [] });
//         compareStorage.clear();
//         toast.success("Cleared all");
//     }
// }));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isMobile } from "../utils/device";
import { toast } from "../utils/toast";

const MAX_DESKTOP = 3;
const MAX_MOBILE = 2;

export const useCompareStore = create(
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