import { create } from "zustand";
import LocationService from "../services/LocationService";

export const useLocationStore = create((set, get) => ({
    locations: {},
    loading: false,
    error: null,

    fetchLocation: async (id, options = {}) => {
        const { locations } = get();

        if (locations[id]) return locations[id];

        set({ loading: true, error: null });

        try {
            const data = await LocationService.fetchLocationById({ id, ...options, });
            set((state) => ({
                locations: { ...state.locations, [id]: data },
                loading: false,
            }));

            return data;

        } catch (error) {
            set({
                error: error.message || "Failed to fetch location",
                loading: false,
            });

            throw error;
        }
    },

    setLocation: (id, data) => {
        set((state) => ({ locations: { ...state.locations, [id]: data, }, }));
    },

    clearLocations: () => set({ locations: {} }),
}));