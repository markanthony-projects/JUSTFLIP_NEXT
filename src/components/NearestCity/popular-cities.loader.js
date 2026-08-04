"use client";

import SiteService from "@/src/services/SiteService";

/**
 * Popular cities change rarely, so the resolved list is cached for the lifetime
 * of the page. Without this the request fires every time the modal is opened,
 * and once per mounted NearestCity instance.
 */
let cache = null;
let inflight = null;

export function ensurePopularCities(limit) {
    if (cache) return Promise.resolve(cache);
    if (inflight) return inflight;

    inflight = SiteService.fetchPopularCities({ limit })
        .then((res) => {
            cache = res?.cities || [];
            return cache;
        })
        .catch((error) => {
            console.error("Failed to fetch popular cities", error);
            return [];
        })
        .finally(() => {
            inflight = null;
        });

    return inflight;
}
