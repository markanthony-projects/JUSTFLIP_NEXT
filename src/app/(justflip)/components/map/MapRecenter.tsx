"use client";
import { useEffect, useState } from "react";

export default function MapRecenter({ center }: { center: { lat: number; lng: number } }) {
    const [useMap, setUseMap] = useState<any>(null);

    useEffect(() => {
        import("react-leaflet").then((mod) => {
            setUseMap(() => mod.useMap);
        });
    }, []);

    if (!useMap) return null;

    return <RecenterInner useMap={useMap} center={center} />;
}

function RecenterInner({ useMap, center }: { useMap: any; center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (center && map) {
            map.setView([center.lat, center.lng]);
        }
    }, [center, map]);
    return null;
}
