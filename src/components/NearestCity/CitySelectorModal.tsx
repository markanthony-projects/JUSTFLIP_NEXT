"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HiOutlineOfficeBuilding, HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";
import Modal from "@/src/components/ui/Modal";
import { useCityStore } from "@/src/stores/city.store";
import { ensureCityList } from "./city-list.loader";
import { ensurePopularCities } from "./popular-cities.loader";
import { detectNearestCity } from "./nearest-city.resolver";

const POPULAR_LIMIT = 8;
const AVATAR_PX = 64;

/* Group cities under their first letter, so the full list stays scannable. */
function groupByLetter(cities: any[]) {
    const groups = new Map<string, any[]>();

    for (const city of cities) {
        const letter = (city?.name?.[0] || "#").toUpperCase();
        if (!groups.has(letter)) groups.set(letter, []);
        groups.get(letter)?.push(city);
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

/* ---------------- Popular city tile ---------------- */

const PopularCityTile = memo(function PopularCityTile({ city, selected, onSelect }: { city: any; selected: boolean; onSelect: (city: any) => void }) {
    const [failed, setFailed] = useState(false);
    const showImage = Boolean(city?.banner) && !failed;

    return (
        <button
            type="button"
            onClick={() => onSelect(city)}
            className="group flex flex-col items-center gap-2 cursor-pointer"
        >
            <span
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-50 border-2 transition-colors ${selected
                    ? "border-[#002B5B]"
                    : "border-gray-200 group-hover:border-[#002B5B]/50"
                    }`}
            >
                {showImage ? (
                    <Image
                        src={city.banner}
                        alt=""
                        width={AVATAR_PX}
                        height={AVATAR_PX}
                        sizes={`${AVATAR_PX}px`}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailed(true)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="flex items-center justify-center w-full h-full">
                        <HiOutlineOfficeBuilding className="w-6 h-6 text-gray-400" />
                    </span>
                )}
            </span>

            <span
                className={`text-[12px] leading-tight text-center line-clamp-2 ${selected ? "font-bold text-[#002B5B]" : "font-medium text-gray-600"
                    }`}
            >
                {city?.name}
            </span>
        </button>
    );
});

/* ---------------- City chip ---------------- */

const CityChip = memo(function CityChip({ city, selected, onSelect }: { city: any; selected: boolean; onSelect: (city: any) => void }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(city)}
            className={`h-10 px-3 rounded-lg text-[13px] text-left truncate border transition-colors cursor-pointer ${selected
                ? "bg-[#F4F9FF] border-[#002B5B] text-[#002B5B] font-semibold"
                : "bg-white border-gray-200 text-gray-700 hover:border-[#002B5B]/40 hover:bg-gray-50"
                }`}
        >
            {city?.name}
        </button>
    );
});

/* ---------------- Modal ---------------- */

export interface CitySelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CitySelectorModal({ isOpen, onClose }: CitySelectorModalProps) {
    const activeCity = useCityStore((s) => s.activeCity);
    const cityList = useCityStore((s) => s.cityList);
    const setActiveCity = useCityStore((s) => s.setActiveCity);

    const [query, setQuery] = useState("");
    const [popularCities, setPopularCities] = useState<any[]>([]);
    const [detecting, setDetecting] = useState(false);

    /* Load both lists when the modal opens. Both are cached at module level. */
    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        ensureCityList();
        ensurePopularCities(POPULAR_LIMIT).then((cities) => {
            if (!cancelled) setPopularCities(cities);
        });

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    /* Routed through here (not the parent) so the search box resets on every
       exit path — button, backdrop and Escape all land on Modal's onClose. */
    const close = useCallback(() => {
        setQuery("");
        onClose?.();
    }, [onClose]);

    const handleSelect = useCallback(
        (city: any) => {
            setActiveCity(city);
            close();
        },
        [setActiveCity, close]
    );

    const handleDetect = useCallback(async () => {
        setDetecting(true);
        const city = await detectNearestCity();
        setDetecting(false);
        if (city?.id) close();
    }, [close]);

    const trimmedQuery = query.trim();
    const searching = trimmedQuery.length > 0;

    const filtered = useMemo(() => {
        if (!trimmedQuery) return cityList;
        const q = trimmedQuery.toLowerCase();
        return cityList.filter((c) => c?.name?.toLowerCase().includes(q));
    }, [cityList, trimmedQuery]);

    const grouped = useMemo(() => groupByLetter(filtered), [filtered]);

    const loadingCities = !cityList.length;

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            maxWidth="max-w-2xl"
            height="h-[85vh] sm:h-[80vh]"
            zIndexClass="z-[130]"
        >
            {/* ---------------- Header ---------------- */}
            <div className="shrink-0 px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-[17px] font-bold text-[#002B5B]">
                            Select your city
                        </h2>
                        <p className="mt-0.5 text-[12px] text-gray-500">
                            Properties and prices are shown for the city you pick
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close city selector"
                        className="p-1.5 -mr-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-2 h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-[#002B5B] transition-colors">
                    <HiOutlineSearch className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        autoComplete="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a city"
                        className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 text-[14px] placeholder-gray-400"
                    />
                    {searching && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="p-0.5 rounded-full text-gray-400 hover:text-gray-700"
                        >
                            <HiOutlineX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleDetect}
                    disabled={detecting}
                    className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#002B5B] hover:text-[#001f42] disabled:opacity-60 transition-colors"
                >
                    <BiTargetLock
                        className={`w-4.5 h-4.5 ${detecting ? "animate-spin" : ""}`}
                    />
                    {detecting ? "Detecting your location…" : "Use my current location"}
                </button>
            </div>

            {/* ---------------- Body ---------------- */}
            <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-modern">
                {/* Hidden rather than unmounted while searching, so the avatars
                    are not torn down and re-fetched when the query is cleared. */}
                {popularCities.length > 0 && (
                    <section className={searching ? "hidden" : "mb-7"}>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3.5">
                            Popular cities
                        </h3>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-x-3 gap-y-5">
                            {popularCities.map((city: any) => (
                                <PopularCityTile
                                    key={city?.id}
                                    city={city}
                                    selected={activeCity?.id === city?.id}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3.5">
                        {searching ? "Search results" : "All cities"}
                    </h3>

                    {loadingCities && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-10 rounded-lg bg-gray-100 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {!loadingCities && !filtered.length && (
                        <p className="py-10 text-center text-[13px] text-gray-500">
                            No city matches “{trimmedQuery}”
                        </p>
                    )}

                    {!loadingCities &&
                        grouped.map(([letter, cities]: any) => (
                            <div key={letter} className="mb-5 last:mb-0">
                                <div className="text-[12px] font-bold text-gray-300 mb-2">
                                    {letter}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {cities.map((city: any) => (
                                        <CityChip
                                            key={city?.id}
                                            city={city}
                                            selected={activeCity?.id === city?.id}
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                </section>
            </div>
        </Modal>
    );
}
