import { AUTH, JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { AuthUser } from "../types";

class AuthService {
    static async sendOtp(email: string): Promise<any> {
        try {
            const { data } = await AUTH.post("/portal/send-otp", { email });
            return data;
        } catch (error: any) {
            handleApiError(error);
        }
    }

    static async verifyOtp({ email, otp }: { email: string; otp: string }): Promise<any> {
        try {
            const { data } = await AUTH.post("/portal/verify-otp", {
                email,
                otp,
            });
            return data;
        } catch (error: any) {
            handleApiError(error);
        }
    }

    static async brokerLogout(): Promise<void> {
        try {
            await AUTH.post("/portal/broker-logout");
        } catch (error: any) {
            handleApiError(error);
        }
    }

    static async forgotBrokerPassword({ email }: { email: string }): Promise<any> {
        try {
            const { data } = await AUTH.post("/portal/forgot-password", { email });
            return data;
        } catch (error: any) {
            handleApiError(error);
        }
    }

    static async brokerLogin(payload: Record<string, any>): Promise<{ user: AuthUser; token: string }> {
        try {
            const { data } = await AUTH.post("/portal/broker-login", payload);
            return { user: data.broker, token: data.token };
        } catch (error: any) {
            throw handleApiError(error);
        }
    }

    static async updateBrokerProfile(id: string | number, payload: Record<string, any>): Promise<any> {
        try {
            const { data } = await JUSTFLIP.put(`/broker/${id}`, payload);
            return data;
        } catch (error: any) {
            throw handleApiError(error);
        }
    }

    static async refreshAccessToken({ email, role, app }: { email: string; role?: string; app?: string }): Promise<string | null> {
        try {
            const { data } = await AUTH.post("/portal/refresh-token", { email, role, app });
            return data?.token ?? null;
        } catch (error: any) {
            throw handleApiError(error);
        }
    }

    static async logout(): Promise<any> {
        try {
            const { data } = await AUTH.post("/auth/logout");
            return data;
        } catch (error: any) {
            handleApiError(error);
        }
    }

    static async getSession(): Promise<{ user: AuthUser; [key: string]: any } | any> {
        try {
            const { data } = await AUTH.get("/auth/me");
            return data;
        } catch (error: any) {
            handleApiError(error);
        }
    }
}

export default AuthService;
