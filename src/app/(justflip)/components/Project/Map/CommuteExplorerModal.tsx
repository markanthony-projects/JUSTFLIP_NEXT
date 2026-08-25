"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Project } from "@/src/types";
import { fetchNearbyPlacesBatch, TransformedPlace } from "@/src/services/osm.service";

// Icons
import {
    IoClose,
    IoLocationSharp,
    IoChevronForward,
    IoChevronDown,
    IoChevronUp,
    IoSearchOutline,
    IoTrainOutline,
    IoSchoolSharp,
    IoArrowBack,
} from "react-icons/io5";
import { ImPlus } from "react-icons/im";
import {
    MdHotel,
    MdLocalAtm,
    MdOutlineTempleHindu,
    MdOutlinePark,
    MdLocalPostOffice,
    MdOutlineLocalMovies,
} from "react-icons/md";
import {
    BsBank,
    BsBusFront,
    BsFuelPump,
    BsTelephoneFill,
    BsWhatsapp,
    BsThreeDotsVertical,
} from "react-icons/bs";
import { AiTwotoneShopping } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import { FiMapPin } from "react-icons/fi";
import { TbRoute } from "react-icons/tb";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false });

export const EXPLORER_CATEGORIES = [
    { key: "school", label: "Schools", singular: "School", Icon: IoSchoolSharp },
    { key: "hospital", label: "Hospitals", singular: "Hospital", Icon: ImPlus },
    { key: "hotel", label: "Hotels", singular: "Hotel", Icon: MdHotel },
    { key: "atm", label: "ATMs", singular: "ATM", Icon: MdLocalAtm },
    { key: "temple", label: "Temples", singular: "Temple", Icon: MdOutlineTempleHindu },
    { key: "bank", label: "Banks", singular: "Bank", Icon: BsBank },
    { key: "shopping_mall", label: "Shopping Malls", singular: "Shopping Mall", Icon: AiTwotoneShopping },
    { key: "park", label: "Parks", singular: "Park", Icon: MdOutlinePark },
    { key: "post_office", label: "Post Offices", singular: "Post Office", Icon: MdLocalPostOffice },
    { key: "cinema_hall", label: "Cinema Halls", singular: "Cinema Hall", Icon: MdOutlineLocalMovies },
    { key: "fuel", label: "Petrol Pumps", singular: "Petrol Pump", Icon: BsFuelPump },
    { key: "bus_station", label: "Bus Stations", singular: "Bus Station", Icon: BsBusFront },
    { key: "train_station", label: "Metro / Trains", singular: "Metro / Train Station", Icon: IoTrainOutline },
    { key: "supermarket", label: "Supermarkets", singular: "Supermarket", Icon: TiShoppingCart },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2?: number, lon2?: number): number {
    if (lat2 === undefined || lon2 === undefined || isNaN(lat2) || isNaN(lon2)) return 0;
    const R = 6371;
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

// Subcomponent to automatically frame property & nearby places at an optimal, comfortable zoom level
const MapBoundsFitter = dynamic(
    () =>
        import("react-leaflet").then((mod) => {
            const Component = ({
                points,
                defaultCenter,
                placePoints = [],
            }: {
                points: [number, number][];
                defaultCenter: [number, number];
                placePoints?: [number, number][];
            }) => {
                const map = mod.useMap();
                useEffect(() => {
                    // 1. If a specific place is selected, fit bounds between property and that place
                    if (points.length >= 2 && !isNaN(points[0][0]) && !isNaN(points[1][0])) {
                        try {
                            const bounds = L.latLngBounds(points);
                            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14.5 });
                        } catch (err) {}
                    }
                    // 2. If places exist for active category, frame them nicely with the central property
                    else if (placePoints.length > 0 && defaultCenter && !isNaN(defaultCenter[0])) {
                        try {
                            const allPoints = [defaultCenter, ...placePoints];
                            const bounds = L.latLngBounds(allPoints);
                            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
                        } catch (err) {
                            map.setView(defaultCenter, 13);
                        }
                    }
                    // 3. Default center fallback at clear, comfortable zoom 13
                    else if (defaultCenter && !isNaN(defaultCenter[0]) && !isNaN(defaultCenter[1])) {
                        map.setView(defaultCenter, 13);
                    }
                }, [points, defaultCenter, placePoints, map]);
                return null;
            };
            return Component;
        }),
    { ssr: false }
);

interface CommuteExplorerModalProps {
    project: Project;
    initialCategory?: string;
    onClose: () => void;
}

export default function CommuteExplorerModal({
    project,
    initialCategory = "school",
    onClose,
}: CommuteExplorerModalProps) {
    const coordinates = project?.coordinates || {};
    const rawLat = parseFloat(
        coordinates?.lat || (project as any)?.latitude || (project as any)?.location?.latitude || (project as any)?.city?.latitude
    );
    const rawLng = parseFloat(
        coordinates?.lng || (project as any)?.longitude || (project as any)?.location?.longitude || (project as any)?.city?.longitude
    );
    const lat = !isNaN(rawLat) && rawLat !== 0 ? rawLat : 12.9716;
    const lng = !isNaN(rawLng) && rawLng !== 0 ? rawLng : 77.5946;

    const locationName = project?.location?.name || project?.city?.name || "Bangalore";
    const cityName = project?.city?.name || "Bangalore";
    const projectName = project?.name || "This Property";
    const headerTitle = project?.name || locationName || "Jigani";

    const [openCategory, setOpenCategory] = useState<string>(initialCategory);
    const [placesMap, setPlacesMap] = useState<Record<string, TransformedPlace[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedPlace, setSelectedPlace] = useState<TransformedPlace | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

    // Desktop sidebar open state
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    // Mobile commute search checkbox / input state
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Prevent body scrolling while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Fetch real places for all categories on mount
    useEffect(() => {
        let isMounted = true;
        const loadAll = async () => {
            setIsLoading(true);
            const types = EXPLORER_CATEGORIES.map((c) => c.key);
            try {
                const results = await fetchNearbyPlacesBatch({ lat, lng }, types, 8000);
                if (isMounted && results) {
                    setPlacesMap(results);
                }
            } catch (err) {
                console.warn("Commute batch load error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadAll();
        return () => {
            isMounted = false;
        };
    }, [lat, lng]);

    // Handle category click: Switch active category and reset selected route
    const handleCategoryClick = (key: string) => {
        setOpenCategory(key);
        setSelectedPlace(null);
    };

    // Handle place selection: sets selected place and fetches road route
    const handleSelectPlace = (place: TransformedPlace, categoryKey: string) => {
        if (selectedPlace?.id === place.id) {
            setSelectedPlace(null);
        } else {
            setSelectedPlace(place);
            setOpenCategory(categoryKey);
        }
    };

    // Reset center on property
    const handleResetCenter = () => {
        setSelectedPlace(null);
    };

    // Fetch road route from Property to Selected Place
    useEffect(() => {
        if (!selectedPlace || isNaN(lat) || isNaN(lng)) {
            setRouteCoordinates([]);
            return;
        }

        const pLat = selectedPlace.geometry?.location?.lat?.();
        const pLng = selectedPlace.geometry?.location?.lng?.();
        if (pLat === undefined || pLng === undefined || isNaN(pLat) || isNaN(pLng)) {
            setRouteCoordinates([]);
            return;
        }

        let isMounted = true;
        const fetchRoute = async () => {
            try {
                const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${pLng},${pLat}?overview=full&geometries=geojson`
                );
                const data = await res.json();
                if (isMounted && data?.routes?.[0]?.geometry?.coordinates) {
                    const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
                        ([cLng, cLat]: [number, number]) => [cLat, cLng]
                    );
                    setRouteCoordinates(coords);
                    return;
                }
            } catch (e) {}

            if (isMounted) {
                setRouteCoordinates([
                    [lat, lng],
                    [pLat, pLng],
                ]);
            }
        };

        fetchRoute();
        return () => {
            isMounted = false;
        };
    }, [selectedPlace, lat, lng]);

    // Places for the active category
    const currentCategoryPlaces = useMemo(() => {
        return placesMap[openCategory] || [];
    }, [placesMap, openCategory]);

    const activeCatObj = useMemo(() => {
        return EXPLORER_CATEGORIES.find((c) => c.key === openCategory) || EXPLORER_CATEGORIES[0];
    }, [openCategory]);

    // Search matches for Commute Search
    const searchFilteredPlaces = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();
        const matches: { place: TransformedPlace; categoryKey: string; categoryLabel: string }[] = [];

        Object.entries(placesMap).forEach(([catKey, list]) => {
            const catObj = EXPLORER_CATEGORIES.find((c) => c.key === catKey);
            list.forEach((place) => {
                const name = (place.tags?.name || place.name || "").toLowerCase();
                if (name.includes(query)) {
                    matches.push({
                        place,
                        categoryKey: catKey,
                        categoryLabel: catObj?.label || catKey,
                    });
                }
            });
        });
        return matches;
    }, [searchQuery, placesMap]);

    // Central Property Marker Icon (Bluish Theme Beacon with pulsing aura)
    const propertyMarkerIcon = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        const iconHtml = ReactDOMServer.renderToString(
            <div className="relative flex items-center justify-center w-24 h-24 pointer-events-none">
                {/* Translucent Blue Outer Aura Circle */}
                <div className="w-20 h-20 rounded-full bg-blue-500/25 animate-pulse flex items-center justify-center">
                    {/* Middle Accent Blue Ring */}
                    <div className="w-14 h-14 rounded-full bg-blue-600/25 flex items-center justify-center">
                        {/* Vibrant Brand Blue Center Pin */}
                        <div className="w-10 h-10 rounded-full bg-[#002B5B] border-2 border-white shadow-[0_4px_16px_rgba(0,43,91,0.5)] flex items-center justify-center">
                            {/* White Map Pin Icon */}
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="text-white drop-shadow-xs"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
        return L.divIcon({
            html: iconHtml,
            className: "property-center-beacon",
            iconSize: [96, 96],
            iconAnchor: [48, 48],
        });
    }, []);

    // Marker for Category Places
    const getPlaceIcon = (IconComp: any, isSelected: boolean) => {
        const iconHtml = ReactDOMServer.renderToString(
            <div
                className={`w-7 h-7 rounded-full ${
                    isSelected
                        ? "bg-[#002B5B] text-white scale-125 ring-4 ring-[#002B5B]/30 shadow-xl"
                        : "bg-[#1E293B] text-white"
                } border-2 border-white shadow-md flex items-center justify-center transition-all`}
            >
                <IconComp size={13} color="#FFFFFF" />
            </div>
        );
        return L.divIcon({
            html: iconHtml,
            className: "category-place-badge",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });
    };

    // Selected place coordinates for map bound fitting
    const selectedLat = selectedPlace?.geometry?.location?.lat?.();
    const selectedLng = selectedPlace?.geometry?.location?.lng?.();
    const boundPoints: [number, number][] = useMemo(() => {
        if (
            !isNaN(lat) &&
            !isNaN(lng) &&
            selectedLat !== undefined &&
            selectedLng !== undefined &&
            !isNaN(selectedLat) &&
            !isNaN(selectedLng)
        ) {
            return [
                [lat, lng],
                [selectedLat, selectedLng],
            ];
        }
        return [];
    }, [lat, lng, selectedLat, selectedLng]);

    const categoryPlacePoints: [number, number][] = useMemo(() => {
        return currentCategoryPlaces
            .map((p) => {
                const pLat = p.geometry?.location?.lat?.();
                const pLng = p.geometry?.location?.lng?.();
                if (pLat !== undefined && pLng !== undefined && !isNaN(pLat) && !isNaN(pLng)) {
                    return [pLat, pLng] as [number, number];
                }
                return null;
            })
            .filter(Boolean) as [number, number][];
    }, [currentCategoryPlaces]);

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col w-screen h-screen overflow-hidden font-sans select-none">
            {/* ========================================================================= */}
            {/* 1. TOP HEADER: MOBILE VIEW (< md)                                         */}
            {/* ========================================================================= */}
            <header className="flex md:hidden w-full h-14 px-3.5 bg-white border-b border-gray-200/80 items-center justify-between z-30 shrink-0 shadow-xs">
                {/* Left: Round Close (X) Button + Title & City */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer shrink-0"
                    >
                        <IoClose size={20} />
                    </button>

                    <div className="flex flex-col truncate max-w-[180px] sm:max-w-[240px]">
                        <h1 className="font-bold text-gray-900 text-sm leading-tight truncate">
                            {headerTitle}
                        </h1>
                        <span className="text-[11px] text-gray-500 flex items-center gap-0.5 leading-none mt-0.5 truncate">
                            <IoLocationSharp size={12} className="text-gray-400 shrink-0" />
                            {cityName}
                        </span>
                    </div>
                </div>

                {/* Right: Green WhatsApp + Yellow Phone + 3-Dots Menu */}
                <div className="flex items-center gap-2">
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `Check out ${headerTitle} in ${locationName}, ${cityName} on JustFlip: ${typeof window !== 'undefined' ? window.location.href : ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share via WhatsApp"
                        className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
                    >
                        <BsWhatsapp size={16} />
                    </a>

                    <a
                        href="tel:+918000000000"
                        aria-label="Call JustFlip Advisory"
                        className="w-8 h-8 rounded-full bg-[#FACC15] hover:bg-yellow-400 text-gray-900 flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
                    >
                        <BsTelephoneFill size={14} />
                    </a>

                    <button
                        type="button"
                        aria-label="More options"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 flex items-center justify-center transition cursor-pointer shrink-0"
                    >
                        <BsThreeDotsVertical size={18} />
                    </button>
                </div>
            </header>

            {/* ========================================================================= */}
            {/* 1. TOP HEADER: DESKTOP / LAPTOP VIEW (>= md)                              */}
            {/* ========================================================================= */}
            <header className="hidden md:flex w-full h-16 px-6 bg-white border-b border-gray-200 items-center justify-between z-30 shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold transition cursor-pointer shadow-2xs"
                    >
                        <IoArrowBack size={16} />
                        <span>Back</span>
                    </button>
                    <span className="font-semibold text-gray-800 text-sm truncate max-w-[320px]">
                        {projectName} - Map Explorer
                    </span>
                </div>

                {/* Commute Search Input */}
                <div className="relative w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <IoSearchOutline size={16} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Commute Search..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#002B5B] focus:ring-1 focus:ring-[#002B5B] transition"
                    />

                    {/* Desktop Search Suggestions Dropdown */}
                    {searchFilteredPlaces && searchFilteredPlaces.length > 0 && (
                        <div className="absolute right-0 mt-1 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 max-h-64 overflow-y-auto z-50">
                            {searchFilteredPlaces.map(({ place, categoryKey, categoryLabel }, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        handleSelectPlace(place, categoryKey);
                                        setSearchQuery("");
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 text-xs cursor-pointer"
                                >
                                    <div className="truncate pr-2">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {place.tags?.name || place.name}
                                        </p>
                                        <p className="text-gray-400 text-[10px]">{categoryLabel}</p>
                                    </div>
                                    <span className="font-medium text-gray-600 shrink-0">
                                        {(place as any).formattedDistance}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ========================================================================= */}
            {/* 2. MAIN MAP CONTAINER & RESPONSIVE PANELS                                 */}
            {/* ========================================================================= */}
            <div className="relative flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden flex flex-col justify-end">
                {/* Full-Screen Interactive Map in Background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    {!isNaN(lat) && !isNaN(lng) && (
                        <MapContainer
                            center={[lat, lng]}
                            zoom={13.5}
                            attributionControl={false}
                            zoomControl={false}
                            scrollWheelZoom={true}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Standard Zoom Control at Bottom Right */}
                            <ZoomControl position="bottomright" />

                            {/* Auto-Fit Bounds between Property and Selected Place (or frame active category places) */}
                            <MapBoundsFitter
                                points={boundPoints}
                                defaultCenter={[lat, lng]}
                                placePoints={categoryPlacePoints}
                            />

                            {/* Selected Place Road Route Polyline */}
                            {routeCoordinates.length >= 2 && (
                                <>
                                    <Polyline
                                        positions={routeCoordinates}
                                        pathOptions={{
                                            color: "#0F172A",
                                            weight: 7,
                                            opacity: 0.3,
                                            lineCap: "round",
                                            lineJoin: "round",
                                        }}
                                    />
                                    <Polyline
                                        positions={routeCoordinates}
                                        pathOptions={{
                                            color: "#002B5B",
                                            weight: 5,
                                            opacity: 1,
                                            lineCap: "round",
                                            lineJoin: "round",
                                        }}
                                    />
                                </>
                            )}

                            {/* Central Property Marker Pin */}
                            {propertyMarkerIcon && (
                                <Marker position={[lat, lng]} icon={propertyMarkerIcon}>
                                    <Popup>
                                        <div className="p-1 text-center">
                                            <p className="font-bold text-xs sm:text-sm text-gray-900">{headerTitle}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                {locationName}, {cityName}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* Nearby Places Markers for the Active Category */}
                            {currentCategoryPlaces.map((place, index) => {
                                const pLat = place.geometry?.location?.lat?.();
                                const pLng = place.geometry?.location?.lng?.();
                                if (pLat === undefined || pLng === undefined || isNaN(pLat) || isNaN(pLng)) {
                                    return null;
                                }

                                const isSelected = selectedPlace?.id === place.id;
                                const placeName = place.tags?.name || place.name || "Nearby Landmark";
                                const dist = (place as any).formattedDistance;

                                return (
                                    <Marker
                                        key={`marker-${place.id || index}`}
                                        position={[pLat, pLng]}
                                        icon={getPlaceIcon(activeCatObj.Icon, isSelected)}
                                        eventHandlers={{
                                            click: () => {
                                                handleSelectPlace(place, openCategory);
                                            },
                                        }}
                                    >
                                        <Popup>
                                            <div className="p-1 min-w-[150px]">
                                                <p className="font-bold text-xs text-gray-900 leading-tight">
                                                    {placeName}
                                                </p>
                                                <p className="text-[11px] text-gray-600 mt-1">
                                                    Distance: <span className="font-semibold text-gray-900">{dist}</span>
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${pLat},${pLng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-block text-[11px] text-[#002B5B] font-semibold underline"
                                                >
                                                    Get Directions ↗
                                                </a>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    )}
                </div>

                {/* ========================================================================= */}
                {/* 3. DESKTOP / LAPTOP FLOATING SIDEBAR (>= md)                              */}
                {/* ========================================================================= */}
                <div
                    className={`hidden md:flex absolute top-4 left-4 z-[1000] w-[320px] lg:w-[360px] max-h-[calc(100%-32px)] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex-col transition-all duration-300 overflow-hidden ${
                        isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
                    }`}
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm md:text-[15px] leading-tight truncate max-w-[240px]">
                                Around {projectName} {locationName ? `${locationName}` : ""}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">Explore nearby landmarks & commute</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleResetCenter}
                            title="Reset to Property Center"
                            className="p-1.5 text-gray-500 hover:text-[#002B5B] hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        >
                            <FiMapPin size={16} />
                        </button>
                    </div>

                    {/* Scrollable Categories Accordion */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100 overscroll-contain">
                        {EXPLORER_CATEGORIES.map(({ key, label, Icon }) => {
                            const isOpen = openCategory === key;
                            const places = placesMap[key] || [];

                            return (
                                <div key={key} className="w-full">
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryClick(key)}
                                        className={`w-full px-4 py-3.5 flex items-center justify-between transition cursor-pointer text-left ${
                                            isOpen ? "bg-blue-50/50" : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={isOpen ? "text-[#002B5B] shrink-0" : "text-gray-600 shrink-0"} />
                                            <span className={`text-sm font-semibold ${isOpen ? "text-[#002B5B] font-bold" : "text-gray-900"}`}>
                                                {label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {places.length > 0 && (
                                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${isOpen ? "bg-[#002B5B]/10 text-[#002B5B]" : "bg-gray-100 text-gray-500"}`}>
                                                    {places.length}
                                                </span>
                                            )}
                                            {isOpen ? (
                                                <IoChevronUp size={16} className="text-[#002B5B]" />
                                            ) : (
                                                <IoChevronDown size={16} className="text-gray-500" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Places List */}
                                    {isOpen && (
                                        <div className="bg-gray-50/70 px-3 py-2 space-y-1 border-t border-gray-100 max-h-60 overflow-y-auto">
                                            {isLoading && places.length === 0 ? (
                                                <div className="py-4 text-center text-xs text-gray-400 animate-pulse">
                                                    Searching verified nearby {label.toLowerCase()}...
                                                </div>
                                            ) : places.length > 0 ? (
                                                places.map((place, idx) => {
                                                    const name = place.tags?.name || place.name;
                                                    const dist = place.formattedDistance;
                                                    const isSelected = selectedPlace?.id === place.id;

                                                    return (
                                                        <button
                                                            key={place.id || idx}
                                                            type="button"
                                                            onClick={() => handleSelectPlace(place, key)}
                                                            className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 text-left transition cursor-pointer ${
                                                                isSelected
                                                                    ? "bg-white shadow-xs border border-[#002B5B] text-[#002B5B] ring-1 ring-[#002B5B]/20 font-medium"
                                                                    : "hover:bg-white/80 text-gray-800"
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-2.5 truncate">
                                                                <div
                                                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                                                        isSelected
                                                                            ? "border-[#002B5B] bg-[#002B5B]"
                                                                            : "border-gray-400 bg-white hover:border-[#002B5B]"
                                                                    }`}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                    )}
                                                                </div>
                                                                <div className="truncate">
                                                                    <p className="text-xs font-semibold truncate leading-snug">
                                                                        {name}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                                                        {dist || "Nearby"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-3 text-center text-xs text-gray-400">
                                                    No verified {label.toLowerCase()} found nearby.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop Floating Route Banner (Top Center) */}
                {selectedPlace && (
                    <div className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 items-center gap-3 text-xs pointer-events-auto">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 truncate max-w-[280px]">
                            <TbRoute size={16} className="text-[#002B5B] shrink-0" />
                            <span className="truncate">{selectedPlace.tags?.name || selectedPlace.name}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="font-bold text-white bg-[#002B5B] px-2.5 py-0.5 rounded-full shrink-0">
                            {(selectedPlace as any).formattedDistance || "Nearby"}
                        </span>
                        <span className="text-gray-300">|</span>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${selectedLat},${selectedLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-[#002B5B] underline font-semibold shrink-0"
                        >
                            Directions ↗
                        </a>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 4. MOBILE SPECIFIC UI (< md)                                              */}
                {/* ========================================================================= */}
                {/* Mobile Floating "Commute Search" Badge on Top Right */}
                <div className="flex md:hidden absolute top-3 right-3 z-[1000] flex-col items-end pointer-events-auto">
                    <label className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg shadow-md border border-gray-200/90 flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer hover:bg-white transition">
                        <input
                            type="checkbox"
                            checked={isSearchOpen}
                            onChange={(e) => setIsSearchOpen(e.target.checked)}
                            className="w-4 h-4 rounded text-gray-900 accent-black cursor-pointer"
                        />
                        <span>Commute Search</span>
                    </label>

                    {/* Expandable Mobile Search Box */}
                    {isSearchOpen && (
                        <div className="mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                                    <IoSearchOutline size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search schools, malls, stations..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black transition"
                                    autoFocus
                                />
                            </div>

                            {searchFilteredPlaces && searchFilteredPlaces.length > 0 && (
                                <div className="mt-1 max-h-48 overflow-y-auto divide-y divide-gray-100">
                                    {searchFilteredPlaces.map(({ place, categoryKey, categoryLabel }, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                handleSelectPlace(place, categoryKey);
                                                setSearchQuery("");
                                                setIsSearchOpen(false);
                                            }}
                                            className="w-full px-2.5 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-xs cursor-pointer"
                                        >
                                            <div className="truncate pr-2">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {place.tags?.name || place.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">{categoryLabel}</p>
                                            </div>
                                            <span className="font-medium text-gray-600 shrink-0">
                                                {(place as any).formattedDistance}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Floating Selected Route Banner */}
                {selectedPlace && (
                    <div className="flex md:hidden absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-gray-200/90 items-center gap-2 text-xs pointer-events-auto max-w-[calc(100%-160px)]">
                        <TbRoute size={15} className="text-[#002B5B] shrink-0" />
                        <span className="font-bold text-gray-900 truncate text-[11px]">
                            {selectedPlace.tags?.name || selectedPlace.name}
                        </span>
                        <span className="bg-[#002B5B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            {(selectedPlace as any).formattedDistance}
                        </span>
                    </div>
                )}

                {/* Mobile Bottom Sheet Drawer (< md) */}
                <div className="flex md:hidden relative z-20 w-full max-h-[46vh] h-[38vh] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 flex-col shrink-0 overflow-hidden">
                    {/* Top Grey Drag Handle */}
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2.5 shrink-0" />

                    {/* Horizontal Scrollable Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto px-4 py-1.5 scrollbar-none shrink-0">
                        {EXPLORER_CATEGORIES.map(({ key, label, Icon }) => {
                            const isActive = openCategory === key;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleCategoryClick(key)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                                        isActive
                                            ? "border-[#002B5B] bg-[#002B5B] text-white shadow-xs"
                                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-2xs"
                                    }`}
                                >
                                    <Icon size={14} className={isActive ? "text-white" : "text-gray-600"} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Section Title Header */}
                    <div className="px-4 pt-3 pb-1.5 border-b border-gray-100 shrink-0">
                        <h2 className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight">
                            {activeCatObj.singular || activeCatObj.label} Near by {headerTitle} {cityName}
                        </h2>
                    </div>

                    {/* List of Places with Distance and Right Chevron */}
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100 overscroll-contain">
                        {isLoading && currentCategoryPlaces.length === 0 ? (
                            <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
                                Loading verified nearby {activeCatObj.label.toLowerCase()}...
                            </div>
                        ) : currentCategoryPlaces.length > 0 ? (
                            currentCategoryPlaces.map((place, idx) => {
                                const isSelected = selectedPlace?.id === place.id;
                                const name = place.tags?.name || place.name || `${activeCatObj.singular} ${idx + 1}`;
                                const dist = (place as any).formattedDistance || "Nearby";

                                return (
                                    <button
                                        key={place.id || idx}
                                        type="button"
                                        onClick={() => handleSelectPlace(place, openCategory)}
                                        className={`w-full px-4 py-3 flex items-center justify-between text-left transition cursor-pointer ${
                                            isSelected ? "bg-blue-50/70" : "hover:bg-gray-50/80 active:bg-gray-100"
                                        }`}
                                    >
                                        <div className="truncate pr-3">
                                            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate leading-snug">
                                                {name}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 shrink-0">
                                            <span>{dist}</span>
                                            <IoChevronForward size={14} className="text-gray-400 shrink-0" />
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-xs text-gray-400">
                                No verified {activeCatObj.label.toLowerCase()} found nearby.
                            </div>
                        )}
                    </div>

                    {/* Mobile Home Bar Indicator */}
                    <div className="w-28 h-1 bg-gray-400/80 rounded-full mx-auto my-2 shrink-0" />
                </div>
            </div>
        </div>
    );
}
