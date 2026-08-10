import { create } from "zustand";
import LocationService from "../services/LocationService";
import { Location } from "../types";

export interface LocationState {
    locations: Record<string, Location>;
    loading: boolean;
    error: string | null;
}

export interface LocationActions {
    fetchLocation: (id: string, options?: any) => Promise<Location | null>;
    setLocation: (id: string, data: Location) => void;
    clearLocations: () => void;
}

export const useLocationStore = create<LocationState & LocationActions>((set, get) => ({
    locations: {},
    loading: false,
    error: null,

    fetchLocation: async (id: string, options = {}) => {
        const { locations } = get();

        if (locations[id]) return locations[id];

        set({ loading: true, error: null });

        try {
            const data = await LocationService.fetchLocationById({ id, ...options });
            
            if (data) {
                set((state) => ({
                    locations: { ...state.locations, [id]: data },
                    loading: false,
                }));
            } else {
                set({ loading: false });
            }

            return data;

        } catch (error: any) {
            set({
                error: error.message || "Failed to fetch location",
                loading: false,
            });

            throw error;
        }
    },

    setLocation: (id: string, data: Location) => {
        set((state) => ({ locations: { ...state.locations, [id]: data } }));
    },

    clearLocations: () => set({ locations: {} }),
}));