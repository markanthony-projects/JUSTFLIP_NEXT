import { JUSTFLIP } from "../lib/axios/api";
import { handleApiError } from "../lib/axios/apiError";
import { Blog } from "../types";

class BlogService {
    static async fetchBlogs(
        { page = 1, limit = 16, tag }: { page?: number; limit?: number; tag?: string } = {}
    ): Promise<{ page: number; blogs: Blog[]; pagination: any }> {
        try {
            const { data } = await JUSTFLIP.get("/blog?status=active&approval=approved", { params: { page, limit, tag } });
            return { page, blogs: data?.blogs || [], pagination: data?.meta || {} };
        } catch (error: any) {
            throw handleApiError(error);
        }
    }

    static async fetchBlogById(id: string | number): Promise<Blog | any> {
        try {
            if (!id) throw new Error("Blog ID is required");
            const { data } = await JUSTFLIP.get(`/blog/${id}`);
            return data;
        } catch (error: any) {
            throw handleApiError(error);
        }
    }

}

export default BlogService;