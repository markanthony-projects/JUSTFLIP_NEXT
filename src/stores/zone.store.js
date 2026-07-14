import { create } from "zustand";
import ZoneService from "@/src/services/zone.service";

export const useZoneStore = create((set, get) => ({
    zoneMap: {},
    loading: false,
    error: null,


    fetchZoneById: async (id) => {
        const { zoneMap } = get();
        if (zoneMap[id]) {
            return zoneMap[id];
        }
        
        try {
            set({ loading: true, error: null });
            const data = await ZoneService.getZoneById(id);
            set((state) => ({
                zoneMap: { ...state.zoneMap, [id]: data, }, loading: false,
            }));

            return data;
        } catch (error) {
            set({
                error: error.message || "Failed to fetch zone",
                loading: false,
            });

            return null;
        }
    },


    getZoneByIdFromStore: (id) => {
        return get().zoneMap[id] || null;
    },


    clearZones: () => {
        set({ zoneMap: {} });
    },
}));