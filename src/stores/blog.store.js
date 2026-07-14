import { create } from "zustand";
import BlogService from "@/src/services/Blog.Service";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  blog: null,
  blogMap: {},
  loadingBlogs: false,
  loadingBlog: false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  total: 0,
  hasMore: true,

  getBlogs: async ({ page = 1, limit = 20 , tag } = {}) => {
    try {
      set({ loadingBlogs: true, error: null });

      const { blogs, pagination } = await BlogService.fetchBlogs({ page, limit, tag});

      set((state) => ({
        blogs: page === 1 ? blogs : [...state.blogs, ...blogs] ,
        page,
        limit,
        totalPages: pagination?.totalPages || 1,
        total: pagination?.total || 0,
        hasMore: page < (pagination?.totalPages || 1),
        loadingBlogs: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        loadingBlogs: false,
      });
    }
  },

  nextPage: async () => {
    const { page, totalPages, loadingBlogs, getBlogs, limit } = get();

    if (loadingBlogs || page >= totalPages) return;

    await getBlogs({ page: page + 1, limit });
  },

  prevPage: async () => {
    const { page, loadingBlogs, getBlogs, limit } = get();

    if (loadingBlogs || page <= 1) return;

    await getBlogs({ page: page - 1, limit });
  },

  resetBlogs: () =>
    set({
      blogs: [],
      page: 1,
      totalPages: 1,
      total: 0,
      hasMore: true,
      error: null,
    }),

  getBlogById: async (id) => {
    const state = get();

    if (state.blogMap[id]) {
      set({ blog: state.blogMap[id] });
      return;
    }

    try {
      set({ loadingBlog: true, error: null });

      const data = await BlogService.fetchBlogById(id);

      set((state) => ({
        blog: data?.blog,
        blogMap: { ...state.blogMap, [id]: data?.blog,},
        loadingBlog: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        loadingBlog: false,
      });
    }
  },

  clearBlog: () => set({ blog: null }),
}));