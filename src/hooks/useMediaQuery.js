"use client";

import { useEffect, useState } from "react";

export default function useMediaQuery(query) {

    const getMatch = () => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState(getMatch);

    useEffect(() => {

        const media = window.matchMedia(query);

        const handleChange = () => {
            setMatches(media.matches);
        };

        media.addEventListener("change", handleChange);

        return () => {
            media.removeEventListener("change", handleChange);
        };

    }, [query]);

    return matches;
}