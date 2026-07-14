"use client";
import { useEffect, useState } from "react";

export default function MapRecenter({ center }) {
    const [useMap, setUseMap] = useState(null);

    useEffect(() => {
        import("react-leaflet").then((mod) => {
            setUseMap(() => mod.useMap);
        });
    }, []);

    if (!useMap) return null;

    return <RecenterInner useMap={useMap} center={center} />;
}

function RecenterInner({ useMap, center }) {
    const map = useMap();
    useEffect(() => {
        if (center && map) {
            map.setView([center.lat, center.lng]);
        }
    }, [center, map]);
    return null;
}
