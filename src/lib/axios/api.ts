//this file works as a store for the APIs and gives us liberty to write only the endpoints and the whole URL.

import api from "./index";
import { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiWrapper {
    get: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    post: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    put: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    patch: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
    delete: (url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse>;
}

function createApi(base: string): ApiWrapper {

    if (!base || typeof base !== "string") {
        throw new Error("Base URL must be a non-empty string");
    }

    const normalizeUrl = (url: string): string => {
        const cleanBase = base.replace(/\/$/, "");
        const cleanUrl = url.startsWith("/") ? url : `/${url}`;
        return `${cleanBase}${cleanUrl}`;
    };
 
    return {
        get: (url: string, config?: AxiosRequestConfig) => api.get(normalizeUrl(url), config),
        post: (url: string, data?: any, config?: AxiosRequestConfig) => api.post(normalizeUrl(url), data, config),
        put: (url: string, data?: any, config?: AxiosRequestConfig) => api.put(normalizeUrl(url), data, config),
        patch: (url: string, data?: any, config?: AxiosRequestConfig) => api.patch(normalizeUrl(url), data, config),
        delete: (url: string, config?: AxiosRequestConfig) => api.delete(normalizeUrl(url), config),
    };
}

export const AUTH = createApi("/auth");

export const JUSTFLIP = createApi('/portal');

export const USERS = createApi('/users');