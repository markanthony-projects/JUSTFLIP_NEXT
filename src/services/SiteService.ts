import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { City } from "../types";

class SiteService {
    static async fetchPopularCities({ offset = 0, limit = 5 }: { offset?: number; limit?: number } = {}): Promise<{ cities: City[] } | any> {
        try {
            const { data } = await JUSTFLIP.get(`/city/popular`, { params: { offset, limit } });
            return data || { cities: [] };
        } catch (error: any) {
            handleApiError(error);
            return { cities: [] };
        }
    }
}

export default SiteService;
