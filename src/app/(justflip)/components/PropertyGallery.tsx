"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "@/src/components/atoms/Image";
import { Media } from "@/src/types";
import { 
    FiCamera, 
    FiMaximize2, 
    FiChevronLeft, 
    FiChevronRight, 
    FiX, 
    FiMapPin, 
    FiImage 
} from "react-icons/fi";
import { MdOutlinePhotoLibrary } from "react-icons/md";

export interface PropertyGalleryProps {
    data?: {
        name?: string;
        medias?: Media[];
        description?: string;
        [key: string]: any;
    };
    title?: string;
    subtitle?: string;
    className?: string;
}

export default function PropertyGallery({ 
    data, 
    title, 
    subtitle,
    className = "" 
}: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);

    // Extract valid images with smart fallbacks
    const images: Media[] = useMemo(() => {
        if (!data?.medias || !Array.isArray(data.medias)) return [];

        // 1. Try to find photos tagged "other", "others", "gallery", "location", etc.
        const filtered = data.medias.filter(
            (o: Media) =>
                o?.url &&
                (o?.type === "image" || !o?.type) &&
                o?.title &&
                ["other", "others", "gallery", "location"].includes(o.title.toLowerCase())
        );

        if (filtered.length > 0) return filtered;

        // 2. Fallback: all media images with a valid url
        return data.medias.filter(
            (o: Media) => o?.url && (o?.type === "image" || !o?.type)
        );
    }, [data?.medias]);

    // Reset index on images change
    useEffect(() => {
        if (images.length > 0) {
            setActiveIndex(0);
        }
    }, [images]);

    const activeImage = images[activeIndex];
    const totalImages = images.length;

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setActiveIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }, [totalImages]);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setActiveIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }, [totalImages]);

    // Keyboard support for navigation & closing lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isLightboxOpen) {
                setIsLightboxOpen(false);
            }
            if (e.key === "ArrowLeft" && (isLightboxOpen || isImageHovered)) {
                handlePrev();
            }
            if (e.key === "ArrowRight" && (isLightboxOpen || isImageHovered)) {
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, isImageHovered, handlePrev, handleNext]);

    if (!data?.name && images.length === 0) {
        return null;
    }

    const displayTitle = title || (data?.name ? `${data.name} - At a Glance` : "Photo Gallery");
    const displaySubtitle = subtitle || "Visual tour of key landmarks and neighborhood surroundings";

    return (
        <section className={`w-full my-6 ${className}`}>
            {/* Header Section */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#002B5B] flex items-center justify-center shadow-xs">
                            <MdOutlinePhotoLibrary size={18} />
                        </div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                            {displayTitle}
                        </h2>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 pl-10">
                        {displaySubtitle}
                    </p>
                </div>

                {totalImages > 0 && (
                    <div className="flex items-center shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            <FiCamera className="text-[#002B5B]" size={13} />
                            {totalImages} {totalImages === 1 ? "Photo" : "Photos"}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            {totalImages === 0 ? (
                // Empty State
                <div className="w-full rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/60 border border-gray-200/80 p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-3">
                        <FiImage size={24} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        No photos uploaded yet
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm">
                        Photos and neighborhood snapshots for {data?.name || "this location"} will be available soon.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-2 sm:p-3 md:p-4 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.04)]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-stretch">
                        
                        {/* Main Image Stage (8 Cols on Desktop) */}
                        <div 
                            className="lg:col-span-8 relative w-full h-[230px] sm:h-[320px] md:h-[400px] lg:h-[420px] rounded-2xl overflow-hidden bg-gray-950 group cursor-pointer"
                            onClick={() => setIsLightboxOpen(true)}
                            onMouseEnter={() => setIsImageHovered(true)}
                            onMouseLeave={() => setIsImageHovered(false)}
                        >
                            {/* Background Active Image */}
                            <Image
                                src={activeImage?.url}
                                alt={activeImage?.alt || `${data?.name || "Location"} view ${activeIndex + 1}`}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Vignette Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none transition-opacity duration-300" />

                            {/* Top Controls: Counter & Expand Button */}
                            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium border border-white/15 shadow-sm">
                                    <FiCamera size={13} className="text-blue-300" />
                                    <span>{activeIndex + 1} / {totalImages}</span>
                                </span>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLightboxOpen(true);
                                    }}
                                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/75 hover:scale-105 active:scale-95 transition-all border border-white/15 shadow-sm group/btn"
                                    title="View Fullscreen"
                                    aria-label="View Fullscreen"
                                >
                                    <FiMaximize2 size={15} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Navigation Arrows */}
                            {totalImages > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-20 opacity-90 sm:opacity-0 group-hover:opacity-100"
                                        aria-label="Previous image"
                                    >
                                        <FiChevronLeft size={20} className="-ml-0.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-800 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-20 opacity-90 sm:opacity-0 group-hover:opacity-100"
                                        aria-label="Next image"
                                    >
                                        <FiChevronRight size={20} className="ml-0.5" />
                                    </button>
                                </>
                            )}

                            {/* Bottom Caption Pill */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs border border-white/10 max-w-[85%] truncate">
                                    <FiMapPin size={13} className="text-red-400 shrink-0" />
                                    <span className="truncate font-medium">
                                        {activeImage?.alt || data?.name || "Locality Showcase"}
                                    </span>
                                </div>

                                <span className="hidden sm:inline-flex text-[11px] text-white/80 font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                    Click to expand
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Strip (4 Cols on Desktop, Scroll on Mobile) */}
                        <div className="lg:col-span-4 flex flex-col justify-between h-full">
                            <div className="w-full overflow-x-auto lg:overflow-hidden scrollbar-hide p-1 sm:p-1.5">
                                <div className="flex lg:grid lg:grid-cols-2 gap-2 sm:gap-2.5">
                                    {images.slice(0, 6).map((img: Media, index: number) => {
                                        if (!img?.url) return null;
                                        const isActive = index === activeIndex;
                                        const isLastAndMore = index === 5 && totalImages > 6;
                                        const remainingCount = totalImages - 5;

                                        return (
                                            <button
                                                key={img.url + index}
                                                type="button"
                                                onClick={() => {
                                                    if (isLastAndMore) {
                                                        setIsLightboxOpen(true);
                                                    } else {
                                                        setActiveIndex(index);
                                                    }
                                                }}
                                                aria-label={isLastAndMore ? `View all ${totalImages} photos` : `View image ${index + 1}`}
                                                className={`relative shrink-0 cursor-pointer rounded-xl overflow-hidden transition-all duration-300 w-24 sm:w-28 md:w-32 lg:w-full h-18 sm:h-20 lg:h-[98px] group/thumb ${
                                                    isActive
                                                        ? "ring-2 ring-[#002B5B] ring-offset-2 shadow-md opacity-100 scale-[0.99]"
                                                        : "opacity-75 hover:opacity-100 hover:scale-[1.02] border border-gray-200"
                                                }`}
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt={img.alt || `Thumbnail ${index + 1}`}
                                                    sizes="(max-width: 1024px) 130px, 200px"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                                                />
                                                
                                                {/* Active Tag Indicator */}
                                                {isActive && !isLastAndMore && (
                                                    <div className="absolute inset-0 bg-[#002B5B]/15 border border-[#002B5B]/30 rounded-xl pointer-events-none" />
                                                )}

                                                {/* +N More Overlay if more than 6 photos exist */}
                                                {isLastAndMore ? (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-1">
                                                        <span className="text-sm lg:text-base font-bold">+{remainingCount}</span>
                                                        <span className="text-[10px] font-medium text-gray-200">More</span>
                                                    </div>
                                                ) : (
                                                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium opacity-80 group-hover/thumb:opacity-100">
                                                        #{index + 1}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* View All Action in Desktop Footer */}
                            {totalImages > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="hidden lg:flex mt-2.5 w-full items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#002B5B] border border-gray-200 text-xs font-semibold transition-colors duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                                >
                                    <FiMaximize2 size={13} />
                                    <span>View All {totalImages} Photos in Fullscreen</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Lightbox Modal */}
            {isLightboxOpen && (
                <div 
                    className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl animate-fade-in p-4 sm:p-6 select-none"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Lightbox Top Bar */}
                    <div 
                        className="flex items-center justify-between text-white z-20 pb-3 border-b border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-300">
                                <FiCamera size={16} />
                            </span>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                                    {displayTitle}
                                </h3>
                                <p className="text-[11px] text-gray-400">
                                    Photo {activeIndex + 1} of {totalImages}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="hidden md:inline-flex text-xs text-gray-400 mr-2">
                                Use ← → arrow keys to navigate
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close Lightbox"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Lightbox Main Stage */}
                    <div 
                        className="relative flex-1 flex items-center justify-center my-3 sm:my-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
                            <Image
                                src={activeImage?.url}
                                alt={activeImage?.alt || `Image ${activeIndex + 1}`}
                                priority
                                sizes="100vw"
                                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
                            />
                        </div>

                        {/* Lightbox Nav Buttons */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-white hover:text-gray-900 text-white border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-30 cursor-pointer"
                                    aria-label="Previous"
                                >
                                    <FiChevronLeft size={24} />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-white hover:text-gray-900 text-white border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-30 cursor-pointer"
                                    aria-label="Next"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Lightbox Bottom Thumbnail Strip */}
                    <div 
                        className="w-full flex justify-center overflow-x-auto py-2 z-20 scrollbar-hide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            {images.map((img: Media, idx: number) => {
                                const isActive = idx === activeIndex;
                                return (
                                    <button
                                        key={img.url + "-modal-" + idx}
                                        type="button"
                                        onClick={() => setActiveIndex(idx)}
                                        className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                                            isActive
                                                ? "ring-2 ring-blue-400 scale-105 opacity-100"
                                                : "opacity-40 hover:opacity-90"
                                        }`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={`Thumb ${idx + 1}`}
                                            sizes="64px"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
