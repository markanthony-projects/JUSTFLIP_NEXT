import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { useAuthStore } from "../stores/auth.store";
import { getReviewEndpoint } from "../utils/getReviewEndpoint";
import { Review } from "../types";

export interface ReviewResponse {
    global?: {
        reviews: Review[];
        average: number | string;
        aspects: any[];
        pagination: { totalReviews: number };
        counts: Record<string, number>;
    };
    [key: string]: any;
}

class ReviewService {
    static async getReviews({ type, typeId }: { type: string; typeId: string | number }): Promise<ReviewResponse> {
        const endpoint = getReviewEndpoint(type, typeId);
        
        if (!endpoint) {
            throw new Error(`Invalid review endpoint for type: ${type}`);
        }

        try {
            const { data } = await JUSTFLIP.get(endpoint);
            return data;
        } catch (error: unknown) {
            handleApiError(error);
            throw error;
        }
    }

    static async submitReview(endpoint: string, payload: Record<string, any>): Promise<any> {
        const token = useAuthStore.getState().token;
        const { data } = await JUSTFLIP.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return data;
    }

}

export default ReviewService;