import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useAuthStore } from "@/src/stores/auth.store";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError | any) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Prevent infinite loops: already retried OR this is the refresh endpoint itself
        if (
            originalRequest?._retry ||
            originalRequest?.url?.includes("/portal/refresh-token")
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

            if (originalRequest) {
                originalRequest._retry = true;
            }

            try {
                const { refreshAccessToken } = useAuthStore.getState();
                await refreshAccessToken();

                const newToken = useAuthStore.getState().token;

                if (newToken && originalRequest) {
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