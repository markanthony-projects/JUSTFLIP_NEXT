"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import React from "react";

export interface CarouselProps {
    items?: any[];
    renderItem?: (item: any, index: number) => React.ReactNode;
    gap?: number;
    rows?: number;
    rowHeight?: string;
    autoPlay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    endThreshold?: number;
    onReachEnd?: () => void;
    className?: string;
    trackClassName?: string;
    children?: React.ReactNode;
    itemWidth?: number | string;
    aspect?: string;
}

export default function Carousel({
    items = [],
    renderItem,
    gap = 16,
    rows = 1,
    rowHeight = "auto",
    autoPlay = false,
    interval = 4000,
    showArrows = true,
    showDots = true,
    endThreshold = 100,
    onReachEnd,
    className = "",
    trackClassName = "",
    children,
    itemWidth,
    aspect
}: CarouselProps) {

    const trackRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<any>(null);
    const tickingRef = useRef(false);
    const endReachedRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasLeft, setHasLeft] = useState(false);
    const [hasRight, setHasRight] = useState(false);
    const [snapPoints, setSnapPoints] = useState<number[]>([]);

    /*
    |--------------------------------------------------------------------------
    | Update Arrows
    |--------------------------------------------------------------------------
    */

    const updateArrowState = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const { scrollLeft, scrollWidth, clientWidth } = track;
        setHasLeft(scrollLeft > 2);
        setHasRight(scrollLeft + clientWidth < scrollWidth - 2);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Measure Snap Points (Deferred)
    |--------------------------------------------------------------------------
    */

    const measure = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        // If dots are not used, avoid reading offsetLeft on every child to prevent layout thrashing
        if (!showDots && !autoPlay) {
            updateArrowState();
            return;
        }

        const children = Array.from(track.children) as HTMLElement[];
        const uniqueOffsets = Array.from(
            new Set(children.map((child) => child.offsetLeft))
        );

        setSnapPoints(uniqueOffsets);
        updateArrowState();
    }, [showDots, autoPlay, updateArrowState]);

    /*
    |--------------------------------------------------------------------------
    | Find Closest Index
    |--------------------------------------------------------------------------
    */

    const findClosestIndex = useCallback((scrollLeft: number) => {
        if (!snapPoints.length) return 0;

        let closest = 0;
        let minDistance = Infinity;

        for (let i = 0; i < snapPoints.length; i++) {
            const distance = Math.abs(snapPoints[i] - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closest = i;
            }
        }

        return closest;
    }, [snapPoints]);

    /*
    |--------------------------------------------------------------------------
    | Scroll To Index & Smooth Arrow Navigation
    |--------------------------------------------------------------------------
    */

    const scrollToIndex = useCallback((index: number) => {
        const track = trackRef.current;
        if (!track) return;

        if (snapPoints.length > 0) {
            const clamped = Math.max(0, Math.min(index, snapPoints.length - 1));
            track.scrollTo({
                left: snapPoints[clamped],
                behavior: "smooth",
            });
        } else {
            const step = Math.max(280, track.clientWidth * 0.75);
            track.scrollTo({
                left: index * step,
                behavior: "smooth",
            });
        }
    }, [snapPoints]);

    const scrollNext = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        if (snapPoints.length > 0 && showDots) {
            scrollToIndex(currentIndex + 1);
        } else {
            const scrollAmount = Math.max(280, Math.floor(track.clientWidth * 0.75));
            track.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }, [currentIndex, scrollToIndex, snapPoints.length, showDots]);

    const scrollPrev = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        if (snapPoints.length > 0 && showDots) {
            scrollToIndex(currentIndex - 1);
        } else {
            const scrollAmount = Math.max(280, Math.floor(track.clientWidth * 0.75));
            track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    }, [currentIndex, scrollToIndex, snapPoints.length, showDots]);

    /*
    |--------------------------------------------------------------------------
    | Scroll Handler
    |--------------------------------------------------------------------------
    */

    const handleScroll = useCallback(() => {
        if (tickingRef.current) return;

        tickingRef.current = true;

        requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track) {
                tickingRef.current = false;
                return;
            }

            const { scrollLeft, scrollWidth, clientWidth } = track;

            if (showDots) {
                setCurrentIndex(findClosestIndex(scrollLeft));
            }

            setHasLeft(scrollLeft > 2);
            setHasRight(scrollLeft + clientWidth < scrollWidth - 2);

            /*
            |--------------------------------------------------------------------------
            | Infinite Load
            |--------------------------------------------------------------------------
            */

            if (
                onReachEnd &&
                scrollLeft + clientWidth >= scrollWidth - endThreshold
            ) {
                if (!endReachedRef.current) {
                    endReachedRef.current = true;
                    onReachEnd();
                }
            } else {
                endReachedRef.current = false;
            }

            tickingRef.current = false;
        });
    }, [
        endThreshold,
        findClosestIndex,
        onReachEnd,
        showDots,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Resize Observer (Deferred / Idle to prevent blocking main-thread)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // Check if right scroll is possible after initial mount without blocking layout
        const initTimer = setTimeout(() => {
            if (trackRef.current) {
                const { scrollWidth, clientWidth } = trackRef.current;
                setHasRight(scrollWidth > clientWidth + 2);
                if (showDots || autoPlay) {
                    measure();
                }
            }
        }, 150);

        let timeoutId: any;
        const observer = new ResizeObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (trackRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
                    setHasLeft(scrollLeft > 2);
                    setHasRight(scrollLeft + clientWidth < scrollWidth - 2);
                    if (showDots || autoPlay) {
                        measure();
                    }
                }
            }, 200);
        });

        observer.observe(track);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
            clearTimeout(initTimer);
        };
    }, [items, measure, showDots, autoPlay]);

    /*
    |--------------------------------------------------------------------------
    | Autoplay
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !autoPlay ||
            snapPoints.length <= 1
        ) return;

        autoplayRef.current = setInterval(() => {

            setCurrentIndex((prev) => {

                const next =
                    prev >= snapPoints.length - 1
                        ? 0
                        : prev + 1;

                scrollToIndex(next);

                return next;

            });

        }, interval);

        return () => {
            clearInterval(autoplayRef.current);
        };

    }, [
        autoPlay,
        interval,
        scrollToIndex,
        snapPoints.length
    ]);

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        return () => {
            clearInterval(autoplayRef.current);
        };

    }, []);

    if (!items?.length && !children) return null;

    return (
        <div className={`relative w-full ${className}`}>

            {/* Track */}

            <div
                ref={trackRef}
                onScroll={handleScroll}
                className={`
                    overflow-x-auto
                    overscroll-x-contain
                    scroll-smooth
                    snap-x
                    snap-mandatory
                    scrollbar-hidden
                    py-2
                    [-webkit-overflow-scrolling:touch]
                    ${trackClassName}
                `}
                style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: `repeat(${rows}, ${rowHeight})`,
                    gridAutoColumns: "max-content",
                    gap,
                    touchAction: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}
            >

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="snap-start"
                    >
                        {renderItem && renderItem(item, index)}
                    </div>
                ))}

                {children}

            </div>

            {/* Left Arrow */}

            {showArrows && hasLeft && (
                <button
                    aria-label="Previous"
                    onClick={scrollPrev}
                    className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg cursor-pointer"
                >
                    <FiChevronLeft size={22} />
                </button>
            )}

            {/* Right Arrow */}

            {showArrows && hasRight && (
                <button
                    aria-label="Next"
                    onClick={scrollNext}
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-6 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg cursor-pointer"
                >
                    <FiChevronRight size={22} />
                </button>
            )}

            {/* Left Fade */}
            {/* Removed as per user request */}

            {/* Right Fade */}
            {/* Removed as per user request */}

            {/* Dots */}

            {showDots && snapPoints.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">

                    {snapPoints.map((_, index) => (
                        <button
                            key={index}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => scrollToIndex(index)}
                            className="h-6 w-6 flex items-center justify-center focus:outline-none"
                        >
                            <div className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "w-5 bg-black" : "w-2 bg-black/30"}`} />
                        </button>
                    ))}

                </div>
            )}

        </div>
    );

}