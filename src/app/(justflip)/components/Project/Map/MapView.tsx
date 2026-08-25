"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";
import { Project } from "@/src/types";
import { TransformedPlace } from "@/src/services/osm.service";

// Icons
import { BsBusFront, BsBank } from "react-icons/bs";
import { PiAirplaneTiltLight } from "react-icons/pi";
import { IoTrainOutline, IoSchoolSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { AiTwotoneShopping } from "react-icons/ai";
import { MdOutlineLocalMovies, MdLocalAtm, MdOutlineTempleHindu } from "react-icons/md";
import { ImPlus } from "react-icons/im";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });

export interface MapViewProps {
    project: Project;
    activeCategory?: string;
    places?: TransformedPlace[];
    isInteractive?: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
    bus_station: BsBusFront,
    train_station: IoTrainOutline,
    airport: PiAirplaneTiltLight,
    hospital: ImPlus,
    school: IoSchoolSharp,
    shopping_mall: AiTwotoneShopping,
    supermarket: TiShoppingCart,
    movie_theater: MdOutlineLocalMovies,
    atm: MdLocalAtm,
    temple: MdOutlineTempleHindu,
    bank: BsBank,
};

const iconCache = new Map<string, L.DivIcon>();

export const getCategoryIcon = (categoryKey: string): L.DivIcon => {
    if (iconCache.has(categoryKey)) {
        return iconCache.get(categoryKey)!;
    }

    const IconComp = CATEGORY_ICONS[categoryKey] || IoSchoolSharp;
    const iconHtml = ReactDOMServer.renderToString(
        <IconComp size={15} color="#002B5B" />
    );

    const icon = L.divIcon({
        html: `
            <div style="
                display:flex;
                align-items:center;
                justify-content:center;
                width:28px;
                height:28px;
                background:white;
                border-radius:50%;
                box-shadow:0 2px 8px rgba(0,0,0,0.22);
                border: 2px solid #002B5B;
            ">
                ${iconHtml}
            </div>
        `,
        className: "custom-category-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    iconCache.set(categoryKey, icon);
    return icon;
};

export default function MapView({
    project,
    activeCategory = "school",
    places = [],
    isInteractive = false,
}: MapViewProps) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const coordinates = project?.coordinates || {};
    const lat = parseFloat(coordinates?.lat || (project as any)?.latitude || (project as any)?.location?.latitude);
    const lng = parseFloat(coordinates?.lng || (project as any)?.longitude || (project as any)?.location?.longitude);
    const locationName = project?.location?.name || "";
    const cityName = project?.city?.name || "";

    const mapRef = useRef<any>(null);

    useEffect(() => {
        setMapLoaded(true);
        const timer = setTimeout(() => {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("resize"));
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [isInteractive]);

    if (isNaN(lat) || isNaN(lng)) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                Location coordinates unavailable
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-100">
            {!mapLoaded ? (
                <SkeletonBlock className="absolute inset-0 w-full h-full" />
            ) : (
                <MapContainer
                    key={`${lat}-${lng}-${isInteractive}`}
                    ref={mapRef}
                    center={[lat, lng]}
                    zoom={14}
                    attributionControl={false}
                    scrollWheelZoom={isInteractive}
                    dragging={isInteractive}
                    zoomControl={isInteractive}
                    touchZoom={isInteractive}
                    doubleClickZoom={isInteractive}
                    style={{ width: "100%", height: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Main Property Location Marker */}
                    <OSMCustomMarker
                        position={{ lat, lng }}
                        label={project?.name || `${locationName}, ${cityName}`}
                    />

                    {/* Nearby Places Markers for the selected Category */}
                    {places?.map((place, index) => {
                        const pLat = place.geometry?.location?.lat?.();
                        const pLng = place.geometry?.location?.lng?.();
                        if (pLat === undefined || pLng === undefined || isNaN(pLat) || isNaN(pLng)) {
                            return null;
                        }

                        return (
                            <OSMCustomMarker
                                key={`place-${place.id || index}`}
                                position={{ lat: pLat, lng: pLng }}
                                icon={getCategoryIcon(activeCategory)}
                                label={place.name || place.tags?.name || "Place"}
                            />
                        );
                    })}
                </MapContainer>
            )}
        </div>
    );
}