import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { Location } from "../types";

class LocationService {
    static async fetchLocationById(
        { id, signal }: { id?: string | number; signal?: AbortSignal } = {}
    ): Promise<Location | null> {
        try {
            if (!id) throw new Error("Location ID is required");
            const { data } = await JUSTFLIP.get(`/location/${id}`);
            return data?.location || null;
        } catch (error: any) {
            const normalizedError = handleApiError(error, { service: "LocationService", method: "fetchLocationById", params: { id }, });
            console.error("❌ LocationService Error:", normalizedError);
            throw normalizedError;
        }
    }
    
    static async fetchLocation(
        { search, cityId }: { search: string; cityId: string | number }
    ): Promise<Location[]> {
        try {
            if (!search) throw new Error("Search query is required");
            const { data } = await JUSTFLIP.get(`/location?search=${search}&cityId=${cityId}`);
            return data?.locations || [];
        } catch (error: any) {
            const normalizedError = handleApiError(error, { service: "LocationService", method: "fetchLocation", params: { search }, });
            console.error("❌ LocationService Error:", normalizedError);
            throw normalizedError;
        }
    }
}

export default LocationService;