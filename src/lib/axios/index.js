
import axios from "axios";
import { useAuthStore } from "@/src/stores/auth.store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops: already retried OR this is the refresh endpoint itself
        if (
            originalRequest._retry ||
            originalRequest.url?.includes("/portal/refresh-token")
        ) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            typeof window !== "undefined"
        ) {
            const { authType, hydrated } = useAuthStore.getState();

            // Guard: skip refresh if store hasn't rehydrated yet (authType would be null → 400)
            if (!hydrated || !authType) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const { refreshAccessToken } = useAuthStore.getState();
                await refreshAccessToken();

                const newToken = useAuthStore.getState().token;

                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                const { logout } = useAuthStore.getState();
                logout();
            }
        }

        return Promise.reject(error);
    }
);

export default api;