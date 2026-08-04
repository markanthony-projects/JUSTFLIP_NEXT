"use server";

import JustflipService from "@/src/services/JustflipService";
import { cache } from "react";

export const fetchCityList = cache(async () => {
    return await JustflipService.fetchCityList();
});
