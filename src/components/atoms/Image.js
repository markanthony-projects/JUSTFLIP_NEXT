// "use client";

// import { useState, useMemo, useRef, useEffect, memo } from "react";
// import Image from "next/image";
// import fallbackImg from "@/public/assets/banner_alt.png";
// import clsx from "clsx";

// // 🌍 Global cache (persists across component instances)
// const loadedImages = new Set();

// function SmartImage({
//     src,
//     alt = "image",
//     priority,
//     sizes = "(max-width: 768px) 100vw, 33vw",
//     className,
//     wrapperClassName,
//     blur = true,
//     retry = 1,
//     loading,
//     ...props
// }) {
//     const isCached = src && loadedImages.has(src);

//     const [isLoading, setIsLoading] = useState(!isCached);
//     const [hasError, setHasError] = useState(false);
//     const [retryCount, setRetryCount] = useState(0);

//     const imgRef = useRef(null);

//     const finalSrc = useMemo(() => {
//         if (!src || hasError) return fallbackImg;
//         return src;
//     }, [src, hasError]);

//     useEffect(() => {
//         if (hasError && retryCount < retry) {
//             const timer = setTimeout(() => {
//                 setHasError(false);
//                 setRetryCount((c) => c + 1);
//             }, 1000);

//             return () => clearTimeout(timer);
//         }
//     }, [hasError, retryCount, retry]);

//     return (
//         <div className={clsx("relative w-full h-full overflow-hidden", wrapperClassName)}>
//             {isLoading && (
//                 <div className="relative w-full h-full overflow-hidden bg-gray-100 ">
//                     <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-100 to-gray-50"></div>
//                     <div className="absolute inset-0 backdrop-blur-lg"></div>
//                 </div>
//             )}

//             <Image
//                 ref={imgRef}
//                 src={finalSrc}
//                 alt={alt}
//                 fill
//                 sizes={sizes}
//                 priority={priority}
//                 loading={priority ? "eager" : loading || "lazy"}
//                 quality={80}
//                 placeholder={blur ? "blur" : "empty"}
//                 blurDataURL={
//                     blur
//                         ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+"
//                         : undefined
//                 }
//                 className={clsx(
//                     "object-cover will-change-transform transition-all duration-500 ease-out",
//                     isLoading && "scale-105 blur-xl",
//                     !isLoading && "scale-100 blur-0",
//                     className
//                 )}
//                 onLoad={() => {
//                     setIsLoading(false);

//                     if (src) loadedImages.add(src);
//                 }}
//                 onError={() => {
//                     setHasError(true);
//                     setIsLoading(false);
//                 }}
//                 {...props}
//             />
//         </div>
//     );
// }

// export default memo(SmartImage);

"use client";

import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";
import fallbackImg from "@/public/assets/banner_alt.png";
import clsx from "clsx";

const loadedImages = new Set();

function SmartImage({
    src,
    alt = "image",
    priority,
    sizes = "(max-width: 768px) 100vw, 33vw",
    className,
    wrapperClassName,
    retry = 1,
    ...props
}) {
    const isCached = src && loadedImages.has(src);

    const [isLoading, setIsLoading] = useState(!isCached);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (hasError && retryCount < retry) {
            const timer = setTimeout(() => {
                setHasError(false);
                setRetryCount((c) => c + 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasError, retryCount, retry]);

    return (
        <div className={clsx("relative w-full h-full overflow-hidden", wrapperClassName)}>

            {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}

            <Image
                src={!src || hasError ? fallbackImg : src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                quality={85}
                placeholder="empty"
                className={clsx("object-cover", className)}
                onLoad={() => {
                    setIsLoading(false);
                    if (src) loadedImages.add(src);
                }}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                {...props}
            />

        </div>
    );
}

export default memo(SmartImage);