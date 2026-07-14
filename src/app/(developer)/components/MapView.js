"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getCoordinates } from "./getCoordinates";
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });

import { useState, useEffect } from "react";
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

function MapView({ projects }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const center =
    projects?.length > 0
      ? getCoordinates(projects[0])
      : DEFAULT_CENTER;

  if (!isClient) {
    return (
      <div className="h-[400px] rounded overflow-hidden shadow">
        <SkeletonBlock className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded overflow-hidden shadow z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects?.map((project) => {
          const coords = getCoordinates(project);

          if (!coords?.lat || !coords?.lng) return null;

          return (
            <OSMCustomMarker
              key={project?.id || `${coords.lat}-${coords.lng}`}
              position={coords}
              label={project?.name || "Project"}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;