"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiLayers,
  FiVideo,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import Modal from "@/src/components/organisms/Modal";
import { Project } from "@/src/types";
import { buildVideoObjectSchema } from "@/src/utils/schema";

export interface MediaItem {
  id?: string;
  url: string;
  type?: string;
  title?: string;
  alt?: string;
  thumbnailUrl?: string;
}

const TAB_CONFIG = [
  { key: "images", label: "Photos", icon: FiImage },
  { key: "video", label: "Videos", icon: FiVideo },
  { key: "floor", label: "Floor Plans", icon: FiLayers },
];

export interface MediaGalleryProps {
  modalType?: string;
  properties?: Project;
  project?: Project;
  open?: boolean;
  isOpen?: boolean;
  closeModal?: () => void;
  onClose?: () => void;
}

function normalizeTab(type?: string): "images" | "video" | "floor" {
  if (!type) return "images";
  const lower = type.toLowerCase();
  if (lower.includes("video")) return "video";
  if (lower.includes("floor") || lower.includes("plan")) return "floor";
  return "images";
}

function MediaGallery({
  modalType,
  properties,
  project,
  open,
  isOpen,
  closeModal,
  onClose,
}: MediaGalleryProps) {
  const effectiveProject = properties || project;
  const isModalOpen = open ?? isOpen ?? false;
  const handleClose = closeModal || onClose || (() => {});

  // Extract media collections
  const { otherImages, floorPlan, videos } = useMemo(() => {
    const medias = effectiveProject?.medias ?? [];
    const units = effectiveProject?.units ?? [];

    return {
      otherImages: medias.filter(
        (m) => m.type === "image" && m.title?.toLowerCase() === "other"
      ),
      videos: medias.filter((m) => m.type === "video"),
      floorPlan: units.flatMap((u) => u?.floorPlans ?? []),
    };
  }, [effectiveProject]);

  const normalizedModalType = useMemo(() => normalizeTab(modalType), [modalType]);

  const [prevModalType, setPrevModalType] = useState(normalizedModalType);
  const [prevIsOpen, setPrevIsOpen] = useState(isModalOpen);
  const [activeTab, setActiveTab] = useState(normalizedModalType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // React pattern: adjust state during render when prop changes
  if (isModalOpen && (normalizedModalType !== prevModalType || !prevIsOpen)) {
    setPrevModalType(normalizedModalType);
    setPrevIsOpen(isModalOpen);
    setActiveTab(normalizedModalType);
    setCurrentIndex(0);
    setIsZoomed(false);
  } else if (!isModalOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Tab switch handler
  const handleTabChange = (tabKey: string) => {
    setActiveTab(normalizeTab(tabKey));
    setCurrentIndex(0);
    setIsZoomed(false);
  };

  // Current active list
  const currentMediaList = useMemo(() => {
    if (activeTab === "images") return otherImages;
    if (activeTab === "video") return videos;
    return floorPlan;
  }, [activeTab, otherImages, videos, floorPlan]);

  const totalItems = currentMediaList.length;
  const safeIndex = totalItems > 0 ? Math.min(currentIndex, totalItems - 1) : 0;
  const activeItem = totalItems > 0 ? currentMediaList[safeIndex] : null;

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.children[safeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [safeIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handlePrev, handleNext]);

  // Mobile Touch Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Tab counts
  const tabCounts: Record<string, number> = {
    images: otherImages.length,
    video: videos.length,
    floor: floorPlan.length,
  };

  // Generate VideoObject Schema for search engines
  const videoSchemas = useMemo(() => {
    if (!videos || videos.length === 0) return null;
    const propertyName = effectiveProject?.name || "Property";
    const defaultThumbnail = otherImages[0]?.url || (effectiveProject as any)?.displayImage || (effectiveProject as any)?.banner?.url || "https://justflip.in/logo.png";
    const propertyDesc = effectiveProject?.description || `Watch property walkthrough and video tour for ${propertyName} on JustFlip.`;

    const schemas = videos.map((v, idx) => {
      const isEmbed = v.url.includes("youtube.com") || v.url.includes("youtu.be") || v.url.includes("vimeo.com");
      return buildVideoObjectSchema({
        name: v.alt || v.title || `${propertyName} - Video Tour ${videos.length > 1 ? idx + 1 : ""}`.trim(),
        description: propertyDesc,
        thumbnailUrl: (v as any)?.thumbnail || (v as any)?.preview || (v as any)?.thumbnailUrl || defaultThumbnail,
        contentUrl: !isEmbed ? v.url : undefined,
        embedUrl: isEmbed ? v.url : undefined,
      });
    });

    return schemas.length === 1 ? schemas[0] : schemas;
  }, [videos, otherImages, effectiveProject]);

  return (
    <>
      {videoSchemas && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas) }}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        showCloseButton={false}
        maxWidth="max-w-6xl"
        height="h-[90vh] md:h-[94vh]"
        className="bg-white p-0 overflow-hidden flex flex-col transition-all duration-300"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 shrink-0 bg-white z-20">
          <div className="min-w-0 pr-4">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight truncate">
              {effectiveProject?.name ? `${effectiveProject.name} — Gallery` : "Media Gallery"}
            </h2>
          </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close gallery"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Segmented Filter Tabs Bar */}
      <div className="px-4 sm:px-6 py-2 bg-gray-50/80 border-b border-gray-100 shrink-0 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            const count = tabCounts[key] || 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#002B5B] text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-sm">{label}</span>
                <span
                  className={`text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Toolbar: Zoom */}
        {activeTab !== "video" && totalItems > 0 && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Zoom toggle button */}
            <button
              type="button"
              onClick={() => setIsZoomed((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isZoomed
                  ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isZoomed ? <FiZoomOut className="w-3 h-3" /> : <FiZoomIn className="w-3 h-3" />}
              <span>{isZoomed ? "Reset Zoom" : "Zoom"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-950 relative select-none">
        {/* Main Viewer Pane */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 relative flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
        >
          {activeItem ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {activeTab === "video" || activeItem.type === "video" ? (
                <VideoPlayer key={activeItem.url} item={activeItem} />
              ) : (
                <div
                  onDoubleClick={() => setIsZoomed((prev) => !prev)}
                  className={`relative w-full h-full flex items-center justify-center overflow-auto ${
                    isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.url}
                    alt={activeItem.alt || activeItem.title || "Property media"}
                    className={`max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-out ${
                      isZoomed ? "scale-150 cursor-grab" : "scale-100"
                    } ${activeTab === "floor" ? "bg-white p-3" : ""}`}
                  />
                </div>
              )}

              {/* Floating Counter Badge */}
              {totalItems > 1 && (
                <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/15 shadow-md">
                  {safeIndex + 1} / {totalItems}
                </div>
              )}

              {/* Caption Overlay (photos and floor plans only) */}
              {activeTab !== "video" && activeItem.type !== "video" && (activeItem.alt || activeItem.title) && (
                <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none flex justify-center">
                  <div className="max-w-lg px-3.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs text-center font-medium shadow-lg truncate">
                    {activeItem.alt || activeItem.title}
                  </div>
                </div>
              )}

              {/* Previous & Next Floating Navigation Arrows */}
              {totalItems > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous media"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/85 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                  >
                    <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next media"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/85 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                  >
                    <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center mb-2.5 border border-slate-800">
                <FiImage className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">
                No {activeTab === "floor" ? "floor plans" : activeTab} available
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Check other media tabs above
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail Strip with Auto-Scroll */}
        {totalItems > 0 && (
          <div className="shrink-0 bg-black/75 border-t border-white/10 px-3 sm:px-4 py-2">
            <div
              ref={thumbnailContainerRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-1 [scrollbar-width:thin] [scrollbar-color:#475569_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600"
            >
              {currentMediaList.map((item, idx) => {
                const isSelected = idx === safeIndex;
                const isVideo = item.type === "video";
                const thumbSrc = isVideo ? item.thumbnailUrl || item.url : item.url;

                return (
                  <button
                    key={item.id ?? `${item.url}-${idx}`}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 opacity-100 shadow-md"
                        : "opacity-45 hover:opacity-90 ring-1 ring-white/20 hover:ring-white/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbSrc}
                      alt={item.alt || item.title || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {isVideo && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xs">
                          <FaPlay className="w-2 h-2 translate-x-0.2" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Player Subcomponent (Cinema Size & Embed Support)
// ─────────────────────────────────────────────────────────────────────────────
function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return null;
}

function VideoPlayer({ item }: { item: MediaItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const embedUrl = useMemo(() => getEmbedVideoUrl(item.url), [item.url]);

  const handlePlayClick = () => {
    setIsPlaying(true);
    videoRef.current?.play().catch((err) => {
      console.error("Playback failed:", err);
    });
  };

  // If it is a YouTube or Vimeo embed
  if (embedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-1">
        <iframe
          src={embedUrl}
          title={item.title || "Video Player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full max-w-5xl aspect-video rounded-xl shadow-2xl border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={item.url}
        controls={isPlaying}
        preload="auto"
        playsInline
        autoPlay={isPlaying}
        className={`w-full h-full max-h-full max-w-full rounded-xl object-contain shadow-2xl ${
          isPlaying ? "block" : "hidden"
        }`}
      />

      {!isPlaying && (
        <div
          onClick={handlePlayClick}
          className="group relative w-full h-full flex items-center justify-center cursor-pointer rounded-xl overflow-hidden shadow-2xl bg-black"
        >
          {item.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnailUrl}
              alt={item.alt || item.title || "Video thumbnail"}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-slate-950" />
          )}

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

          <div className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-2xl transition-transform group-hover:scale-110">
            <FaPlay className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(MediaGallery);