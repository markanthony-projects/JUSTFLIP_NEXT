"use server";

import JustflipService from "@/src/services/JustflipService";
import { cache } from "react";

export const fetchCityList = cache(async (): Promise<any[]> => {
    return await JustflipService.fetchCityList();
});
