import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

class JustflipService {

    static async fetchBanners() {
        try {
            const { data } = await JUSTFLIP.get(`/banner`, { params: { approval: 'approved' } });
            return data?.banners || [];
        } catch (error) {
            handleApiError(error);
        }
    }

    static async suggestions(query, cityId) {
        try {
            const { data } = await JUSTFLIP.get(`/project/search`, { params: { query, cityId } });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async fetchCityList() {
        try {
            const { data } = await JUSTFLIP.get("/city/list", { params: { exclude: true } });
            return data?.cities ?? [];
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }

    static async findNearestCity(lat, lng) {
        const latitude = Number.isFinite(lat) ? lat : 12.9716;
        const longitude = Number.isFinite(lng) ? lng : 77.5946;

        try {
            const { data } = await JUSTFLIP.get("/city/nearest", { params: { lat: latitude, lng: longitude } });
            return data?.city ?? null;
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }

    /**
     * Resolve the city from the caller's IP.
     * Called from the browser the backend reads the real remote address, so no
     * headers are needed. Called on the server we forward the client IP instead.
     */
    static async fetchNearestCityByIP(ip) {
        try {
            const { data } = await JUSTFLIP.get("/city/remoteAddr", {
                headers: ip
                    ? { "cf-connecting-ip": ip, "x-forwarded-for": ip }
                    : undefined,
            });

            return data?.city ?? null;
        } catch (error) {
            return null;
        }
    }
}

export default JustflipService;
