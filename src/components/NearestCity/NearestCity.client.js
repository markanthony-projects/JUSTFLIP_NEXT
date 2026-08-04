"use client";

import { useCityStore } from "@/src/stores/city.store";
import { useEffect, useRef, useState } from "react";
import { fetchCityList } from "./nearest-city.actions";
import JustflipService from "@/src/services/JustflipService";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function NearestCityClient({
    initialCity,
    placeholder = "Near Me",
    buttonClassName = "bg-transparent text-white border border-white/40"
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
                    buttonClassName
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
                <div className="absolute z-50 mt-2 left-0 min-w-[160px] bg-white rounded-xl shadow-xl border border-gray-100 py-4 px-4">
                    <div className="flex items-center justify-center space-x-1.5 animate-pulse">
                        <div className="w-1.5 h-1.5 bg-[#002B5B]/40 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#002B5B]/60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#002B5B]/80 rounded-full"></div>
                    </div>
                </div>
            )}

            {open && !loading && (
                <div className="absolute z-50 mt-2 left-0 min-w-[180px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all origin-top-left">
                    <ul className="max-h-[300px] overflow-auto py-1.5 scrollbar-thin scrollbar-thumb-gray-200">
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
                                    "px-4 py-2.5 text-[13px] cursor-pointer transition-colors duration-150 flex items-center justify-between",
                                    activeCity?.id === city?.id
                                        ? "bg-[#F4F9FF] text-[#002B5B] font-semibold"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {city.name}
                                {activeCity?.id === city?.id && (
                                    <svg className="w-4 h-4 text-[#002B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
