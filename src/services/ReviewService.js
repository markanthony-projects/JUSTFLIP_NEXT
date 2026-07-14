import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { useAuthStore } from "../stores/auth.store";
import { getReviewEndpoint } from "../utils/getReviewEndpoint";

class ReviewService {
    static async getReviews({ type, typeId }) {
        const endpoint = getReviewEndpoint(type, typeId);
        
        try {
            const { data } = await JUSTFLIP.get(endpoint);
            return data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }

    static async submitReview(endpoint, payload) {
        const token = useAuthStore.getState().token;
        const { data } = await JUSTFLIP.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        },);
        return data;
    }

}

export default ReviewService;