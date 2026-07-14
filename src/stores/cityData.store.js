import { create } from "zustand";
import CityService from "@/src/services/CityService";

export const useCityStore = create((set, get) => ({
  cityMap: {},      
  loadingMap: {},  
  errorMap: {},      

  fetchCity: async (id, options = { force: false }) => {
    const { cityMap, loadingMap } = get();

    if (!options.force && cityMap[id]) {
      return cityMap[id];
    }

    if (loadingMap[id]) return;

    try {
      set((state) => ({
        loadingMap: { ...state.loadingMap, [id]: true },
        errorMap: { ...state.errorMap, [id]: null },
      }));

      const city = await CityService.getCityById(id);

      set((state) => ({
        cityMap: { ...state.cityMap, [id]: city },
        loadingMap: { ...state.loadingMap, [id]: false },
      }));

      return city;
    } catch (error) {
      set((state) => ({
        loadingMap: { ...state.loadingMap, [id]: false },
        errorMap: {
          ...state.errorMap,
          [id]: error.message || "Something went wrong",
        },
      }));
    }
  },

  // ✅ selector helper (clean usage)
  getCityById: (id) => {
    return get().cityMap[id] || null;
  },

  // ✅ invalidate cache
  clearCity: (id) => {
    set((state) => {
      const newMap = { ...state.cityMap };
      delete newMap[id];

      return { cityMap: newMap };
    });
  },

  // ✅ reset all
  reset: () => {
    set({
      cityMap: {},
      loadingMap: {},
      errorMap: {},
    });
  },
}));