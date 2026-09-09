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
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
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

export interface UnifiedMediaItem extends MediaItem {
  section: "images" | "video" | "floor";
  globalIndex: number;
  sectionIndex: number;
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
  initialIndex?: number;
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
  initialIndex = 0,
}: MediaGalleryProps) {
  const effectiveProject = properties || project;
  const isModalOpen = open ?? isOpen ?? false;
  const handleClose = closeModal || onClose || (() => { });

  // Extract all media collections
  const { allImages, floorPlan, videos } = useMemo(() => {
    const medias = effectiveProject?.medias ?? [];
    const units = effectiveProject?.units ?? [];

    const seenUrls = new Set<string>();
    const imageList: MediaItem[] = [];

    // Prioritize banner or displayImage first
    const bannerUrl =
      (effectiveProject as any)?.banner?.url ||
      (effectiveProject as any)?.displayImage;

    if (bannerUrl) {
      seenUrls.add(bannerUrl);
      imageList.push({
        url: bannerUrl,
        title: "Main Banner",
        alt: `${effectiveProject?.name || "Property"} Banner`,
        type: "image",
      });
    }

    // Add remaining images
    medias.forEach((m: any) => {
      if (
        m?.url &&
        (m.type === "image" || !m.type) &&
        !seenUrls.has(m.url)
      ) {
        seenUrls.add(m.url);
        imageList.push(m);
      }
    });

    const vids = medias.filter(
      (m: any) =>
        m?.url &&
        (m.type === "video" ||
          m.title?.toLowerCase() === "video" ||
          /\.(mp4|webm|ogg|mov)$/i.test(m.url) ||
          m.url.includes("youtube.com") ||
          m.url.includes("youtu.be") ||
          m.url.includes("vimeo.com"))
    );

    const fps = units
      .flatMap((u: any) => u?.floorPlans ?? [])
      .filter((fp: any) => fp?.url);

    return {
      allImages: imageList,
      videos: vids,
      floorPlan: fps,
    };
  }, [effectiveProject]);

  // Combined continuous list containing ALL sections in sequential order
  const allMediaItems: UnifiedMediaItem[] = useMemo(() => {
    const items: UnifiedMediaItem[] = [];
    let globalIdx = 0;

    allImages.forEach((item, idx) => {
      items.push({
        ...item,
        section: "images",
        sectionIndex: idx,
        globalIndex: globalIdx++,
      });
    });

    videos.forEach((item, idx) => {
      items.push({
        ...item,
        section: "video",
        sectionIndex: idx,
        globalIndex: globalIdx++,
      });
    });

    floorPlan.forEach((item, idx) => {
      items.push({
        ...item,
        section: "floor",
        sectionIndex: idx,
        globalIndex: globalIdx++,
      });
    });

    return items;
  }, [allImages, videos, floorPlan]);

  const normalizedModalType = useMemo(() => normalizeTab(modalType), [modalType]);

  const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Initialize and select correct index when modal opens
  useEffect(() => {
    if (isModalOpen && allMediaItems.length > 0) {
      setIsZoomed(false);
      document.body.style.overflow = "hidden";

      const targetSection = normalizedModalType;
      if (targetSection === "images") {
        const photoItems = allMediaItems.filter((i) => i.section === "images");
        const safePhotoIdx = Math.max(0, Math.min(initialIndex ?? 0, photoItems.length - 1));
        const matched = photoItems[safePhotoIdx];
        if (matched) {
          setCurrentGlobalIndex(matched.globalIndex);
        } else {
          setCurrentGlobalIndex(0);
        }
      } else {
        const matched = allMediaItems.find((i) => i.section === targetSection);
        if (matched) {
          setCurrentGlobalIndex(matched.globalIndex);
        } else {
          setCurrentGlobalIndex(0);
        }
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, normalizedModalType, initialIndex, allMediaItems]);

  const totalItems = allMediaItems.length;
  const safeIndex = totalItems > 0 ? Math.max(0, Math.min(currentGlobalIndex, totalItems - 1)) : 0;
  const activeItem = totalItems > 0 ? allMediaItems[safeIndex] : null;

  // Active tab is always driven automatically by activeItem.section
  const activeTab = activeItem?.section || "images";

  const tabCounts: Record<string, number> = {
    images: allImages.length,
    video: videos.length,
    floor: floorPlan.length,
  };

  const sectionTotal = activeItem ? tabCounts[activeItem.section] : 0;
  const sectionIndex = activeItem?.sectionIndex ?? 0;

  // Tab click handler: jumps to the first item of that section
  const handleTabChange = (tabKey: string) => {
    const targetSection = normalizeTab(tabKey);
    const targetIdx = allMediaItems.findIndex((item) => item.section === targetSection);
    if (targetIdx !== -1) {
      setIsZoomed(false);
      setCurrentGlobalIndex(targetIdx);
    }
  };

  // Continuous Navigation across sections:
  // Clicking Next automatically advances to the next section when photos end!
  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    setIsZoomed(false);
    setCurrentGlobalIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
  }, [totalItems]);

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    setIsZoomed(false);
    setCurrentGlobalIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
  }, [totalItems]);

  // Native Fullscreen Toggle
  const toggleNativeFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation & Esc key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleClose, handlePrev, handleNext]);

  // Auto-scroll active thumbnail into view smoothly
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.querySelector(
        `[data-global-index="${safeIndex}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [safeIndex]);

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

  // Generate VideoObject Schema for search engines
  const videoSchemas = useMemo(() => {
    if (!videos || videos.length === 0) return null;
    const propertyName = effectiveProject?.name || "Property";
    const defaultThumbnail =
      allImages[0]?.url ||
      (effectiveProject as any)?.displayImage ||
      (effectiveProject as any)?.banner?.url ||
      "https://justflip.in/logo.png";
    const propertyDesc =
      effectiveProject?.description ||
      `Watch property walkthrough and video tour for ${propertyName} on JustFlip.`;

    const schemas = videos.map((v, idx) => {
      const isEmbed =
        v.url.includes("youtube.com") ||
        v.url.includes("youtu.be") ||
        v.url.includes("vimeo.com");
      return buildVideoObjectSchema({
        name:
          v.alt ||
          v.title ||
          `${propertyName} - Video Tour ${videos.length > 1 ? idx + 1 : ""}`.trim(),
        description: propertyDesc,
        thumbnailUrl:
          (v as any)?.thumbnail ||
          (v as any)?.preview ||
          (v as any)?.thumbnailUrl ||
          defaultThumbnail,
        contentUrl: !isEmbed ? v.url : undefined,
        embedUrl: isEmbed ? v.url : undefined,
      });
    });

    return schemas.length === 1 ? schemas[0] : schemas;
  }, [videos, allImages, effectiveProject]);

  if (!isModalOpen) return null;

  return (
    <>
      {videoSchemas && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemas) }}
        />
      )}

      {/* Truly Fullscreen Immersive Modal */}
      <div
        className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 text-white flex flex-col select-none overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Top Header Bar ──────────────────────────────────────── */}
        <div className="h-16 shrink-0 bg-slate-900/90 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3 z-30 backdrop-blur-md">
          {/* Title & Item Counter */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {effectiveProject?.name || "Property Showcase"}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {activeTab === "images"
                ? "Photo"
                : activeTab === "video"
                  ? "Video"
                  : "Floor Plan"}{" "}
              {sectionTotal > 0 ? sectionIndex + 1 : 0} of {sectionTotal}
              {totalItems > 1 && (
                <span className="text-slate-500 ml-1.5 hidden md:inline">
                  • All Media {safeIndex + 1} of {totalItems}
                </span>
              )}
            </span>
          </div>

          {/* Segmented Switcher Tabs */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-lg bg-slate-800/80 border border-white/10">
            {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
              const count = tabCounts[key] || 0;
              const isActive = activeTab === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-[#002B5B] text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-700 text-slate-300"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Zoom, Native Fullscreen, Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom toggle button */}
            {activeTab !== "video" && totalItems > 0 && (
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                title={isZoomed ? "Reset zoom" : "Zoom in"}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                {isZoomed ? (
                  <FiZoomOut className="w-3.5 h-3.5" />
                ) : (
                  <FiZoomIn className="w-3.5 h-3.5" />
                )}
                <span>{isZoomed ? "Reset Zoom" : "Zoom"}</span>
              </button>
            )}

            {/* Native Fullscreen Button */}
            <button
              type="button"
              onClick={toggleNativeFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="hidden sm:flex w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-4 h-4" />
              ) : (
                <FiMaximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              title="Close (Esc)"
              aria-label="Close"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-rose-600 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
            >
              <FiX className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs Bar */}
        <div className="sm:hidden flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 border-b border-white/10 z-20">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
            const count = tabCounts[key] || 0;
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${isActive
                    ? "bg-[#002B5B] text-white"
                    : "bg-slate-800 text-slate-300"
                  }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Fullscreen Stage ─────────────────────────────────── */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 relative w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-slate-950"
        >
          {activeItem ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {activeTab === "video" || activeItem.type === "video" ? (
                <VideoPlayer key={activeItem.url} item={activeItem} />
              ) : (
                <div
                  onDoubleClick={() => setIsZoomed((prev) => !prev)}
                  className={`relative w-full h-full flex items-center justify-center overflow-auto ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.url}
                    alt={activeItem.alt || activeItem.title || "Property media"}
                    className={`max-h-full max-w-full object-contain shadow-2xl transition-transform duration-300 ease-out select-none ${isZoomed ? "scale-150 cursor-grab" : "scale-100"
                      } ${activeTab === "floor" ? "bg-white p-3 sm:p-5" : ""}`}
                  />
                </div>
              )}

              {/* Previous & Next Navigation Buttons */}
              {totalItems > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous image"
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                  >
                    <FiChevronLeft className="w-6 h-6 -ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next image"
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                  >
                    <FiChevronRight className="w-6 h-6 ml-0.5" />
                  </button>
                </>
              )}

              {/* Caption Overlay */}
              {activeTab !== "video" &&
                (activeItem.alt || activeItem.title) && (
                  <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex justify-center">
                    <div className="max-w-xl px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs text-center font-medium shadow-xl truncate">
                      {activeItem.alt || activeItem.title}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center mb-3 border border-slate-800">
                <FiImage className="w-7 h-7" />
              </div>
              <p className="text-base font-semibold text-slate-300">
                No media available
              </p>
            </div>
          )}
        </div>

        {/* ── Bottom Thumbnail Strip (ALL Sections Available) ─────── */}
        {totalItems > 0 && (
          <div className="h-20 sm:h-24 shrink-0 bg-slate-900/95 border-t border-white/10 px-3 sm:px-4 py-2 flex items-center justify-center z-30 backdrop-blur-md">
            <div
              ref={thumbnailContainerRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-2 [scrollbar-width:thin] [scrollbar-color:#475569_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600 max-w-6xl w-full justify-start sm:justify-center"
            >
              {allMediaItems.map((item, idx) => {
                const isSelected = idx === safeIndex;
                const isVideo = item.section === "video";
                const isFloor = item.section === "floor";
                const thumbSrc = isVideo
                  ? item.thumbnailUrl || item.url
                  : item.url;

                const isFirstOfSection =
                  idx === 0 || allMediaItems[idx - 1]?.section !== item.section;

                const sectionBadge =
                  item.section === "images"
                    ? { label: "Photos", icon: FiImage }
                    : item.section === "video"
                      ? { label: "Videos", icon: FiVideo }
                      : { label: "Floor Plans", icon: FiLayers };

                const SectionIcon = sectionBadge.icon;

                return (
                  <React.Fragment key={item.id ?? `${item.url}-${idx}`}>
                    {/* Section Divider Badge in Rail */}
                    {isFirstOfSection && allMediaItems.length > 3 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-white/10 text-[11px] font-bold text-slate-300 shrink-0 select-none">
                        <SectionIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>{sectionBadge.label}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      data-global-index={idx}
                      onClick={() => {
                        setCurrentGlobalIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`group relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 overflow-hidden transition-all duration-200 cursor-pointer ${isSelected
                          ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105 opacity-100 shadow-lg"
                          : "opacity-45 hover:opacity-90 ring-1 ring-white/15 hover:ring-white/40"
                        } ${isFloor ? "bg-white" : "bg-slate-900"}`}
                      title={`${sectionBadge.label} #${item.sectionIndex + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbSrc}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Video overlay icon */}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xs">
                            <FaPlay className="w-2 h-2 translate-x-0.2" />
                          </div>
                        </div>
                      )}

                      {/* Floor plan mini badge */}
                      {isFloor && (
                        <div className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/60 text-[9px] font-medium text-white">
                          FP
                        </div>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Player Subcomponent (Cinema Size & Embed Support)
// ─────────────────────────────────────────────────────────────────────────────
function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
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

  if (embedUrl) {
    return (
      <div className="w-full h-full max-w-5xl flex items-center justify-center p-2 sm:p-4">
        <iframe
          src={embedUrl}
          title={item.title || "Video Player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full max-h-[80vh] aspect-video shadow-2xl border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
      <video
        ref={videoRef}
        src={item.url}
        controls={isPlaying}
        preload="auto"
        playsInline
        autoPlay={isPlaying}
        className={`w-full h-full max-h-[80vh] object-contain shadow-2xl ${isPlaying ? "block" : "hidden"
          }`}
      />

      {!isPlaying && (
        <div
          onClick={handlePlayClick}
          className="group relative w-full h-full max-h-[80vh] flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl bg-black"
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