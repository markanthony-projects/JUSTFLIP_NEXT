import { create } from "zustand";
import ZoneService from "@/src/services/ZoneService";
import { Zone } from "@/src/types";

export interface ZoneState {
    zoneMap: Record<string, Zone>;
    loading: boolean;
    error: string | null;
}

export interface ZoneActions {
    fetchZoneById: (id: string) => Promise<Zone | null>;
    getZoneByIdFromStore: (id: string) => Zone | null;
    clearZones: () => void;
}

export const useZoneStore = create<ZoneState & ZoneActions>((set, get) => ({
    zoneMap: {},
    loading: false,
    error: null,


    fetchZoneById: async (id: string) => {
        const { zoneMap } = get();
        if (zoneMap[id]) {
            return zoneMap[id];
        }
        
        try {
            set({ loading: true, error: null });
            const data = await ZoneService.getZoneById(id);
            if (data) {
                set((state) => ({
                    zoneMap: { ...state.zoneMap, [id]: data },
                    loading: false,
                }));
            } else {
                set({ loading: false });
            }

            return data;
        } catch (error: any) {
            set({
                error: error.message || "Failed to fetch zone",
                loading: false,
            });

            return null;
        }
    },


    getZoneByIdFromStore: (id: string) => {
        return get().zoneMap[id] || null;
    },


    clearZones: () => {
        set({ zoneMap: {} });
    },
}));