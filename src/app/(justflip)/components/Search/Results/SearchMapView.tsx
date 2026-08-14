"use client";
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchStore } from '@/src/stores/search.store';
import { useCityStore } from '@/src/stores/city.store';
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });
const MapRecenter = dynamic(() => import("@/src/app/(justflip)/components/map/MapRecenter"), { ssr: false });

export default function SearchMapView() {
  const { results } = useSearchStore();
  const { activeCity } = useCityStore();

  const defaultCenter = useMemo(() => {
    // Try to find the first result with coordinates to recenter dynamically
    for (const project of results) {
       const lat = project?.coordinates?.lat || project?.location?.coordinates?.lat || project?.locationData?.coordinates?.lat;
       const lng = project?.coordinates?.lng || project?.location?.coordinates?.lng || project?.locationData?.coordinates?.lng;
       if (lat && lng) {
           return { lat: parseFloat(lat), lng: parseFloat(lng) };
       }
    }

    // Fallback to activeCity if no results have coords
    if (activeCity?.coordinates?.lat && activeCity?.coordinates?.lng) {
      return { 
        lat: parseFloat(activeCity.coordinates.lat as string), 
        lng: parseFloat(activeCity.coordinates.lng as string) 
      };
    }
    
    // Ultimate Fallback (Bangalore)
    return { lat: 12.9716, lng: 77.5946 };
  }, [results, activeCity]);

  return (
    <div className="w-full h-[calc(100vh-80px)] sticky top-[80px] z-0 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
        <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {results.map((project: any, i: number) => {
                const lat = project?.coordinates?.lat || project?.location?.coordinates?.lat || project?.locationData?.coordinates?.lat;
                const lng = project?.coordinates?.lng || project?.location?.coordinates?.lng || project?.locationData?.coordinates?.lng;
                
                if (!lat || !lng) return null;

                return (
                    <OSMCustomMarker 
                        key={`${project.id}-${i}`} 
                        position={{ lat: parseFloat(lat), lng: parseFloat(lng) }} 
                        label={project.name} 
                    />
                );
            })}
            
            <MapRecenter center={defaultCenter} />
        </MapContainer>
    </div>
  );
}
