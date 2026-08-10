"use client";

import SiteService from "@/src/services/SiteService";

/**
 * Popular cities change rarely, so the resolved list is cached for the lifetime
 * of the page. Without this the request fires every time the modal is opened,
 * and once per mounted NearestCity instance.
 */
let cache: any[] | null = null;
let inflight: Promise<any[]> | null = null;

export function ensurePopularCities(limit?: number): Promise<any[]> {
    if (cache) return Promise.resolve(cache);
    if (inflight) return inflight;

    const req = SiteService.fetchPopularCities({ limit })
        .then((res: any) => {
            cache = res?.cities || [];
            return cache as any[];
        })
        .catch((error: any) => {
            console.error("Failed to fetch popular cities", error);
            return [] as any[];
        })
        .finally(() => {
            inflight = null;
        });

    inflight = req;
    return req;
}
