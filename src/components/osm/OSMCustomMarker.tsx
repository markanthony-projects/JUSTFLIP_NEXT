"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { DivIcon } from 'leaflet'

export interface OSMCustomMarkerProps {
  position: { lat: number; lng: number };
  label?: string;
  type?: string;
  icon?: DivIcon;
}

const OSMCustomMarker = ({ position, label = "You", type, icon }: OSMCustomMarkerProps) => {
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      setLeaflet(L.default || L);
    });
  }, []);

  const fallbackIcon = useMemo(() => {
  if (!leaflet || icon) return undefined;

  const iconMarkup = renderToStaticMarkup(
    <div
      className="relative flex flex-col items-center"
      style={{ transform: "translate(-50%, -100%)" }}
    >
      <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75 animate-ping" />
      <div className="relative bg-primary text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
        {label}
      </div>
      <div className="w-2 h-2 bg-primary rotate-45 mt-[-4px]" />
    </div>
  );

  return leaflet.divIcon({
    html: iconMarkup,
    className: "custom-osm-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  }, [leaflet, label, icon]);

  if (!leaflet || typeof window === "undefined") {
    return null;
  }

  return <Marker position={[position.lat, position.lng]} icon={icon || fallbackIcon} />;
};

export default OSMCustomMarker;
