"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineX, HiSearch, HiLocationMarker, HiOutlinePencil } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";
import { useSearchStore } from "@/src/stores/search.store";
import { useCityStore } from "@/src/stores/city.store";
import { fetchSuggestionsAction } from "@/src/components/SearchBar/search.actions";
import Link from "next/link";
import { formatUrl } from "@/src/utils/URLFormatter";
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import { BsBuildingFillGear } from "react-icons/bs";
import FilterFactory from "@/src/app/(justflip)/components/Search/Filters/FilterFactory";
import LocationSelectorModal from "@/src/app/(justflip)/components/Search/LocationSelectorModal";
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
    const { activeCity, setActiveCity } = useCityStore();
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState(emptySuggestions);
    const [isPending, startTransition] = useTransition();
    const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);
    const [showLocationEditor, setShowLocationEditor] = useState(false);
    const [selectedLocalities, setSelectedLocalities] = useState([]);
    const [liveTotal, setLiveTotal] = useState(total);
    const [isCalculating, setIsCalculating] = useState(false);

    const hasFilters = Object.keys(filters || {}).length > 0;

    const [isNavigating, startNavigation] = useTransition();

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const submitRef = useRef(false);

    // Close modal automatically when the route finishes changing, BUT only if user submitted
    useEffect(() => {
        if (isSearchModalOpen && submitRef.current) {
            closeSearchModal();
            submitRef.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const debounceRef = useRef(null);

    // Clear localities when the city changes
    useEffect(() => {
        setSelectedLocalities([]);
    }, [activeCity?.id]);

    // Prevent background scrolling
    useEffect(() => {
        if (isSearchModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isSearchModalOpen]);

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
            setShowLocationEditor(true);
            return;
        }
        setQuery(search);

        const params = useSearchStore.getState().toSearchParams();
        const queryString = params.toString();

        submitRef.current = true;
        startNavigation(() => {
            if (queryString) {
                router.push(`/search?${queryString}`);
            } else {
                router.push(`/search`);
            }
        });
    };

    const flatSuggestions = [
        ...suggestions.projects.map(p => ({ type: "project", data: p })),
        ...suggestions.locations.map(l => ({ type: "location", data: l })),
        ...suggestions.builders.map(b => ({ type: "builder", data: b })),
    ];

    const toggleLocality = (loc) => {
        if (selectedLocalities.find(l => l.id === loc.id)) {
            setSelectedLocalities(selectedLocalities.filter(l => l.id !== loc.id));
        } else {
            setSelectedLocalities([...selectedLocalities, loc]);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-[110] bg-white flex flex-col animate-slide-up md:hidden h-[100dvh] w-full`}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 pt-[max(1rem,env(safe-area-inset-top))] border-b border-gray-100 shadow-sm bg-white z-10">
                    <h2 className="text-xl font-extrabold text-[#002B5B] tracking-tight">Search Properties</h2>
                    <button onClick={closeSearchModal} className="p-2 -mr-2 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 scrollbar-hide">
                        {/* Search Form Area */}
                        <div className="bg-white p-1.5 pb-2 shadow-sm border-b border-gray-200">
                            {/* Top section: You are searching in ... Edit */}
                            {activeCity && (
                                <div className="flex justify-between items-center px-2 py-1 mb-1 bg-blue-50/40 rounded-lg">
                                    <p className="text-[13px] text-gray-500">
                                        You are searching in <span className="font-semibold text-[#002B5B]">{activeCity.name}</span>
                                    </p>
                                    <button
                                        onClick={() => setShowLocationEditor(true)}
                                        className="text-[13px] text-[#002B5B] font-medium flex items-center gap-1.5 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                                    >
                                        Edit <HiOutlinePencil className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* City/Localities/Projects Card */}
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-4 mb-2 transition-all">
                                <h3 className="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    City, Localities & Projects
                                </h3>

                                <div className="flex flex-wrap gap-2.5 mb-2">
                                    {/* Selected City Pill */}
                                    {activeCity && (
                                        <div className="flex items-center gap-0.5 px-2 py-1.5 !text-xs font-medium bg-gradient-to-r from-[#e8f6f3] to-[#d1f2eb] text-gray-800 border border-[#1abc9c]/50 rounded-full text-[13px] shadow-sm">
                                            {activeCity.name}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveCity(null);
                                                    setShowLocationEditor(true);
                                                }}
                                                className="text-gray-500 hover:text-red-500 ml-1 flex items-center justify-center transition-colors bg-white/50 rounded-full p-0.5"
                                            >
                                                <HiOutlineX className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Added Localities */}
                                    {selectedLocalities.slice(0, 2).map((loc) => (
                                        <div key={loc.id} className="flex items-center gap-0.5 px-2 py-1.5 !text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-[13px] font-medium shadow-sm hover:border-gray-300 transition-colors">
                                            {loc.name}
                                            <button
                                                type="button"
                                                onClick={() => toggleLocality(loc)}
                                                className="text-gray-400 hover:text-red-500 ml-1 flex items-center justify-center transition-colors bg-white rounded-full p-0.5 shadow-sm"
                                            >
                                                <HiOutlineX className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* +X more Button */}
                                    {selectedLocalities.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowLocationEditor(true)}
                                            className="flex items-center gap-1 px-2 py-1.5 bg-blue-50 !text-xs text-[#002B5B] border border-blue-100 rounded-full text-[13px] font-medium hover:bg-blue-100 transition-colors shadow-sm"
                                        >
                                            +{selectedLocalities.length - 2} more
                                        </button>
                                    )}

                                    {/* Add Locality Button or Search Bar */}
                                    {activeCity ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowLocationEditor(true)}
                                            className="flex items-center !text-xs gap-1 px-5 py-2 bg-white text-[#002B5B] border-2 border-dashed border-blue-200 rounded-full text-[13px] font-medium hover:bg-blue-50 hover:border-[#002B5B] transition-all"
                                        >
                                            + Add Locality
                                        </button>
                                    ) : (
                                        <div className="relative w-full group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <HiSearch className="h-4 w-4 text-[#002B5B] group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                            <input
                                                type="text"
                                                readOnly
                                                onClick={() => setShowLocationEditor(true)}
                                                placeholder="Search in a City, Locality or Project..."
                                                className="text-sm block w-full pl-12 pr-10 py-2.5 border-2 border-gray-100 rounded-2xl leading-5 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#002B5B] hover:shadow-[0_4px_20px_rgba(0,43,91,0.08)] sm:text-sm cursor-pointer transition-all duration-300"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Use Current Location */}
                                <button className="flex items-center gap-2.5 text-[#002B5B] font-semibold text-[11px] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1 py-1.5 rounded-xl transition-all w-full justify-center mt-1 group border border-blue-100">
                                    <BiTargetLock className="w-5 h-5" />
                                    Use my Current Location
                                </button>
                            </div>

                        </div>

                        {/* Suggestions or Initial Content */}
                        <div className="bg-gray-50">
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
                                                        onClick={() => { submitRef.current = true; }}
                                                        className="flex items-center gap-3.5 px-5 py-3.5 text-sm hover:bg-blue-50/50 border-b border-gray-100 last:border-0 group transition-colors"
                                                    >
                                                        <div className="w-9 h-9 rounded-full bg-blue-50 text-[#002B5B] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#002B5B] group-hover:text-white transition-all duration-300 shadow-sm">
                                                            {icon}
                                                        </div>
                                                        <div className="flex flex-col flex-1 truncate">
                                                            <span className="font-semibold text-gray-900 truncate group-hover:text-[#002B5B] transition-colors">{label}</span>
                                                            {item.type === "project" && <span className="text-xs text-gray-500 truncate">{item.data.location?.name}, {item.data.city?.name}</span>}
                                                        </div>
                                                        <span className="text-[10px] uppercase text-[#002B5B] font-bold bg-blue-50 px-2.5 py-1 rounded-md shadow-sm border border-blue-100/50">{item.type}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <div className="px-4 py-2">
                                    {Object.values(SEARCH_CONFIG.filters).map((config) => (
                                        <FilterFactory key={config.key} config={config} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Fixed Search Button */}
                    <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-100 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                        <button
                            onClick={clearFilters}
                            disabled={!hasFilters}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-[14px] border transition-all active:scale-[0.98] ${hasFilters
                                ? 'border-[#002B5B] text-[#002B5B] hover:bg-blue-50 hover:shadow-sm'
                                : 'border-gray-200 text-gray-400 bg-gray-50 opacity-70'
                                }`}
                        >
                            Clear All
                        </button>

                        <button
                            onClick={handleSearchSubmit}
                            disabled={!activeCity || isNavigating}
                            className={`flex-[2] py-3.5 px-[9px] rounded-xl font-bold text-[14px] shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1 ${activeCity
                                ? 'bg-gradient-to-r from-[#002B5B] to-[#004f9f] text-white hover:from-[#001f42] hover:to-[#003b7a] shadow-blue-900/25 hover:shadow-blue-900/40'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isNavigating ? 'Loading...' : isCalculating ? 'Calculating...' : (
                                <>
                                    <HiSearch className="w-4 h-4 opacity-80" />
                                    <span>See All {liveTotal > 0 ? liveTotal : ''} Properties</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {showLocationEditor && (
                <LocationSelectorModal
                    onClose={() => setShowLocationEditor(false)}
                    selectedLocalities={selectedLocalities}
                    toggleLocality={toggleLocality}
                />
            )}
        </>
    );
}
