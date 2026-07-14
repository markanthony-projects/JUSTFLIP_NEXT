"use server";

import JustflipService from "@/src/services/JustflipService";
import { cache } from "react";

export async function fetchNearestCity(lat, lng) {
    if (!lat || !lng) return null;

    return await JustflipService.findNearestCity(lat, lng);
}

export const fetchCityList = cache(async () => {
    return await JustflipService.fetchCityList();
});

export async function fetchNearestCityByIP(ip) {
    if (!ip) return null;

    try {
        return await JustflipService.fetchNearestCityByIP(ip);
    } catch {
        return null;
    }
}
