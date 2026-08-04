"use client";

import { useCityStore } from "@/src/stores/city.store";
import JustflipService from "@/src/services/JustflipService";

const GEO_OPTIONS = { timeout: 5000, maximumAge: 600000 };

/**
 * Module-level single-flight guard.
 * NearestCityClient is mounted more than once per page (header + search bar),
 * so without this every instance would fire its own /city/remoteAddr request
 * and its own geolocation prompt.
 */
let inflight = null;
let detectInflight = null;

/* Promise wrapper around the callback-based geolocation API. */
function getCurrentPosition() {
    return new Promise((resolve) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve(coords),
            () => resolve(null),
            GEO_OPTIONS
        );
    });
}

/**
 * 1. IP lookup (no permission prompt, works for everyone).
 * 2. Fallback: browser geolocation -> lat/lng lookup.
 * 3. Last resort: lat/lng lookup with the service defaults.
 */
async function resolve() {
    const byIP = await JustflipService.fetchNearestCityByIP();
    if (byIP?.id) return byIP;

    const coords = await getCurrentPosition();
    return JustflipService.findNearestCity(coords?.latitude, coords?.longitude);
}

/**
 * Ensure the store has an active city. Idempotent and safe to call from every
 * mounted instance — concurrent callers share one in-flight request, and once a
 * city is known no request is made at all.
 */
export function ensureNearestCity(initialCity) {
    const { activeCity, setActiveCity, hydrateFromCookie } = useCityStore.getState();

    if (initialCity?.id) {
        setActiveCity(initialCity);
        return Promise.resolve(initialCity);
    }

    if (activeCity?.id) return Promise.resolve(activeCity);

    hydrateFromCookie();
    const fromCookie = useCityStore.getState().activeCity;
    if (fromCookie?.id) return Promise.resolve(fromCookie);

    if (inflight) return inflight;

    inflight = resolve()
        .then(commit)
        .catch((error) => {
            console.error("Failed to resolve nearest city", error);
            return null;
        })
        .finally(() => {
            // Cleared so a failed resolve can be retried on a later mount.
            inflight = null;
        });

    return inflight;
}

/**
 * Explicit "use my current location" action.
 *
 * Unlike ensureNearestCity this ignores the city already in the store — the
 * user asked to re-detect. Geolocation is tried first here (they opted in by
 * pressing the button, so the permission prompt is expected) and the IP lookup
 * is the fallback.
 */
export function detectNearestCity() {
    if (detectInflight) return detectInflight;

    detectInflight = (async () => {
        const coords = await getCurrentPosition();

        if (coords) {
            const byGeo = await JustflipService.findNearestCity(
                coords.latitude,
                coords.longitude
            );
            if (byGeo?.id) return byGeo;
        }

        return JustflipService.fetchNearestCityByIP();
    })()
        .then(commit)
        .catch((error) => {
            console.error("Failed to detect nearest city", error);
            return null;
        })
        .finally(() => {
            detectInflight = null;
        });

    return detectInflight;
}

function commit(city) {
    if (city?.id) useCityStore.getState().setActiveCity(city);
    return city ?? null;
}
