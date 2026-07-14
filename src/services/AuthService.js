import { AUTH, JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

class AuthService {
    static async sendOtp(email) {
        try {
            const { data } = await AUTH.post("/portal/send-otp", { email });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async verifyOtp({ email, otp }) {
        try {
            const { data } = await AUTH.post("/portal/verify-otp", {
                email,
                otp,
            });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async brokerLogin({ email, password }) {
        try {
            const { data } = await AUTH.post("/portal/broker-login", {
                email,
                password,
            });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async brokerLogout() {
        try {
            await AUTH.post("/portal/broker-logout");
        } catch (error) {
            handleApiError(error);
        }
    }

    static async forgotBrokerPassword({ email }) {
        try {
            const { data } = await AUTH.post("/portal/forgot-password", { email });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async brokerLogin(payload) {
        try {
            const { data } = await AUTH.post("/portal/broker-login", payload);
            return { user: data.broker, token: data.token };
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async updateBrokerProfile(id, payload) {
        try {
            const { data } = await JUSTFLIP.put(`/broker/${id}`, payload);
            return data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async refreshAccessToken({ email, role, app }) {
        try {
            const { data } = await AUTH.post("/portal/refresh-token", { email, role, app });
            return data?.token ?? null;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async logout() {
        try {
            const { data } = await AUTH.post("/auth/logout");
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }

    static async getSession() {
        try {
            const { data } = await AUTH.get("/auth/me");
            return data;
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default AuthService;
