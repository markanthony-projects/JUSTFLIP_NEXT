"use client";
import React, { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";

const OSMCustomMarker = ({ position, label = "You" }) => {
  const [leaflet, setLeaflet] = useState(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      setLeaflet(L.default || L);
    });
  }, []);

  if (!leaflet || typeof window === "undefined") {
    return null;
  }

  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex flex-col items-center" style={{ transform: 'translate(-50%, -100%)', marginTop: '10px' }}>
      <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75 animate-ping" style={{ top: '-12px' }}></span>
      <div className="relative bg-[#002B5B] text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
        {label}
      </div>
      <div className="w-1.5 h-1.5 bg-[#002B5B] rotate-45 mt-[-3px]" />
    </div>
  );

  const customIcon = leaflet.divIcon({
    html: iconMarkup,
    className: "custom-osm-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  return <Marker position={[position.lat, position.lng]} icon={customIcon} />;
};

export default OSMCustomMarker;
