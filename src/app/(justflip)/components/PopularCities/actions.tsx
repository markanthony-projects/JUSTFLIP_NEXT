"use server";

import SiteService from "@/src/services/SiteService";

export async function fetchPopularCities({ offset = 0, limit = 5 }: { offset?: number; limit?: number } = {}) {
    return await SiteService.fetchPopularCities({ offset, limit });
}
