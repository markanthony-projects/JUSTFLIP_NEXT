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

    static async suggestions(query) {
        try {
            const { data } = await JUSTFLIP.get(`/project/search?query=${query}`);
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
        let latitude = lat || 12.9716;
        let longitude = lng || 77.5946;

        try {
            const { data } = await JUSTFLIP.get("/city/nearest", { params: { lat: latitude, lng: longitude } });
            return data?.city ?? null;
        } catch (error) {
            handleApiError(error);
            return null;
        }
    }


    static async fetchNearestCityByIP(ip) {
        try {
            const { data } = await JUSTFLIP.get("/city/remoteAddr", {
                headers: {
                    "cf-connecting-ip": ip,
                    "x-forwarded-for": ip,
                }
            });

            return data?.city ?? null;
        } catch (error) {
            return null;
        }
    }
}

export default JustflipService;
