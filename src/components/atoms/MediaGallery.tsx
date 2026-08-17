"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PiX } from "react-icons/pi";

import Modal from "@/src/components/organisms/Modal"; // ← the base modal above

import { Project } from "@/src/types";
import { FaPlay } from "react-icons/fa";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MediaItem {
    id?: string;
    url: string;
    type?: string;
    title?: string;
    alt?: string;
    thumbnailUrl?:string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TABS = [
    { key: "images", label: "Images" },
    { key: "video", label: "Videos" },
    { key: "floor", label: "Floor Plans" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
    return (
        <div className="flex gap-1 pb-2">
            {TABS.map(({ key, label }) => {
                const isActive = activeTab === key;
                return (
                    <button
                        key={key}
                        onClick={() => onTabChange(key)}
                        className={`relative px-4 py-2 text-xs md:text-sm font-medium transition-colors ${isActive
                                ? "text-[#002B5B]"
                                : "text-gray-500 hover:text-black"
                            }`}
                    >
                        {label}
                        {isActive && (
                            <span className="absolute left-1/2 -bottom-[2px] -translate-x-1/2 w-10 h-[3px] rounded-full bg-[#002B5B]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/** Caption pill overlaid at the bottom of a media item */
function Caption({ text }: { text: string }) {
    if (!text) return null;
    return (
        <div className="absolute bottom-1 left-1 right-1 pointer-events-none">
            <div className="inline-flex max-w-full px-2 py-0.5 rounded-full bg-black/60">
                <p className="truncate text-[10px] text-white leading-tight">{text}</p>
            </div>
        </div>
    );
}

/** The large main viewer pane */
function ActiveMediaViewer({ item }: { item: MediaItem }) {
    if (!item) return null;

    const caption = item.alt || item.title || "";
    const isVideo = item.type === "video";
    const isFloor = item.title?.toLowerCase() === "floor plan";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {isVideo ? (
                <VideoViewer item={item} />
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={item.url}
                    alt={caption || (isFloor ? "Floor plan" : "Image")}
                    className={`max-h-full max-w-full object-contain shadow-md ${
                        isFloor ? "border rounded-xl" : "rounded-xl"
                    }`}
                />
            )}
            <Caption text={caption} />
        </div>
    );
}

function VideoViewer({ item }: { item: MediaItem }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [item.url]);

    const handlePlayClick = () => {
        setIsPlaying(true);
        videoRef.current?.play().catch((err) => {
            console.error("Playback failed:", err);
        });
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <video
                ref={videoRef}
                src={item.url}
                controls={isPlaying}
                preload="auto"
                playsInline
                className={`max-h-full max-w-full rounded-xl object-contain shadow-md ${
                    isPlaying ? "block" : "hidden"
                }`}
            />

            {!isPlaying && (
                <div
                    onClick={handlePlayClick}
                    className="group relative w-full h-full flex items-center justify-center cursor-pointer rounded-xl overflow-hidden shadow-md bg-black"
                >
                    {item.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.thumbnailUrl}
                            alt={item.alt || item.title || "Video thumbnail"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-900" />
                    )}

                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    <div className="absolute z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xl transition-transform group-hover:scale-110">
                        <FaPlay className="w-5 h-5 md:w-6 md:h-6 translate-x-0.5 text-white" />
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function Thumbnail({ item, isActive, onClick }: { item: MediaItem; isActive: boolean; onClick: () => void }) {
    const isVideo = item.type === "video";
    const caption = item.alt || item.title || (isVideo ? "Video" : "Image");
    const previewImage = isVideo ? (item.thumbnailUrl || item.url) : item.url;

    return (
        <div
            onClick={onClick}
            className={`relative w-36 h-28 flex-shrink-0 cursor-pointer rounded-lg border overflow-hidden transition-all ${
                isActive
                    ? "ring-2 ring-[#002B5B] scale-[1.03]"
                    : "border-gray-200 hover:border-gray-400 hover:shadow-md"
            }`}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt={caption} className="w-full h-full object-cover" />

            {isVideo && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <FaPlay className="ml-[2px] text-xs font-bold text-black" />
                    </div>
                </div>
            )}
            <Caption text={caption} />
        </div>
    );
}

/**
 * Props
 * ─────
 * modalType    "images" | "video" | "floor"   Which tab to open on
 * properties   object                          Raw project data
 * open         boolean
 * closeModal   () => void
 */
export interface MediaGalleryProps {
    modalType: string;
    properties: Project;
    open: boolean;
    closeModal: () => void;
}

function MediaGallery({ modalType, properties, open, closeModal }: MediaGalleryProps) {
    // ── Derive media lists from properties ──────────────────────────────────
    const { otherImages, floorPlan, videos } = useMemo(() => {
        const medias = properties?.medias ?? [];
        const units = properties?.units ?? [];

        return {
            otherImages: medias.filter(
                (m) => m.type === "image" && m.title?.toLowerCase() === "other"
            ),
            videos: medias.filter((m) => m.type === "video"),
            floorPlan: units.flatMap((u) => u?.floorPlans ?? []),
        };
    }, [properties]);

    // ── State ────────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState(modalType ?? "images");
    const [active, setActive] = useState<MediaItem | null>(null);

    // Sync tab when parent changes modalType
    useEffect(() => {
        if (modalType) setActiveTab(modalType);
    }, [modalType]);

    // Build list for current tab
    const allMedia = useMemo(() => {
        if (activeTab === "images") return otherImages;
        if (activeTab === "video") return videos;
        return floorPlan;
    }, [activeTab, otherImages, videos, floorPlan]);

    // Auto-select first item when tab or open-state changes
    useEffect(() => {
        if (!allMedia.length) { setActive(null); return; }
        const stillValid = active && allMedia.some((m) => (m.id ?? m.url) === (active.id ?? active.url));
        if (!stillValid) setActive(allMedia[0]);
    }, [allMedia, open]); // intentionally omit `active` to avoid loop

    const handleThumbnailClick = useCallback((item: MediaItem) => {
        setActive(item);
    }, []);

    const tabLabel = activeTab === "floor" ? "floor plans" : activeTab;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <Modal isOpen={open} onClose={closeModal} showCloseButton={false} maxWidth="max-w-[1000px]" height="h-[80vh] md:h-[95vh]">

            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 pt-4 pb-3 shrink-0">
                <div>
                    <h2 className="text-md md:text-lg font-semibold text-gray-900">
                        Media Gallery
                    </h2>
                    <p className="text-[8px] md:text-xs text-gray-500 mt-0.5">
                        Browse property images, videos, and floor plans
                    </p>
                </div>
                <button
                    onClick={closeModal}
                    aria-label="Close gallery"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition"
                >
                    <PiX className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Tab bar */}
            <div className="px-4 shrink-0">
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col gap-2 md:gap-4 min-h-0 px-4 pb-4">

                {/* Main viewer */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    {active ? (
                        <ActiveMediaViewer item={active} />
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No {tabLabel} available
                        </p>
                    )}
                </div>

                {/* Thumbnail strip */}
                <div className="shrink-0">
                    <h3 className="text-xs font-medium text-gray-500 mb-2">
                        {allMedia.length > 0 ? "Thumbnails" : "No media available"}
                    </h3>

                    {allMedia.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto overflow-y-hidden p-1 pr-2 scrollbar-hide h-32">
                            {allMedia.map((item) => (
                                <Thumbnail
                                    key={item.id ?? item.url}
                                    item={item}
                                    isActive={(active?.id ?? active?.url) === (item.id ?? item.url)}
                                    onClick={() => handleThumbnailClick(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                            No thumbnails found
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default React.memo(MediaGallery);