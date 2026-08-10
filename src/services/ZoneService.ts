import { JUSTFLIP } from "../lib/axios/api";
import { Zone } from "../types";

class ZoneService {
    static async getZoneById(id: string | number): Promise<Zone | null> {
        try {
            if (!id) throw new Error("Zone ID is required");
            const { data } = await JUSTFLIP.get(`/zone/${id}`);
            return data?.zone;
        } catch (error: any) {
            console.error("[ZoneService.getZoneById]", error?.message);
            return null;
        }
    }

}

export default ZoneService;