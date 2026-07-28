"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineX, HiSearch, HiLocationMarker } from "react-icons/hi";
import { useSearchStore } from "@/src/stores/search.store";
import { useCityStore } from "@/src/stores/city.store";
import { fetchSuggestionsAction } from "@/src/components/SearchBar/search.actions";
import { fetchCityList } from "@/src/components/NearestCity/nearest-city.actions";
import Link from "next/link";
import { formatUrl } from "@/src/utils/URLFormatter";
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import { BsBuildingFillGear } from "react-icons/bs";
import FilterFactory from "@/src/app/(justflip)/components/Search/Filters/FilterFactory";
import { SEARCH_CONFIG } from "@/src/services/search/searchConfig";
import { PortalSearchAdapter } from "@/src/services/search/adapters/PortalSearchAdapter";

const adapter = new PortalSearchAdapter();

const emptySuggestions = {
    projects: [],
    builders: [],
    locations: [],
};

export default function MobileSearchModal() {
    const { isSearchModalOpen, closeSearchModal, setQuery, clearFilters, filters, total } = useSearchStore();
    const { activeCity, setActiveCity, cityList, setCityList } = useCityStore();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState(emptySuggestions);
    const [isPending, startTransition] = useTransition();
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [liveTotal, setLiveTotal] = useState(total);
    const [isCalculating, setIsCalculating] = useState(false);

    const hasFilters = Object.keys(filters || {}).length > 0;

    const [isNavigating, startNavigation] = useTransition();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Close modal automatically when the route finishes changing
    useEffect(() => {
        if (isSearchModalOpen) {
            closeSearchModal();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const debounceRef = useRef(null);

    // Prevent background scrolling
    useEffect(() => {
        if (isSearchModalOpen) {
            document.body.style.overflow = "hidden";
            // If city list is empty, fetch it so user can pick one
            if (cityList.length === 0) {
                setLoadingCities(true);
                fetchCityList().then((cities) => {
                    setCityList(cities);
                    setLoadingCities(false);
                });
            }
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isSearchModalOpen, cityList.length, setCityList]);

    // Handle suggestions
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!search) {
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
    }, [search, activeCity?.id]);

    // Live Total Calculation
    useEffect(() => {
        if (!isSearchModalOpen || !activeCity) return;
        
        setIsCalculating(true);
        const timer = setTimeout(async () => {
            try {
                const data = await adapter.search({ 
                    query: search, 
                    filters, 
                    sort: 'relevance', 
                    page: 1, 
                    limit: 1 
                });
                setLiveTotal(data.total);
            } catch (error) {
                // Ignore abort errors
            } finally {
                setIsCalculating(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search, JSON.stringify(filters), activeCity?.id, isSearchModalOpen]);

    if (!isSearchModalOpen) return null;

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (!activeCity) {
            setShowCityDropdown(true);
            return;
        }
        setQuery(search);

        const params = useSearchStore.getState().toSearchParams();
        const queryString = params.toString();

        startNavigation(() => {
            if (queryString) {
                router.push(`/search?${queryString}`);
            } else {
                router.push(`/search`);
            }
        });
    };

    const handleSelectCity = (city) => {
        setActiveCity(city);
        document.cookie = `activeCity=${encodeURIComponent(JSON.stringify(city))}; path=/; max-age=31536000; SameSite=Lax`;
        setShowCityDropdown(false);
    };

    const flatSuggestions = [
        ...suggestions.projects.map(p => ({ type: "project", data: p })),
        ...suggestions.locations.map(l => ({ type: "location", data: l })),
        ...suggestions.builders.map(b => ({ type: "builder", data: b })),
    ];

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-slide-up md:hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-[#002B5B]">Search Properties</h2>
                <button onClick={closeSearchModal} className="p-2 -mr-2 text-gray-500 hover:text-gray-900">
                    <HiOutlineX className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* Search Form Area */}
                <div className="bg-white p-4 space-y-4 shadow-sm border-b border-gray-200">
                    
                    {/* Mandatory City Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Select City *</label>
                        <button 
                            type="button"
                            onClick={() => setShowCityDropdown(!showCityDropdown)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${!activeCity ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-2">
                                <HiLocationMarker className={activeCity ? 'text-[#002B5B]' : 'text-red-500'} />
                                <span className={activeCity ? 'text-gray-900 font-medium' : 'text-red-500'}>
                                    {activeCity ? activeCity.name : "Tap to select your city"}
                                </span>
                            </div>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {/* City Dropdown List */}
                        {showCityDropdown && (
                            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                {loadingCities ? (
                                    <div className="p-4 text-sm text-center text-gray-500">Loading cities...</div>
                                ) : (
                                    <ul className="py-1">
                                        {cityList.map((city) => (
                                            <li 
                                                key={city.id}
                                                onClick={() => handleSelectCity(city)}
                                                className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-50 last:border-0 flex items-center justify-between ${activeCity?.id === city.id ? 'bg-blue-50 text-[#002B5B] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {city.name}
                                                {activeCity?.id === city.id && <div className="w-2 h-2 rounded-full bg-[#002B5B]" />}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-xl overflow-hidden focus-within:border-[#002B5B] focus-within:ring-1 focus-within:ring-[#002B5B] transition-all">
                            <div className="pl-3 text-gray-400">
                                <HiSearch className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                disabled={!activeCity}
                                placeholder={activeCity ? "Search projects, localities, builders..." : "Select a city first"}
                                className="flex-1 py-3 px-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm disabled:opacity-50"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch("")} className="pr-3 text-gray-400">
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Suggestions or Initial Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {flatSuggestions.length > 0 ? (
                        <div className="bg-white mt-2 border-y border-gray-200 shadow-sm">
                            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestions</span>
                            </div>
                            <ul>
                                {flatSuggestions.map((item) => {
                                    let label, icon, href;

                                    if (item.type === "project") {
                                        const p = item.data;
                                        label = p.name;
                                        icon = <PiBuildingApartment />;
                                        href = formatUrl(`/properties/${p.city?.name}/${p.zone?.name}/${p.location?.name}/${p.name}/${p.id}`);
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
                                        href = formatUrl(`/developer/${b.name}/${b.id}`);
                                    }

                                    return (
                                        <li key={`${item.type}-${item.data.id}`}>
                                            <Link
                                                href={href}
                                                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#002B5B] flex items-center justify-center shrink-0">
                                                    {icon}
                                                </div>
                                                <div className="flex flex-col flex-1 truncate">
                                                    <span className="font-medium text-gray-900 truncate">{label}</span>
                                                    {item.type === "project" && <span className="text-xs text-gray-500 truncate">{item.data.location?.name}, {item.data.city?.name}</span>}
                                                </div>
                                                <span className="text-[10px] uppercase text-gray-400 font-semibold bg-gray-100 px-2 py-1 rounded">{item.type}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full bg-white mt-2 border-t border-gray-200 shadow-sm">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Quick Filters</span>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-thin">
                                {Object.values(SEARCH_CONFIG.filters).map((config) => (
                                    <FilterFactory key={config.key} config={config} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Fixed Search Button */}
                <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
                    <button
                        onClick={clearFilters}
                        disabled={!hasFilters}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-colors ${
                            hasFilters 
                                ? 'border-[#002B5B] text-[#002B5B] hover:bg-blue-50' 
                                : 'border-gray-200 text-gray-400 bg-gray-50'
                        }`}
                    >
                        Clear All
                    </button>
                    
                    <button
                        onClick={handleSearchSubmit}
                        disabled={!activeCity || isNavigating}
                        className={`flex-[1.5] py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all ${
                            activeCity 
                            ? 'bg-[#002B5B] text-white hover:bg-[#001f42] shadow-blue-900/20' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isNavigating ? 'Loading...' : isCalculating ? 'Calculating...' : `See All ${liveTotal > 0 ? liveTotal : ''} Properties`}
                    </button>
                </div>
            </div>
        </div>
    );
}
