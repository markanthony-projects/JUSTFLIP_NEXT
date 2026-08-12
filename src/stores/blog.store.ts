import { create } from "zustand";
import BlogService from "@/src/services/Blog.Service";
import { Blog } from "@/src/types";

export interface BlogState {
  blogs: Blog[];
  blog: Blog | null;
  blogMap: Record<string, Blog>;
  loadingBlogs: boolean;
  loadingBlog: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export interface BlogActions {
  getBlogs: (params?: { page?: number; limit?: number; tag?: string }) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  resetBlogs: () => void;
  getBlogById: (id: string) => Promise<void>;
  clearBlog: () => void;
}

export const useBlogStore = create<BlogState & BlogActions>((set, get) => ({
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

  getBlogs: async ({ page = 1, limit = 20, tag }: { page?: number; limit?: number; tag?: string } = {}) => {
    try {
      console.log("Tag....", tag);

      set({ loadingBlogs: true, error: null });

      let formattedTag = tag;

      if (tag === "Trending Blogs") formattedTag = "Trending Blog";
      if (tag === "New Blogs") formattedTag = "New Blog";
      if (tag === "Upcoming Blogs") formattedTag = "Upcoming Blog";

      const { blogs, pagination } = await BlogService.fetchBlogs({ page, limit, tag: formattedTag });

      set((state) => ({
        blogs: page === 1 ? blogs : [...state.blogs, ...blogs],
        page,
        limit,
        totalPages: pagination?.totalPages || 1,
        total: pagination?.total || 0,
        hasMore: page < (pagination?.totalPages || 1),
        loadingBlogs: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch blogs",
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

  getBlogById: async (id: string) => {
    const state = get();

    if (state.blogMap[id]) {
      set({ blog: state.blogMap[id] });
      return;
    }

    try {
      set({ loadingBlog: true, error: null });

      const data = await BlogService.fetchBlogById(id);

      set((state) => ({
        blog: data?.blog || null,
        blogMap: { ...state.blogMap, [id]: data?.blog },
        loadingBlog: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch blog",
        loadingBlog: false,
      });
    }
  },

  clearBlog: () => set({ blog: null }),
}));