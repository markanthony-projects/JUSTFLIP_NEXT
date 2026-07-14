import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";

class BlogService {
    static async fetchBlogs({ page = 1, limit = 16 , tag } = {}) {
        try {
            const { data } = await JUSTFLIP.get("/blog?status=active&approval=approved", { params: { page, limit  } });
            return { page, blogs: data?.blogs || [], pagination: data?.meta || {} };
        } catch (error) {
            throw handleApiError(error);
        }
    }

    static async fetchBlogById(id) {
        try {
            if (!id) throw new Error("Blog ID is required");
            const { data } = await JUSTFLIP.get(`/blog/${id}`);
            return data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

}

export default BlogService;