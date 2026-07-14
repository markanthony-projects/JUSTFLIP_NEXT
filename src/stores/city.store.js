import { create } from "zustand";
import { persist } from "zustand/middleware";

const COOKIE_KEY = "activeCity";
const STORAGE_KEY = "city-store";

const setCityCookie = (city) => {
    if (typeof window === "undefined") return;

    if (!city) {
        document.cookie = `activeCity=; path=/; max-age=0`;
        return;
    }

    const value = encodeURIComponent(
        JSON.stringify({ id: city.id, name: city.name })
    );

    document.cookie = `activeCity=${value}; path=/; max-age=2592000; SameSite=Lax`;
};

const getCityFromCookie = () => {
    if (typeof window === "undefined") return null;

    const match = document.cookie.match(/(^| )activeCity=([^;]+)/);
    if (!match) return null;

    try {
        return JSON.parse(decodeURIComponent(match[2]));
    } catch {
        return null;
    }
};


export const useCityStore = create(
    persist(
        (set, get) => ({
            activeCity: null,
            cityList: [],
            hasResolvedCity: false,

            setActiveCity: (city) => {
                if (!city || get().activeCity?.id === city.id) return;

                set({
                    activeCity: city,
                    hasResolvedCity: true,
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
            name: "city-store",
            partialize: (state) => ({
                activeCity: state.activeCity,
                hasResolvedCity: state.hasResolvedCity,
            }),
            skipHydration: true,
        }
    )
);

