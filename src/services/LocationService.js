import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

class LocationService {
    static async fetchLocationById({ id, signal } = {}) {
        try {
            if (!id) throw new Error("Location ID is required");
            const { data } = await JUSTFLIP.get(`/location/${id}`);
            return data?.location;
        } catch (error) {
            const normalizedError = handleApiError(error, { service: "LocationService", method: "fetchLocationById", params: { id }, });
            console.error("❌ LocationService Error:", normalizedError);
            throw normalizedError;
        }
    }
    
    static async fetchLocation({search, cityId}) {
        try {
            if (!search) throw new Error("Search query is required");
            const { data } = await JUSTFLIP.get(`/location?search=${search}&cityId=${cityId}`);
            return data?.locations;
        } catch (error) {
            const normalizedError = handleApiError(error, { service: "LocationService", method: "fetchLocation", params: { search }, });
            console.error("❌ LocationService Error:", normalizedError);
            throw normalizedError;
        }
    }
}

export default LocationService;