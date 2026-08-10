import { create } from "zustand";
import CityService from "@/src/services/CityService";
import { City } from "@/src/types";

export interface CityDataState {
  cityMap: Record<string, City | null>;
  loadingMap: Record<string, boolean>;
  errorMap: Record<string, string | null>;
}

export interface CityDataActions {
  fetchCity: (id: string, options?: { force?: boolean }) => Promise<City | null | void>;
  getCityById: (id: string) => City | null;
  clearCity: (id: string) => void;
  reset: () => void;
}

export const useCityStore = create<CityDataState & CityDataActions>((set, get) => ({
  cityMap: {},      
  loadingMap: {},  
  errorMap: {},      

  fetchCity: async (id: string, options = { force: false }) => {
    const { cityMap, loadingMap } = get();

    if (!options.force && cityMap[id]) {
      return cityMap[id] as City;
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
    } catch (error: any) {
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
  getCityById: (id: string) => {
    return get().cityMap[id] || null;
  },

  // ✅ invalidate cache
  clearCity: (id: string) => {
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