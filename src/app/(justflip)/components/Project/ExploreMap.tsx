"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/src/types";
import { fetchNearbyPlacesBatch, TransformedPlace } from "@/src/services/osm.service";

// Icons
import { IoSchoolSharp, IoShareSocialOutline, IoCopyOutline } from "react-icons/io5";
import { ImPlus } from "react-icons/im";
import { MdLocalAtm, MdOutlineTempleHindu } from "react-icons/md";
import { BsBank, BsBusFront, BsWhatsapp } from "react-icons/bs";
import { AiTwotoneShopping } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import { TbRoute } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
import { toast } from "@/src/utils/toast";

const MapView = dynamic(() => import("./Map/MapView"), { ssr: false });
const CommuteExplorerModal = dynamic(() => import("./Map/CommuteExplorerModal"), { ssr: false });

export const MAP_CATEGORIES = [
    { key: "school", label: "Schools", Icon: IoSchoolSharp },
    { key: "hospital", label: "Hospitals", Icon: ImPlus },
    { key: "atm", label: "ATMs", Icon: MdLocalAtm },
    { key: "temple", label: "Temples", Icon: MdOutlineTempleHindu },
    { key: "bank", label: "Banks", Icon: BsBank },
    { key: "shopping_mall", label: "Shopping Malls", Icon: AiTwotoneShopping },
    { key: "bus_station", label: "Bus Stations", Icon: BsBusFront },
    { key: "supermarket", label: "Supermarkets", Icon: TiShoppingCart },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2?: number, lon2?: number): number {
    if (lat2 === undefined || lon2 === undefined || isNaN(lat2) || isNaN(lon2)) return 0;
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function ExploreMap({ project }: { project: Project }) {
    const coordinates = project?.coordinates || {};
    const rawLat = parseFloat(coordinates?.lat || (project as any)?.latitude || (project as any)?.location?.latitude || (project as any)?.city?.latitude);
    const rawLng = parseFloat(coordinates?.lng || (project as any)?.longitude || (project as any)?.location?.longitude || (project as any)?.city?.longitude);
    const lat = !isNaN(rawLat) && rawLat !== 0 ? rawLat : 12.9716;
    const lng = !isNaN(rawLng) && rawLng !== 0 ? rawLng : 77.5946;
    const locationName = project?.location?.name || project?.city?.name || "";

    const [activeTab, setActiveTab] = useState<string>("school");
    const [placesData, setPlacesData] = useState<Record<string, TransformedPlace[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false);

    // Fetch genuine real places from OpenStreetMap
    useEffect(() => {
        if (isNaN(lat) || isNaN(lng)) return;

        let isMounted = true;
        const fetchPlaces = async () => {
            setIsLoading(true);
            try {
                const types = MAP_CATEGORIES.map((c) => c.key);
                const results = await fetchNearbyPlacesBatch({ lat, lng }, types);
                if (isMounted && results) {
                    setPlacesData(results);
                }
            } catch (err) {
                console.error("OSM fetch error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPlaces();
        return () => {
            isMounted = false;
        };
    }, [lat, lng]);

    // Reset showAll when switching categories
    const handleCategoryChange = (key: string) => {
        setActiveTab(key);
        setShowAll(false);
    };

    // Sort active category places by distance (cap to 5 nearest)
    const sortedPlaces = useMemo(() => {
        const rawPlaces = placesData[activeTab] || [];
        if (!lat || !lng) return rawPlaces;

        return [...rawPlaces]
            .map((p) => {
                const pLat = p.geometry?.location?.lat?.();
                const pLng = p.geometry?.location?.lng?.();
                const dist = (pLat !== undefined && pLng !== undefined)
                    ? calculateDistanceKm(lat, lng, pLat, pLng)
                    : 0;
                return {
                    ...p,
                    distance: dist,
                    formattedDistance: dist > 0 ? `${dist.toFixed(2)} KM` : "",
                };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
    }, [placesData, activeTab, lat, lng]);

    const visiblePlaces = showAll ? sortedPlaces : sortedPlaces.slice(0, 3);
    const activeCategoryObj = MAP_CATEGORIES.find((c) => c.key === activeTab) || MAP_CATEGORIES[0];

    const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const shareText = `Check out ${project?.name || locationName} on Google Maps: ${googleMapsUrl}`;

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(googleMapsUrl);
            toast.success("Google Maps link copied to clipboard!");
        }
    };

    const handleShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: project?.name || "JustFlip Property",
                    text: `View ${project?.name || locationName} on Google Maps`,
                    url: googleMapsUrl,
                });
            } catch (err) {}
        } else {
            handleCopyLink();
        }
    };

    return (
        <section className="w-full">
            {/* Fullscreen Interactive Map Explorer Modal */}
            {isMapModalOpen && (
                <CommuteExplorerModal
                    project={project}
                    initialCategory={activeTab}
                    onClose={() => setIsMapModalOpen(false)}
                />
            )}

            {/* Header with See on Google Maps and Share / Copy / WhatsApp actions */}
            <div className="pb-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                    Locality & Commute
                </h2>

                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    {/* See on Google Maps Link */}
                    <a
                        href={`https://maps.google.com/?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#002B5B] hover:text-blue-800 underline underline-offset-4 cursor-pointer transition text-xs sm:text-[13px]"
                    >
                        See on Google Maps
                    </a>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 sm:gap-2.5 text-gray-600">
                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={handleShare}
                            title="Share"
                            aria-label="Share property"
                            className="p-1 hover:text-[#002B5B] hover:bg-gray-100 rounded-md transition cursor-pointer"
                        >
                            <IoShareSocialOutline size={17} />
                        </button>

                        {/* Copy Link Button */}
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            title="Copy link"
                            aria-label="Copy link to clipboard"
                            className="p-1 hover:text-[#002B5B] hover:bg-gray-100 rounded-md transition cursor-pointer"
                        >
                            <IoCopyOutline size={16} />
                        </button>

                        {/* WhatsApp Button */}
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share on WhatsApp"
                            aria-label="Share on WhatsApp"
                            className="p-1 hover:text-[#25D366] hover:bg-gray-100 rounded-md transition cursor-pointer"
                        >
                            <BsWhatsapp size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Top Map Preview Banner */}
            <div className="relative w-full h-[160px] sm:h-[190px] md:h-[210px] rounded-2xl overflow-hidden my-4 border border-gray-100 bg-slate-100">
                <MapView
                    project={project}
                    activeCategory={activeTab}
                    places={sortedPlaces}
                    isInteractive={false}
                />

                {/* View on Map Centered Button (opens full explorer page) */}
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#002B5B] hover:bg-[#001E3D] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(0,43,91,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                    >
                        <FiMapPin size={15} />
                        <span>View on Map</span>
                    </button>
                </div>
            </div>

            {/* Horizontal Category Pill Filter Buttons */}
            <div className="w-full overflow-x-auto no-scrollbar py-2">
                <div className="flex items-center gap-2 sm:gap-2.5">
                    {MAP_CATEGORIES.map(({ key, label, Icon }) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleCategoryChange(key)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0 ${
                                    isActive
                                        ? "bg-[#002B5B] text-white border border-[#002B5B] shadow-xs font-semibold"
                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
                                }`}
                            >
                                <Icon size={16} className={isActive ? "text-white" : "text-gray-600"} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Subheading */}
            <div className="mt-4 mb-2">
                <h3 className="text-sm md:text-[15px] font-bold text-gray-900">
                    {activeCategoryObj.label} Near by {locationName || "this location"}
                </h3>
            </div>

            {/* Places List */}
            <div className="divide-y divide-gray-100">
                {isLoading ? (
                    <div className="space-y-3 py-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-2 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-4 bg-gray-200 rounded w-16" />
                            </div>
                        ))}
                    </div>
                ) : visiblePlaces.length > 0 ? (
                    visiblePlaces.map((place, index) => {
                        const name = place.tags?.name || place.name || "Nearby Landmark";
                        const distText = (place as any).formattedDistance || "Nearby";

                        return (
                            <div
                                key={place.id || index}
                                className="py-3.5 flex items-center justify-between gap-4 transition-colors"
                            >
                                <span className="text-xs sm:text-sm text-gray-800 font-normal truncate max-w-[70%]">
                                    {name}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium shrink-0">
                                    <TbRoute size={16} className="text-gray-500" />
                                    <span>{distText}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-6 text-center text-xs text-gray-400">
                        No nearby {activeCategoryObj.label.toLowerCase()} found within 5 KM.
                    </div>
                )}
            </div>

            {/* View More / View Less Button */}
            {!isLoading && sortedPlaces.length > 3 && (
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="px-6 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition shadow-2xs cursor-pointer"
                    >
                        {showAll ? "View Less" : "View More"}
                    </button>
                </div>
            )}
        </section>
    );
}