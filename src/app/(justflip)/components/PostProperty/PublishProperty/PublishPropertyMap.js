"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Modal from "@/src/components/organisms/Modal";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

// Leaflet icon fix
const L = typeof window !== "undefined" ? require("leaflet") : null;

const defaultIcon = L
  ? L.icon({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })
  : null;

// Handle map click
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// 🔥 Auto move map when coords change
const ChangeMapView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center[0] && center[1] && map && typeof map.flyTo === 'function') {
      map.flyTo(center, 15, { animate: true });
    }
  }, [center, map]);

  return null;
};

const PublishPropertyMap = ({ isOpen, onClose, coordinates, onSave }) => {
  const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

  const [tempCoords, setTempCoords] = useState(DEFAULT_CENTER);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (coordinates?.lat != null && coordinates?.lng != null) {
      setTempCoords(coordinates);
    }
  }, [coordinates, isOpen]);

  // Click on map
  const handleMapClick = (latlng) => {
    setTempCoords({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  };

  // Save
  const handleSave = () => {
    onSave(tempCoords);
    onClose();
  };

  if (!isClient) return null;

  const mapCenter = useMemo(() => [
    tempCoords?.lat ?? DEFAULT_CENTER.lat,
    tempCoords?.lng ?? DEFAULT_CENTER.lng,
  ], [tempCoords?.lat, tempCoords?.lng]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="p-2 md:p-4 bg-white"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-[#002B5B]">
          Locate Your Property
        </h2>

        <p className="text-sm text-gray-500">
          Click on map or enter coordinates manually.
        </p>

        <div className="h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden border">
          <MapContainer
            center={mapCenter}
            zoom={tempCoords?.lat ? 15 : 5}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEvents onMapClick={handleMapClick} />

            <ChangeMapView center={mapCenter} />

            {tempCoords?.lat && tempCoords?.lng && (
              <Marker
                position={[tempCoords.lat, tempCoords.lng]}
                icon={defaultIcon}
              />
            )}
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              placeholder="Latitude"
              id="latitude"
              name="latitude"
              value={tempCoords?.lat ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setTempCoords((prev) => ({
                  ...prev,
                  lat: value === "" ? null : parseFloat(value),
                }));
              }}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              placeholder="Longitude"
              id="longitude"
              name="longitude"
              value={tempCoords?.lng ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setTempCoords((prev) => ({
                  ...prev,
                  lng: value === "" ? null : parseFloat(value),
                }));
              }}
              className="border p-2 rounded"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-[#002B5B] text-white px-4 py-2 rounded"
          >
            Save Location
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PublishPropertyMap;