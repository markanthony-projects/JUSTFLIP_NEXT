import { JUSTFLIP } from "../lib/axios/api";
import { City } from "../types";

class CityService {
  static async getCityById(
    id: string | number, 
    config: Record<string, any> = {}
  ): Promise<City | null> {
    if (!id) throw new Error("City ID is required");

    try {
      const response = await JUSTFLIP.get(`/city/${id}`, config);
      const city = response?.data?.city;

      return city || null;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to fetch city";
      throw new Error(message);
    }
  }
}

export default CityService;