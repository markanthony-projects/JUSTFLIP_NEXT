"use client";

import Image from "next/image";
import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_DELAY = 5000;
const TRANSITION_DURATION = 700;

export default function BannersClient({ banners = [] }) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);

    const autoplayRef = useRef(null);
    const cleanupRef = useRef(null);
    const animatingRef = useRef(false);

    const total = banners.length;

    /*
    |--------------------------------------------------------------------------
    | Transition
    |--------------------------------------------------------------------------
    */

    const transition = useCallback((nextIndex) => {

        if (
            animatingRef.current ||
            nextIndex === currentIndex
        ) return;

        animatingRef.current = true;

        setPreviousIndex(currentIndex);
        setCurrentIndex(nextIndex);

        clearTimeout(cleanupRef.current);

        cleanupRef.current = setTimeout(() => {

            setPreviousIndex(null);
            animatingRef.current = false;

        }, TRANSITION_DURATION);

    }, [currentIndex]);

    /*
    |--------------------------------------------------------------------------
    | Autoplay
    |--------------------------------------------------------------------------
    */

    const startAutoplay = useCallback(() => {

        clearInterval(autoplayRef.current);

        if (total <= 1) return;

        autoplayRef.current = setInterval(() => {

            setCurrentIndex((prev) => {

                if (animatingRef.current) return prev;

                animatingRef.current = true;

                setPreviousIndex(prev);

                const next =
                    (prev + 1) % total;

                clearTimeout(cleanupRef.current);

                cleanupRef.current = setTimeout(() => {

                    setPreviousIndex(null);
                    animatingRef.current = false;

                }, TRANSITION_DURATION);

                return next;

            });

        }, AUTOPLAY_DELAY);

    }, [total]);

    /*
    |--------------------------------------------------------------------------
    | Init
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        startAutoplay();

        return () => {

            clearInterval(autoplayRef.current);
            clearTimeout(cleanupRef.current);

        };

    }, [startAutoplay]);

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const next = () => {

        transition(
            (currentIndex + 1) % total
        );

        startAutoplay();

    };

    const prev = () => {

        transition(
            (currentIndex - 1 + total) % total
        );

        startAutoplay();

    };

    if (!banners?.length) return null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-black select-none">

            {/* Slides */}

            {banners.map((banner, index) => {

                const active =
                    index === currentIndex;

                const previous =
                    index === previousIndex;

                const visible =
                    active || previous;

                return (
                    <div
                        key={banner?.id || index}
                        aria-hidden={!active}
                        className={`absolute inset-0 transition-opacity duration-700 ease-out ${active ? "opacity-100 z-20" : previous ? "opacity-0 z-10" : "opacity-0 z-0 invisible"}`}
                    >

                        {banner?.meta?.redirectUrl ? (

                            <Link
                                href={banner.meta.redirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                prefetch={false}
                                className="absolute inset-0 block"
                                tabIndex={active ? 0 : -1}
                            >

                                <SlideImage
                                    banner={banner}
                                    priority={index === 0}
                                    visible={visible}
                                />

                            </Link>

                        ) : (

                            <SlideImage
                                banner={banner}
                                priority={index === 0}
                                visible={visible}
                            />

                        )}

                    </div>
                );

            })}

            {/* Overlay */}

            <div className="absolute inset-0 z-30 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Arrows */}

            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Previous Slide"
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                    >

                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                            <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </button>

                    <button
                        onClick={next}
                        aria-label="Next Slide"
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/25 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                    >

                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </button>
                </>
            )}

            {/* Indicators */}

            {total > 1 && (
                <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">

                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => transition(index)}
                            aria-label={`Slide ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                        />
                    ))}

                </div>
            )}

        </div>
    );

}

/*
|--------------------------------------------------------------------------
| Slide Image
|--------------------------------------------------------------------------
*/

function SlideImage({
    banner,
    priority,
    visible
}) {

    return (
        <div className="absolute inset-0">

            <picture>

                {/* Mobile */}

                {banner?.meta?.mobileUrl && (
                    <source
                        media="(max-width: 767px)"
                        srcSet={banner.meta.mobileUrl}
                    />
                )}

                {/* Tablet */}

                {banner?.meta?.tabUrl && (
                    <source
                        media="(max-width: 1023px)"
                        srcSet={banner.meta.tabUrl}
                    />
                )}

                {/* Desktop */}

                <Image
                    src={banner?.url}
                    alt={banner?.alt || banner?.name || "Banner"}
                    fill
                    priority={priority}
                    quality={90}
                    sizes="100vw"
                    draggable={false}
                    className={`object-cover pointer-events-none transition-transform duration-7000 ease-out ${visible ? "scale-100" : "scale-[1.04]"}`}
                />

            </picture>

        </div>
    );

}