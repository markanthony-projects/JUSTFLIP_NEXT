"use client";

import { useEffect, useRef, useState } from "react";

import { ReactNode } from "react";

export interface LazyHydrateProps {
    children: ReactNode;
    rootMargin?: string;
    placeholder?: ReactNode;
    onVisible?: () => void;
}

export default function LazyHydrate({
    children,
    rootMargin = "200px",
    placeholder = null,
    onVisible
}: LazyHydrateProps) {

    const ref = useRef<HTMLDivElement>(null);

    const [hydrated, setHydrated] =
        useState(false);

    useEffect(() => {

        if (hydrated) return;

        const element = ref.current;

        if (!element) return;

        /*
        |--------------------------------------------------------------------------
        | Fallback
        |--------------------------------------------------------------------------
        */

        if (
            typeof IntersectionObserver ===
            "undefined"
        ) {

            setHydrated(true);

            onVisible?.();

            return;

        }

        /*
        |--------------------------------------------------------------------------
        | Observer
        |--------------------------------------------------------------------------
        */

        const observer =
            new IntersectionObserver(

                (entries) => {

                    const entry = entries[0];

                    if (
                        entry.isIntersecting ||
                        entry.intersectionRatio > 0
                    ) {

                        setHydrated(true);

                        onVisible?.();

                        observer.disconnect();

                    }

                },

                {
                    root: null,
                    rootMargin,
                    threshold: 0.01
                }

            );

        observer.observe(element);

        return () => observer.disconnect();

    }, [
        hydrated,
        rootMargin,
        onVisible
    ]);

    return (

        <div ref={ref}>

            {hydrated
                ? children
                : placeholder}

        </div>

    );

}