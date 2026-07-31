"use client";

import Image, { getImageProps } from "next/image";
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
    | Autoplay (Managed automatically by useEffect when currentIndex changes)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (total <= 1) return;

        autoplayRef.current = setInterval(() => {
            transition((currentIndex + 1) % total);
        }, AUTOPLAY_DELAY);

        return () => {
            clearInterval(autoplayRef.current);
        };

    }, [currentIndex, total, transition]);

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const next = () => {

        transition(
            (currentIndex + 1) % total
        );

    };

    const prev = () => {

        transition(
            (currentIndex - 1 + total) % total
        );

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
                            className="h-6 w-6 flex items-center justify-center focus:outline-none"
                        >
                            <div className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50 group-hover:bg-white/80"}`} />
                        </button>
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

    const common = {
        alt: banner?.alt || banner?.name || "Banner",
        fill: true,
        priority: priority,
        fetchPriority: priority ? "high" : "auto",
        sizes: "100vw",
        placeholder: "blur",
        blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        draggable: false,
        className: `object-cover pointer-events-none transition-transform duration-7000 ease-out ${visible ? "scale-100" : "scale-[1.04]"}`,
    };

    const {
        props: { srcSet: desktopSrcSet, ...desktopRest },
    } = getImageProps({ ...common, src: banner?.url });

    const mobileProps = banner?.meta?.mobileUrl ? getImageProps({ ...common, src: banner.meta.mobileUrl }) : null;
    const tabProps = banner?.meta?.tabUrl ? getImageProps({ ...common, src: banner.meta.tabUrl }) : null;

    return (
        <div className="absolute inset-0">
            <picture>
                {/* Mobile */}
                {mobileProps && (
                    <source
                        media="(max-width: 767px)"
                        srcSet={mobileProps.props.srcSet}
                    />
                )}

                {/* Tablet */}
                {tabProps && (
                    <source
                        media="(min-width: 768px) and (max-width: 1023px)"
                        srcSet={tabProps.props.srcSet}
                    />
                )}

                {/* Desktop */}
                <img
                    srcSet={desktopSrcSet}
                    {...desktopRest}
                />
            </picture>
        </div>
    );
}