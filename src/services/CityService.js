import { JUSTFLIP } from "../lib/axios/api";

class CityService {
  static async getCityById(id, config = {}) {
    if (!id) throw new Error("City ID is required");

    try {
      const response = await JUSTFLIP.get(`/city/${id}`, config);
      const city = response?.data?.city;

      return city;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to fetch city";
      throw new Error(message);
    }
  }
}

export default CityService;