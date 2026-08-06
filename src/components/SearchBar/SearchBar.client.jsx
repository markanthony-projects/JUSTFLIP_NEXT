"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { BsBuildingFillGear } from "react-icons/bs";
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import { FaSearch } from "react-icons/fa";
import { fetchSuggestionsAction } from "./search.actions";
import { formatUrl } from "@/src/utils/URLFormatter";
import { TextField } from "../Inputs";
import { useRouter, usePathname } from "next/navigation";
import { useSearchStore } from "@/src/stores/search.store";
import { useCityStore } from "@/src/stores/city.store";
import NearestCity from "@/src/components/NearestCity/NearestCity.client";

//this list should be outside so that it doesn't gets recreated on every render.
//if this is ketp inside the useEffect tha depends on it will run infinitely.
const searchPlaceholderList = [
    {
        title: "Projects in Bengaluru",
        placeholder: "Search projects like 'Sobha Dream Acres'…",
        aria: "Search Real Estate Projects in Bengaluru"
    },
    {
        title: "New Launch in Bengaluru",
        placeholder: "Search new launch projects in Bengaluru…",
        aria: "Search New Launch Projects in Bengaluru"
    },
    {
        title: "Luxury Homes",
        placeholder: "Search luxury homes in Bengaluru…",
        aria: "Search Luxury Properties"
    },
    {
        title: "Top Localities",
        placeholder: "Search Indiranagar, Whitefield, Koramangala, HSR Layout…",
        aria: "Search Popular Localities in Bengaluru"
    },
    {
        title: "IT Hub Locations",
        placeholder: "Search Whitefield, Electronic City, ORR Belt…",
        aria: "Search IT Hub Locations"
    },
    {
        title: "Near Tech Parks",
        placeholder: "Search near Ecospace, Manyata Tech Park, ITPL…",
        aria: "Search Properties Near Tech Parks"
    },
    {
        title: "Near Metro",
        placeholder: "Search near Metro stations like MG Road, KR Puram…",
        aria: "Search Properties Near Metro"
    },
    {
        title: "Near Landmarks",
        placeholder: "Search near Airport, Silk Board, Majestic…",
        aria: "Search Properties Near Landmarks"
    },
    {
        title: "Flats / Apartments",
        placeholder: "Search Flats & Apartments in Bengaluru…",
        aria: "Search Flats and Apartments"
    },
    {
        title: "Villas / Row Houses",
        placeholder: "Search Villas & Row Houses…",
        aria: "Search Villas"
    },
    {
        title: "Top Developers",
        placeholder: "Search Prestige, Sobha, Brigade, Puravankara…",
        aria: "Search Developers in Bengaluru"
    },
    {
        title: "Ready to Move",
        placeholder: "Search Ready-to-Move Homes in Bengaluru…",
        aria: "Search Ready to Move Homes"
    }
];

const emptySuggestions = {
    projects: [],
    builders: [],
    locations: [],
};

/**
 * The bar renders identically everywhere it is used — header and hero. Height
 * is fixed at 42px on mobile and 45px from `sm` up.
 *
 * @param showCitySelector Mobile-only city selector inside the bar. Off when the
 *   surrounding header already shows one.
 */
export default function SearchBarClient({ showCitySelector = true }) {
    const router = useRouter();
    const pathname = usePathname();
    const { setQuery, query } = useSearchStore();
    const { activeCity } = useCityStore();

    const pathSegments = pathname?.split('/').filter(Boolean) || [];
    const isSearchPage = (pathSegments[0] === 'properties' && pathSegments.length < 5) || pathSegments[0] === 'search';

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState(emptySuggestions);
    const [isPending, startTransition] = useTransition();
    const [placeholderIndex, setPlaceholderIndex] = useState(0)

    useEffect(() => {
        if (search.length === 0) {
            const interval = setInterval(() => {
                setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholderList.length);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [search]);

    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    const flatSuggestions = [
        ...suggestions.projects.map(p => ({ type: "project", data: p })),
        ...suggestions.locations.map(l => ({ type: "location", data: l })),
        ...suggestions.builders.map(b => ({ type: "builder", data: b })),
    ];


    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!search || isSearchPage) {
            setSuggestions(emptySuggestions);
            return;
        }

        debounceRef.current = setTimeout(() => {
            startTransition(async () => {
                const res = await fetchSuggestionsAction(search, activeCity?.id);
                setSuggestions(res);
            });
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [search, isSearchPage, activeCity?.id]);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setSuggestions(emptySuggestions);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearchRedirect = () => {
        setQuery(search);
        if (search && search.trim() !== '') {
            router.push(`/search?q=${encodeURIComponent(search)}`);
        } else {
            router.push(`/search`);
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-4xl min-w-0 flex items-center h-[42px] sm:h-[45px] py-1 pl-3 pr-1 bg-white rounded-full sm:rounded-lg border border-gray-200 sm:border-gray-300 shadow-sm sm:shadow-lg"
        >
            {showCitySelector && (
                <>
                    <div className="shrink-0 lg:hidden w-[62px] sm:w-[84px] h-full">
                        <NearestCity
                            className="relative w-full h-full"
                            buttonClassName="h-full bg-transparent text-[#002B5B] font-semibold text-[11px] sm:text-[12px] gap-0.5 sm:gap-1"
                        />
                    </div>
                    <div className="w-px h-4 sm:h-5 bg-gray-300 shrink-0 mx-2 lg:hidden" />
                </>
            )}

            <div className="relative flex-1 min-w-0 h-full">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search for projects, builders, or locations"
                    className="w-full h-full border-none focus:ring-0 outline-none text-[13px] md:text-sm bg-transparent"
                />

                {!search && (
                    <span
                        key={placeholderIndex}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-[#777] text-[12px] sm:text-xs md:text-sm pointer-events-none animate-slide-up line-clamp-1 md:max-w-[180px] lg:max-w-[290px]"
                    >
                        {searchPlaceholderList[placeholderIndex]?.placeholder}
                    </span>
                )}
            </div>

            <div className="hidden sm:block w-px h-6 bg-gray-300 shrink-0 mx-3" />

            <button
                type="submit"
                aria-label="Search"
                className="shrink-0 inline-flex items-center justify-center gap-2 w-8 h-8 sm:w-auto sm:h-full sm:px-5 rounded-full sm:rounded-md bg-[#002B5B] text-white text-sm font-medium transition-transform duration-200 ease-in-out hover:scale-[1.03] active:scale-95 z-10"
                onClick={handleSearchRedirect}
            >
                <FaSearch className="text-[13px] sm:text-sm" />

                <span className="hidden sm:inline">
                    Search
                </span>
            </button>

            {!!flatSuggestions.length && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border-none rounded-lg shadow-xl z-50 max-h-60 overflow-auto scrollbar-xs">
                        {flatSuggestions.map((item) => {
                            let label, icon, href;

                            if (item.type === "project") {
                                const p = item.data;
                                label = p.name;
                                icon = <PiBuildingApartment />;
                                href = formatUrl(
                                    `/properties/${p.city?.name}/${p.zone?.name}/${p.location?.name}/${p.name}-${p.id}`
                                );
                            }

                            if (item.type === "location") {
                                const l = item.data;
                                label = l.name;
                                icon = <SlLocationPin />;
                                href = `/listings?locationId=${l.id}`;
                            }

                            if (item.type === "builder") {
                                const b = item.data;
                                label = b.name;
                                icon = <BsBuildingFillGear />;
                                href = formatUrl(`/developers/${b.name}-${b.id}`);
                            }

                            return (
                                <Link
                                    key={`${item.type}-${item.data.id}`}
                                    href={href}
                                    className="flex justify-between px-4 py-2 text-xs hover:bg-gray-100"
                                >
                                    <span>{label}</span>
                                    <span className="flex gap-1 text-gray-500">
                                        {icon} {item.type}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
        </div>
    );
}
