"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMap, ZoomControl } from "react-leaflet";
import * as L from 'leaflet'

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const OSMCustomMarker = dynamic(() => import("@/src/components/osm/OSMCustomMarker"), { ssr: false });

import { getCoordinates } from "./getCoordinates";
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

//handles interaction desktop and mobile
function MapInteractionFix() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    // Prevent scroll + click propagation
    L.DomEvent.disableScrollPropagation(container);
    L.DomEvent.disableClickPropagation(container);
  }, [map]);

  return null;
}


import { Project } from "@/src/types";

export interface MapViewProps {
  projects?: Project[];
}

function MapView({ projects = [] }: MapViewProps) {
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
    <div 
      className="h-[400px] rounded overflow-hidden shadow relative z-0"
      style={{touchAction: "pan-x pan-y"}}
    >
      <MapContainer
        attributionControl={false}
        zoomControl={false}
        center={[center.lat, center.lng]}
        zoom={12}
        wheelPxPerZoomLevel={250} 
        zoomDelta={0.25}   
        zoomSnap={0.25}
        scrollWheelZoom={true}

        //to stablisize panning
        dragging={true}
        inertia={true}
        // inertiaDeceleration={3000}
        // inertiaMaxSpeed={1500}

        //for mobile actions
        touchZoom={true}
        bounceAtZoomLimits={false}

        //limits for zoomin/zoomout
        minZoom={5}
        maxZoom={18}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl />
        {projects?.map((project: any) => {
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