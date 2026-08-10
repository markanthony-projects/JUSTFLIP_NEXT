"use client";

import { useCityStore } from "@/src/stores/city.store";
import { fetchCityList } from "./nearest-city.actions";

/**
 * Module-level single-flight guard.
 * The city list is requested from several places (the NearestCity dropdown and
 * LocationSelectorModal). `cityList.length` alone does not dedupe them, because
 * it stays 0 for every caller until the first response lands. The server
 * action's `cache()` does not help either — it dedupes within a single server
 * render, not across separate action invocations.
 */
let inflight: Promise<any[]> | null = null;

/**
 * Ensure the store holds the city list. Idempotent: concurrent callers share
 * one request, and once the list is loaded no request is made at all.
 */
export function ensureCityList(): Promise<any[]> {
    const { cityList } = useCityStore.getState();
    if (cityList.length) return Promise.resolve(cityList);

    if (inflight) return inflight;

    inflight = fetchCityList()
        .then((cities) => {
            const list = cities ?? [];
            if (list.length) useCityStore.getState().setCityList(list);
            return list;
        })
        .catch((error) => {
            console.error("Failed to fetch city list", error);
            return [];
        })
        .finally(() => {
            // Cleared so a failed load can be retried.
            inflight = null;
        });

    return inflight;
}
