//this file works as a store for the APIs and gives us liberty to write only the endpoints and the whole URL.

import api from "./index.js";

function createApi(base) {

    if (!base || typeof base !== "string") {
        throw new Error("Base URL must be a non-empty string");
    }

    const normalizeUrl = (url) => {
        const cleanBase = base.replace(/\/$/, "");
        const cleanUrl = url.startsWith("/") ? url : `/${url}`;
        return `${cleanBase}${cleanUrl}`;
    };
 
    return {
        get: (url, config) => api.get(normalizeUrl(url), config),
        post: (url, data, config) => api.post(normalizeUrl(url), data, config),
        put: (url, data, config) => api.put(normalizeUrl(url), data, config),
        patch: (url, data, config) => api.patch(normalizeUrl(url), data, config),
        delete: (url, config) => api.delete(normalizeUrl(url), config),
    };
}

export const AUTH = createApi("/auth");

export const JUSTFLIP = createApi('/portal');

export const USERS = createApi('/users');