import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City } from "@/src/types";

const COOKIE_KEY = "activeCity";
const STORAGE_KEY = "city-store";

const setCityCookie = (city: City | null) => {
    if (typeof window === "undefined") return;

    if (!city) {
        document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
        return;
    }

    const value = encodeURIComponent(
        JSON.stringify({ id: city.id, name: city.name })
    );

    document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=2592000; SameSite=Lax`;
};

const getCityFromCookie = (): City | null => {
    if (typeof window === "undefined") return null;

    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_KEY}=([^;]+)`));
    if (!match) return null;

    try {
        return JSON.parse(decodeURIComponent(match[2]));
    } catch {
        return null;
    }
};

export interface CityState {
    activeCity: City | null;
    cityList: City[];
    hasResolvedCity: boolean;
}

export interface CityActions {
    setActiveCity: (city: City | null) => void;
    hydrateFromCookie: () => void;
    setCityList: (cities?: City[]) => void;
    clearCityStore: () => void;
}

export const useCityStore = create<CityState & CityActions>()(
    persist(
        (set, get) => ({
            activeCity: null,
            cityList: [],
            hasResolvedCity: false,

            setActiveCity: (city) => {
                if (city && get().activeCity?.id === city.id) return;

                set({
                    activeCity: city,
                    hasResolvedCity: !!city,
                });

                setCityCookie(city);
            },

            hydrateFromCookie: () => {
                if (get().activeCity) return;

                const city = getCityFromCookie();
                if (!city?.id) return;

                set({
                    activeCity: city,
                    hasResolvedCity: true,
                });
            },

            setCityList: (cities = []) => {
                if (!cities.length || get().cityList.length) return;

                const { activeCity } = get();

                // Resolve full city object if name-only exists
                if (activeCity && !activeCity.slug) {
                    const resolved = cities.find(
                        (c) => c.id === activeCity.id
                    );
                    if (resolved) set({ activeCity: resolved });
                }

                set({ cityList: cities });
            },

            clearCityStore: () => {
                set({
                    activeCity: null,
                    cityList: [],
                    hasResolvedCity: false,
                });
                setCityCookie(null);
            },
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                activeCity: state.activeCity,
                hasResolvedCity: state.hasResolvedCity,
            }),
            skipHydration: true,
        }
    )
);

