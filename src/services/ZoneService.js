import { JUSTFLIP } from "../lib/axios/api";

class ZoneService {
    static async getZoneById(id) {
        try {
            if (!id) throw new Error("Zone ID is required");
            const { data } = await JUSTFLIP.get(`/zone/${id}`);
            return data?.zone ;
        } catch (error) {
            console.error("[ZoneService.getZoneById]", error?.message);
        }
    }




}

export default ZoneService;