// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";

// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// export default function Carousel({
//     items = [],
//     renderItem,

//     gap = 16,

//     rows = 1,
//     rowHeight = "auto",

//     autoPlay = false,
//     interval = 4000,

//     showArrows = true,
//     showDots = true,

//     endThreshold = 100,
//     onReachEnd,

//     className = "",
//     trackClassName = "",

//     children
// }) {

//     const trackRef = useRef(null);
//     const autoplayRef = useRef(null);
//     const tickingRef = useRef(false);
//     const endReachedRef = useRef(false);

//     const [currentIndex, setCurrentIndex] = useState(0);

//     const [hasLeft, setHasLeft] = useState(false);
//     const [hasRight, setHasRight] = useState(false);

//     const [snapPoints, setSnapPoints] = useState([]);

//     const measure = useCallback(() => {

//         const track = trackRef.current;

//         if (!track) return;

//         const children = Array.from(track.children);

//         const uniqueOffsets = [
//             ...new Set(
//                 children.map((child) => child.offsetLeft)
//             )
//         ];

//         setSnapPoints(uniqueOffsets);

//         updateArrowState();

//     }, []);

//     const updateArrowState = useCallback(() => {

//         const track = trackRef.current;

//         if (!track) return;

//         const {
//             scrollLeft,
//             scrollWidth,
//             clientWidth
//         } = track;

//         setHasLeft(scrollLeft > 2);

//         setHasRight(
//             scrollLeft + clientWidth < scrollWidth - 2
//         );

//     }, []);

//     const findClosestIndex = useCallback((scrollLeft) => {

//         if (!snapPoints.length) return 0;

//         let closest = 0;
//         let minDistance = Infinity;

//         for (let i = 0; i < snapPoints.length; i++) {

//             const distance = Math.abs(
//                 snapPoints[i] - scrollLeft
//             );

//             if (distance < minDistance) {
//                 minDistance = distance;
//                 closest = i;
//             }

//         }

//         return closest;

//     }, [snapPoints]);

//     const scrollToIndex = useCallback((index) => {

//         const track = trackRef.current;

//         if (!track) return;

//         const clamped = Math.max(
//             0,
//             Math.min(index, snapPoints.length - 1)
//         );

//         track.scrollTo({
//             left: snapPoints[clamped],
//             behavior: "smooth"
//         });

//     }, [snapPoints]);

//     const scrollNext = useCallback(() => {
//         scrollToIndex(currentIndex + 1);
//     }, [currentIndex, scrollToIndex]);

//     const scrollPrev = useCallback(() => {
//         scrollToIndex(currentIndex - 1);
//     }, [currentIndex, scrollToIndex]);

//     const handleScroll = useCallback(() => {

//         if (tickingRef.current) return;

//         tickingRef.current = true;

//         requestAnimationFrame(() => {

//             const track = trackRef.current;

//             if (!track) {
//                 tickingRef.current = false;
//                 return;
//             }

//             const {
//                 scrollLeft,
//                 scrollWidth,
//                 clientWidth
//             } = track;

//             const index =
//                 findClosestIndex(scrollLeft);

//             setCurrentIndex(index);

//             updateArrowState();

//             if (
//                 onReachEnd &&
//                 scrollLeft + clientWidth >=
//                 scrollWidth - endThreshold
//             ) {

//                 if (!endReachedRef.current) {

//                     endReachedRef.current = true;

//                     onReachEnd();

//                 }

//             } else {

//                 endReachedRef.current = false;

//             }

//             tickingRef.current = false;

//         });

//     }, [
//         endThreshold,
//         findClosestIndex,
//         onReachEnd,
//         updateArrowState
//     ]);

//     useEffect(() => {

//         const track = trackRef.current;

//         if (!track) return;

//         const observer =
//             new ResizeObserver(() => {

//                 measure();

//             });

//         observer.observe(track);

//         Array.from(track.children).forEach(
//             (child) => {
//                 observer.observe(child);
//             }
//         );

//         measure();

//         return () => observer.disconnect();

//     }, [items, measure]);

//     useEffect(() => {

//         if (!autoPlay || snapPoints.length <= 1) {
//             return;
//         }

//         autoplayRef.current = setInterval(() => {

//             setCurrentIndex((prev) => {

//                 const next =
//                     prev >= snapPoints.length - 1
//                         ? 0
//                         : prev + 1;

//                 scrollToIndex(next);

//                 return next;

//             });

//         }, interval);

//         return () => {
//             clearInterval(autoplayRef.current);
//         };

//     }, [
//         autoPlay,
//         interval,
//         scrollToIndex,
//         snapPoints.length
//     ]);

//     useEffect(() => {

//         return () => {
//             clearInterval(autoplayRef.current);
//         };

//     }, []);

//     if (!items?.length && !children) {
//         return null;
//     }

//     return (
//         <div className={`relative w-full ${className}`}>

//             <div
//                 ref={trackRef}
//                 onScroll={handleScroll}
//                 className={`
//                     overflow-x-auto
//                     scroll-smooth
//                     snap-x
//                     snap-mandatory
//                     scrollbar-hidden
//                     touch-pan-x
//                     will-change-scroll
//                     py-2
//                     ${trackClassName}
//                 `}
//                 style={{
//                     display: "grid",
//                     gridAutoFlow: "column",
//                     gridTemplateRows: `repeat(${rows}, ${rowHeight})`,
//                     gridAutoColumns: "max-content",
//                     gap
//                 }}
//             >

//                 {items.map((item, index) => (

//                     <div
//                         key={index}
//                         className="snap-start"
//                     >

//                         {renderItem(item, index)}

//                     </div>

//                 ))}

//                 {children}

//             </div>

//             {showArrows && hasLeft && (

//                 <button
//                     onClick={scrollPrev}
//                     className="
//                         hidden md:flex
//                         absolute -left-5 top-1/2
//                         -translate-y-1/2
//                         z-20 h-10 w-10
//                         items-center justify-center
//                         rounded-full bg-white
//                         border border-gray-200
//                         shadow-lg cursor-pointer
//                     "
//                 >

//                     <FiChevronLeft size={22} />

//                 </button>

//             )}

//             {showArrows && hasRight && (

//                 <button
//                     onClick={scrollNext}
//                     className="
//                         hidden md:flex
//                         absolute -right-5 top-1/2
//                         -translate-y-1/2
//                         z-20 h-10 w-10
//                         items-center justify-center
//                         rounded-full bg-white
//                         border border-gray-200
//                         shadow-lg cursor-pointer
//                     "
//                 >

//                     <FiChevronRight size={22} />

//                 </button>

//             )}

//             {showArrows && hasLeft && (

//                 <div
//                     className="
//                         hidden md:block
//                         pointer-events-none
//                         absolute top-0 left-0
//                         h-full w-8
//                         bg-gradient-to-r
//                         from-white/75
//                         to-transparent
//                     "
//                 />

//             )}

//             {showArrows && hasRight && (

//                 <div
//                     className="
//                         hidden md:block
//                         pointer-events-none
//                         absolute top-0 right-0
//                         h-full w-8
//                         bg-gradient-to-l
//                         from-white/75
//                         to-transparent
//                     "
//                 />

//             )}

//             {showDots && snapPoints.length > 1 && (

//                 <div className="mt-4 flex items-center justify-center gap-2">

//                     {snapPoints.map((_, index) => (

//                         <button
//                             key={index}
//                             onClick={() =>
//                                 scrollToIndex(index)
//                             }
//                             className={`
//                                 h-2 rounded-full
//                                 transition-all duration-300
//                                 ${currentIndex === index
//                                     ? "w-5 bg-black"
//                                     : "w-2 bg-black/30"
//                                 }
//                             `}
//                         />

//                     ))}

//                 </div>

//             )}

//         </div>
//     );

// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

    children
}) {

    const trackRef = useRef(null);
    const autoplayRef = useRef(null);
    const tickingRef = useRef(false);
    const endReachedRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasLeft, setHasLeft] = useState(false);
    const [hasRight, setHasRight] = useState(false);
    const [snapPoints, setSnapPoints] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Update Arrows
    |--------------------------------------------------------------------------
    */

    const updateArrowState = useCallback(() => {

        const track = trackRef.current;

        if (!track) return;

        const {
            scrollLeft,
            scrollWidth,
            clientWidth
        } = track;

        setHasLeft(scrollLeft > 2);

        setHasRight(
            scrollLeft + clientWidth < scrollWidth - 2
        );

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Measure Snap Points
    |--------------------------------------------------------------------------
    */

    const measure = useCallback(() => {

        const track = trackRef.current;

        if (!track) return;

        const children =
            Array.from(track.children);

        const uniqueOffsets = [
            ...new Set(
                children.map(
                    (child) => child.offsetLeft
                )
            )
        ];

        setSnapPoints(uniqueOffsets);

        updateArrowState();

    }, [updateArrowState]);

    /*
    |--------------------------------------------------------------------------
    | Find Closest Index
    |--------------------------------------------------------------------------
    */

    const findClosestIndex = useCallback((scrollLeft) => {

        if (!snapPoints.length) return 0;

        let closest = 0;
        let minDistance = Infinity;

        for (let i = 0; i < snapPoints.length; i++) {

            const distance =
                Math.abs(
                    snapPoints[i] - scrollLeft
                );

            if (distance < minDistance) {

                minDistance = distance;
                closest = i;

            }

        }

        return closest;

    }, [snapPoints]);

    /*
    |--------------------------------------------------------------------------
    | Scroll To Index
    |--------------------------------------------------------------------------
    */

    const scrollToIndex = useCallback((index) => {

        const track = trackRef.current;

        if (!track) return;

        const clamped =
            Math.max(
                0,
                Math.min(index, snapPoints.length - 1)
            );

        track.scrollTo({
            left: snapPoints[clamped],
            behavior: "smooth"
        });

    }, [snapPoints]);

    const scrollNext = useCallback(() => {

        scrollToIndex(currentIndex + 1);

    }, [currentIndex, scrollToIndex]);

    const scrollPrev = useCallback(() => {

        scrollToIndex(currentIndex - 1);

    }, [currentIndex, scrollToIndex]);

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

            const {
                scrollLeft,
                scrollWidth,
                clientWidth
            } = track;

            setCurrentIndex(
                findClosestIndex(scrollLeft)
            );

            updateArrowState();

            /*
            |--------------------------------------------------------------------------
            | Infinite Load
            |--------------------------------------------------------------------------
            */

            if (
                onReachEnd &&
                scrollLeft + clientWidth >=
                scrollWidth - endThreshold
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
        updateArrowState
    ]);

    /*
    |--------------------------------------------------------------------------
    | Resize Observer
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const track = trackRef.current;

        if (!track) return;

        const observer =
            new ResizeObserver(() => {
                measure();
            });

        observer.observe(track);

        Array
            .from(track.children)
            .forEach((child) => {
                observer.observe(child);
            });

        measure();

        return () => {
            observer.disconnect();
        };

    }, [items, measure]);

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
                        {renderItem(item, index)}
                    </div>
                ))}

                {children}

            </div>

            {/* Left Arrow */}

            {showArrows && hasLeft && (
                <button
                    onClick={scrollPrev}
                    className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg cursor-pointer"
                >
                    <FiChevronLeft size={22} />
                </button>
            )}

            {/* Right Arrow */}

            {showArrows && hasRight && (
                <button
                    onClick={scrollNext}
                    className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg cursor-pointer"
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
                            onClick={() => scrollToIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "w-5 bg-black" : "w-2 bg-black/30"}`}
                        />
                    ))}

                </div>
            )}

        </div>
    );

}