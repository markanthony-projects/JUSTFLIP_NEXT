"use client";

import { useEffect, useRef, useState } from "react";
import { useCityStore } from "../stores/city.store";
import JustflipService from "../services/JustflipService";

const cx = (...c) => c.filter(Boolean).join(" ");

const baseInputStyles = `
  h-10 px-3 rounded-md
  text-black text-sm outline-none transition
  border border-transparent
  focus:border-blue-500 focus:ring-0.5 focus:ring-blue-500
`;

const NearestCity = ({ className, placeholder = "Near Me📍" }) => {
    const {
        activeCity,
        setActiveCity,
        cityList,
        setCityList,
        hasResolvedCity,
        hydrateFromCookie,
    } = useCityStore();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    /* Hydrate from cookie on mount */
    useEffect(() => {
        hydrateFromCookie();
    }, [hydrateFromCookie]);

    /* Resolve nearest city only if needed */
    useEffect(() => {
        if (hasResolvedCity || activeCity) return;
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const city = await JustflipService.findNearestCity(
                        coords.latitude,
                        coords.longitude
                    );
                    city && setActiveCity(city);
                } catch (e) {
                    console.error("Nearest city fetch failed", e);
                }
            },
            () => { },
            { timeout: 5000, maximumAge: 600000 }
        );
    }, [hasResolvedCity, activeCity, setActiveCity]);

    /* Fetch city list once when dropdown opens */
    useEffect(() => {
        if (!open || cityList.length) return;

        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await JustflipService.fetchCityList();
                alive && setCityList(data);
            } catch (e) {
                console.error(e);
            } finally {
                alive && setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [open, cityList.length, setCityList]);

    /* Outside click to close */
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cx(
                    baseInputStyles,
                    "border-none text-xs font-medium cursor-pointer w-full flex items-center justify-between",
                    className
                )}
            >
                <span className={cx("truncate", !activeCity && "text-gray-400")}>
                    {activeCity?.name || placeholder}
                </span>

                <svg
                    className={cx(
                        " h-3 w-3 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={cx(
                    "absolute z-50 mt-1 w-full rounded-md bg-white shadow-sm",
                    "transition-all duration-150 origin-top",
                    open
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                )}
            >
                <ul className="max-h-60 overflow-auto scrollbar-xs p-2">
                    {loading && (
                        <li className="px-3 py-2 text-xs text-gray-400">
                            Loading cities…
                        </li>
                    )}

                    {!loading &&
                        cityList.map((city) => (
                            <li
                                key={city?.id}
                                onClick={() => {
                                    setActiveCity(city);
                                    setOpen(false);
                                }}
                                className={cx(
                                    "px-2 py-1 mb-0.5 rounded-sm cursor-pointer text-xs transition",
                                    activeCity?.id === city?.id
                                        ? "bg-black/15 text-blue-600 font-medium"
                                        : "hover:bg-gray-100 text-gray-700"
                                )}
                            >
                                {city.name}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default NearestCity;
