"use client";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MAP_CATEGORIES } from "./mapCategories";
import { fetchNearbyPlaces } from "@/src/services/osm.service";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });
const MapRecenter = dynamic(() => import("./MapRecenter"), { ssr: false });
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

export default function GoogleMapFilter({ locationData }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [places, setPlaces] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);

    const defaultCenter = useMemo(() => {
        const lat = parseFloat(locationData?.coordinates?.lat);
        const lng = parseFloat(locationData?.coordinates?.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }

        return { lat: 12.9716, lng: 77.5946 };
    }, [locationData]);

    useEffect(() => {
        if (!mapVisible || !selectedCategory) return;
        let ignore = false;
        const loadPlaces = async () => {
            try {
                const results = await fetchNearbyPlaces(defaultCenter, selectedCategory);
                if (!ignore) setPlaces(results);
            } catch (err) {
                console.error("Map Error:", err);
                if (!ignore) setPlaces([]);
            }
        };
        loadPlaces();
        return () => { ignore = true; };
    }, [mapVisible, selectedCategory, defaultCenter]);

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-3">Navigate & Explore</h2>

            <div className="relative rounded-lg overflow-hidden border border-gray-300 shadow z-0">
                <div className={!mapVisible ? "blur-sm" : ""} style={{ height: "450px" }}>
                    {!mapVisible && <SkeletonBlock className="absolute inset-0 w-full h-full z-0" />}
                        <MapContainer
                            center={[defaultCenter.lat, defaultCenter.lng]}
                            zoom={14}
                            scrollWheelZoom={false}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            <OSMCustomMarker position={defaultCenter} label="You" />
                            
                            <Circle 
                                center={[defaultCenter.lat, defaultCenter.lng]} 
                                radius={5000} 
                                pathOptions={{ fillColor: "#ADD8E6", color: "#1E90FF", fillOpacity: 0.2 }} 
                            />

                            {places.map((place, i) => {
                                const lat = place?.geometry?.location?.lat?.();
                                const lng = place?.geometry?.location?.lng?.();
                                if (!lat || !lng) return null;

                                return (
                                    <OSMCustomMarker key={i} position={{ lat, lng }} label={place.name} />
                                );
                            })}
                            
                            <MapRecenter center={defaultCenter} />
                        </MapContainer>
                </div>

                {!mapVisible && (
                    <button
                        onClick={() => setMapVisible(true)}
                        aria-label="Load map"
                        className="absolute inset-0 m-auto flex items-center justify-center gap-2 
             w-44 h-11 rounded-full 
             bg-[#002B5B] text-white text-sm font-semibold
             shadow-lg transition-all duration-300
             hover:bg-[#001f40] hover:scale-105
             active:scale-95
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002B5B] z-[1000]"
                    >
                        Load Map
                    </button>
                )}
            </div>

            <div className="flex overflow-x-auto py-4">
                <div className="grid grid-flow-col grid-rows-2 gap-2">
                    {MAP_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;

                        return (
                            <button
                                key={cat.type}
                                onClick={() => setSelectedCategory(cat.type)}
                                className={`px-3 py-2 min-w-[160px] text-xs rounded-full border flex items-center gap-2 justify-center ${selectedCategory === cat.type
                                    ? "bg-[#002B5B] text-white"
                                    : "bg-white text-[#002B5B]"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}