import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

class SiteService {
    static async fetchPopularCities({ offset = 0, limit = 5 }) {
        try {
            const { data } = await JUSTFLIP.get(`/city/popular`, { params: { offset, limit } });
            return data || [];
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default SiteService;
