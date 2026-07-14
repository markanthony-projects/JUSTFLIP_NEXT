"use client";
import ActionButton from "@/src/components/atoms/ActionButton";
import { toast } from "@/src/utils/toast";
import { useEffect, useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { IoCopyOutline, IoLogoWhatsapp } from "react-icons/io5";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { fetchNearbyPlacesBatch } from "@/src/services/osm.service";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

export default function MapView({ project, setBusStations, setAirports, setTrainStations, setHospitals, setSchools, setMovieTheaters, setShoppingMalls, setSuperMarkets, onLoadingChange }) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const coordinates = project?.coordinates || {};
    const lat = parseFloat(coordinates?.lat);
    const lng = parseFloat(coordinates?.lng);
    const locationName = project?.location?.name || "";
    const cityName = project?.city?.name || "";
    const pinCode = project?.pincode || "";

    useEffect(() => {
        setMapLoaded(true);
        // Force a resize event after a short delay to ensure Leaflet renders correctly
        setTimeout(() => {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("resize"));
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (!mapLoaded || isNaN(lat) || isNaN(lng)) return;

        const loadAllNearby = async () => {
            if (onLoadingChange) onLoadingChange(true);
            // Add a small random jitter (0-1000ms) to prevent simultaneous bursts
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
            
            const types = [
                "bus_station",
                "airport",
                "train_station",
                "hospital",
                "school",
                "movie_theater",
                "shopping_mall",
                "supermarket"
            ];

            try {
                const results = await fetchNearbyPlacesBatch({ lat, lng }, types);
                
                // Map results back to the respective setters
                if (results.bus_station) setBusStations(results.bus_station.slice(0, 5));
                if (results.airport) setAirports(results.airport.slice(0, 5));
                if (results.train_station) setTrainStations(results.train_station.slice(0, 5));
                if (results.hospital) setHospitals(results.hospital.slice(0, 5));
                if (results.school) setSchools(results.school.slice(0, 5));
                if (results.movie_theater) setMovieTheaters(results.movie_theater.slice(0, 5));
                if (results.shopping_mall) setShoppingMalls(results.shopping_mall.slice(0, 5));
                if (results.supermarket) setSuperMarkets(results.supermarket.slice(0, 5));
                
            } catch (err) {
                console.error("OSM Batch load error:", err);
            } finally {
                if (onLoadingChange) onLoadingChange(false);
            }
        };

        loadAllNearby();
    }, [mapLoaded, lat, lng, setBusStations, setAirports, setTrainStations, setHospitals, setSchools, setMovieTheaters, setShoppingMalls, setSuperMarkets, onLoadingChange]);

    const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}`;

    const handleShareClick = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ url: mapUrl });
            } else {
                toast.info("Sharing not supported");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(mapUrl);
            toast.success("Copied");
        } catch (error) {
            console.error(error);
        }
    };

    const handleWhatsAppShare = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check this location: ${mapUrl}`)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="lg:col-span-3 md:col-span-3">
            <div className="h-[300px] md:h-[400px] mb-2 rounded overflow-hidden border border-gray-200 relative z-0">
                {!mapLoaded ? (
                    <SkeletonBlock className="absolute inset-0 w-full h-full" />
                ) : (
                    !isNaN(lat) && !isNaN(lng) && (
                        <MapContainer
                            key={`${lat}-${lng}`}
                            center={[lat, lng]}
                            zoom={14}
                            scrollWheelZoom={false}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <OSMCustomMarker position={{ lat, lng }} label={`${locationName}, ${cityName}, ${pinCode}`} />
                        </MapContainer>
                    )
                )}
            </div>
            <div className="flex flex-wrap justify-between items-center w-full">
                <span className="text-xs truncate max-w-[270px]">{project?.name}</span>
                <div className="flex justify-between md:justify-center items-center gap-1  w-full md:w-auto">

                    <a href={mapUrl} className="text-xs md:text-sm font-semibold underline  md:min-w-[100px]" target="_blank" rel="noopener noreferrer"  >See on Google Maps</a>
                    <div className="flex">
                        <ActionButton label="Share" onClick={handleShareClick} icon={<CiShare2 />} />
                        <ActionButton label="Copy" onClick={handleCopyUrl} icon={<IoCopyOutline />} />
                        <ActionButton label="WhatsApp" onClick={handleWhatsAppShare} icon={<IoLogoWhatsapp />} />
                    </div>
                </div>
            </div>
        </div>
    );
}