"use client";

import { useCityStore } from "@/src/stores/city.store";
import { useEffect, useRef, useState } from "react";
import { fetchCityList } from "./nearest-city.actions";
import JustflipService from "@/src/services/JustflipService";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function NearestCityClient({
    initialCity,
    placeholder = "Near Me",
}) {
    const { activeCity, setActiveCity, setCityList, cityList } = useCityStore();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (initialCity) {
            setActiveCity(initialCity);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const lat = coords?.latitude || 12.9716;
                    const lng = coords?.longitude || 77.5946;
                    const city = await JustflipService.findNearestCity(lat, lng);
                    city && setActiveCity(city);
                } catch (e) {
                    console.error("Nearest city fetch failed", e);
                }
            },
            () => { },
            { timeout: 5000, maximumAge: 600000 }
        );
    }, [initialCity, setActiveCity]);

    /* ---------------- Fetch city list on demand ---------------- */
    useEffect(() => {
        if (!open || cityList.length) return;

        setLoading(true);

        (async () => {
            try {
                const cities = await fetchCityList();
                setCityList(cities);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, cityList.length, setCityList]);

    /* ---------------- Outside click ---------------- */
    useEffect(() => {
        const handler = (e) =>
            ref.current && !ref.current.contains(e.target) && setOpen(false);

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative w-full max-w-[100px] h-[25px]">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cx(
                    "w-full h-full cursor-pointer px-2 rounded-md text-xs flex justify-between items-center",
                    "bg-transparent text-white border border-white/40"
                )}
            >
                <span className="truncate">
                    {activeCity?.name || placeholder}
                </span>

                <svg
                    className={cx("h-3 w-3 transition-transform", open && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {loading && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-sm">
                    <ul className="p-2">
                        <li className="text-xs">Loading…</li>
                    </ul>
                </div>
            )}

            {open && !loading && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-sm">
                    <ul className="max-h-60 overflow-auto p-2">
                        {cityList.map((city) => (
                            <li
                                key={city?.id}
                                onClick={() => {
                                    setActiveCity(city);
                                    document.cookie = `activeCity=${encodeURIComponent(
                                        JSON.stringify(city)
                                    )}; path=/; max-age=31536000; SameSite=Lax`;
                                    setOpen(false);
                                }}
                                className={cx(
                                    "px-2 py-1 rounded-sm text-xs cursor-pointer",
                                    activeCity?.id === city?.id
                                        ? "bg-black/15 text-blue-600"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                {city.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
