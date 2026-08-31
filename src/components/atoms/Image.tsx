"use client";

import { useState, useEffect, memo } from "react";
import Image, { ImageProps } from "next/image";
import fallbackImg from "@/public/assets/banner_alt.png";
import clsx from "clsx";

const loadedImages = new Set<string>();

export interface SmartImageProps extends Omit<ImageProps, "src" | "alt"> {
    src?: string | null;
    alt?: string;
    wrapperClassName?: string;
    retry?: number;
}

function SmartImage({
    src,
    alt = "image",
    priority,
    sizes = "(max-width: 768px) 100vw, 33vw",
    className,
    wrapperClassName,
    retry = 1,
    ...props
}: SmartImageProps) {
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
            {priority && typeof src === "string" && (
                <link rel="preload" as="image" href={src} fetchPriority="high" crossOrigin="anonymous" />
            )}

            {isLoading && !priority && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}

            <Image
                src={!src || hasError ? fallbackImg : src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                crossOrigin="anonymous"
                fetchPriority={priority ? "high" : (props.fetchPriority as any)}
                loading={priority ? "eager" : props.loading}
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