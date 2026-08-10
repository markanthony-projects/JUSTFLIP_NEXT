"use server";

import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { Project, Builder } from "../types";
import { cache } from "react";

export async function fetchBuilders(
    { cityId, page = 1, limit = 15 }: { cityId?: string | number; page?: number; limit?: number } = {}
): Promise<Builder[]> {
    try {
        const { data } = await JUSTFLIP.get("/builder/top", {
            params: { cityId, page, limit }
        });
        return data?.builders || [];
    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
}

export async function fetchTopBuilders(
    { cityId = null, zoneId = null, locationId = null, limit = 20 }: { cityId?: string | number | null; zoneId?: string | number | null; locationId?: string | number | null; limit?: number } = {}
): Promise<Builder[]> {
    try {
        const { data } = await JUSTFLIP.get("/builder/top", {
            params: { cityId, zoneId, locationId, limit }
        });
        return data?.builders || [];
    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
}

export interface FetchDevelopersResponse {
    builders: Builder[];
    total: number;
    limit: number;
    [key: string]: any;
}

export async function fetchDevelopers(
    { page = 1, limit = 20, search = "" }: { page?: number; limit?: number; search?: string } = {}
): Promise<FetchDevelopersResponse> {
    try {
        const { data } = await JUSTFLIP.get("/builder", {
            params: {
                status: "active",
                approval: "approved",
                page,
                limit,
                search
            }
        });

        return data;
    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
}

export const fetchDeveloperById = cache(async (id: string | number): Promise<any> => {
    try {
        const { data } = await JUSTFLIP.get(`/builder/${id}`);
        return data;
    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
});

export async function fetchProjectByDeveloperId(
    { id, limit = 20, page = 1, tag }: { id: string | number; limit?: number; page?: number; tag?: string }
): Promise<{ projects: Project[]; total: number }> {
    try {
        const { data } = await JUSTFLIP.get(
            `/project?status=active&approval=approved&builderId=${id}`,
            {
                params: { page, limit }
            }
        );

        return {
            projects: data?.projects || [],
            total: data?.total || 0
        };

    } catch (error: any) {
        handleApiError(error);
        throw error;
    }
}