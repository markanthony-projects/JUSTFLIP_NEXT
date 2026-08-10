"use server";

import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { getQueryParam } from "../utils/getQueryParam";
import { Project } from "../types";

export async function fetchProjectsByTag(
    { tag, cityId, page = 1, limit = 25 }: { tag?: string; cityId?: string | number; page?: number; limit?: number } = {}
): Promise<Project[]> {
    try {
        const { data } = await JUSTFLIP.get("/project/tagged", {
            params: { tag, cityId, page, limit }
        });

        return data?.projects || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}

export async function fetchExploreProjects(
    { typeId, type, page = 1, limit = 25 }: { typeId?: string | number; type?: string; page?: number; limit?: number } = {}
): Promise<Project[]> {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project/explore-projects", {
            params: { typeId, type, page, limit, ...queryParam }
        });

        return data?.projects || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}

export async function fetchProjectsTrends(
    { type, typeId, page, limit = 20 }: { type?: string; typeId?: string | number; page?: number; limit?: number } = {}
): Promise<any[]> {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project/trends", {
            params: { ...queryParam, page, limit }
        });

        return data?.trends || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}

export async function fetchTopProjects(
    { type, typeId, page = 1, limit = 20 }: { type?: string; typeId?: string | number; page?: number; limit?: number } = {}
): Promise<Project[]> {
    try {
        const queryParam = getQueryParam(type, typeId);

        const { data } = await JUSTFLIP.get("/project", {
            params: {
                ...queryParam,
                status: "active",
                approval: "approved",
                page,
                limit,
                tag: "New Launches"
            }
        });

        return data?.projects || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}

export async function fetchProjectById(id: string | number): Promise<Project | null> {
    try {
        const { data } = await JUSTFLIP.get(`/project/${id}`);
        return data?.project || null;
    } catch (error: any) {
        handleApiError(error);
        return null;
    }
}

export async function fetchSimilarProjects(
    { id, page = 1, limit = 20 }: { id: string | number; page?: number; limit?: number }
): Promise<Project[]> {
    try {
        const { data } = await JUSTFLIP.get("/project/similar", {
            params: {
                status: "active",
                approval: "approved",
                locationId: id,
                page,
                limit
            }
        });

        return data?.projects || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}

export async function fetchProjectsBySearch(
    { search }: { search: string }
): Promise<Project[]> {
    try {
        const { data } = await JUSTFLIP.get("/project", {
            params: { search }
        });

        return data?.projects || [];
    } catch (error: any) {
        handleApiError(error);
        return [];
    }
}