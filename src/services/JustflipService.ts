import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { City } from "../types";

class JustflipService {

    static async fetchBanners(): Promise<any[]> {
        try {
            const { data } = await JUSTFLIP.get(`/banner`, { params: { approval: 'approved' } });
            return data?.banners || [];
        } catch (error: any) {
            handleApiError(error);
            return [];
        }
    }

    static async suggestions(query: string, cityId?: string | number): Promise<any> {
        try {
            const params: Record<string, any> = { query };
            if(cityId) params.cityId = cityId;
            const { data } = await JUSTFLIP.get(`/project/search`, { params });
            return data;
        } catch (error: any) {
            handleApiError(error);
            return null;
        }
    }

    static async fetchCityList(): Promise<City[]> {
        try {
            const { data } = await JUSTFLIP.get("/city/list", { params: { exclude: true } });
            return data?.cities ?? [];
        } catch (error: any) {
            handleApiError(error);
            return [];
        }
    }

    static async findNearestCity(lat: number, lng: number): Promise<City | null> {
        const latitude = Number.isFinite(lat) ? lat : 12.9716;
        const longitude = Number.isFinite(lng) ? lng : 77.5946;

        try {
            const { data } = await JUSTFLIP.get("/city/nearest", { params: { lat: latitude, lng: longitude } });
            return data?.city ?? null;
        } catch (error: any) {
            handleApiError(error);
            return null;
        }
    }

    /**
     * Resolve the city from the caller's IP.
     * Called from the browser the backend reads the real remote address, so no
     * headers are needed. Called on the server we forward the client IP instead.
     */
    static async fetchNearestCityByIP(ip?: string): Promise<City | null> {
        try {
            const { data } = await JUSTFLIP.get("/city/remoteAddr", {
                headers: ip
                    ? { "cf-connecting-ip": ip, "x-forwarded-for": ip }
                    : undefined,
            });

            return data?.city ?? null;
        } catch (error: any) {
            return null;
        }
    }
}

export default JustflipService;
