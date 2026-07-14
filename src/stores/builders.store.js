import { create } from "zustand";
import * as BuilderService from "../services/BuilderService";

export const useDeveloperStore = create((set, get) => ({
  developers: [],
  selectedDeveloper: null,
  projects: [],
  pagination: null,
  page: 1,
  hasMore: true,
  loading: false,
  isFetching: false,
  error: null,

  fetchDevelopers: async ({ page = 1, limit = 20, search = "" }) => {
    const { isFetching, developers } = get();
    if (isFetching) return;

    set({ isFetching: true, loading: page === 1, error: null });

    try {
      const data = await BuilderService.fetchDevelopers({
        page,
        limit,
        search,
      });

      const builders = data?.builders || [];
      const total = data?.total || 0;
      const perPage = data?.limit || limit;

      const totalPages = Math.ceil(total / perPage);

      set({
        developers:
          page === 1
            ? builders
            : [...developers, ...builders],

        pagination: {
          total,
          limit: perPage,
          page,
          totalPages,
        },

        page,
        hasMore: page < totalPages,
        loading: false,
        isFetching: false,
      });
    } catch (err) {
      set({
        error: err?.message,
        loading: false,
        isFetching: false,
      });
    }
  },

  fetchDeveloperById: async (id) => {
    set({ loading: true, error: null });

    try {
      const data = await BuilderService.fetchDeveloperById(id);

      set({
        selectedDeveloper: data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.message,
        loading: false,
      });
    }
  },



  fetchProjectByDeveloperId: async ({ id, page = 1, limit = 20, tag }) => {
    const { projects, isFetching } = get();
    if (isFetching) return;

    set({ isFetching: true, loading: page === 1 });

    try {
      const data =
        await BuilderService.fetchProjectByDeveloperId({
          id,
          page,
          limit,
          tag
        });


      const newProjects = data?.projects || data || [];

      const merged =
        page === 1
          ? newProjects
          : [
            ...projects,
            ...newProjects.filter(
              (p) => !projects.some((x) => x.id === p.id)
            ),
          ];

      set({
        projects: merged,
        page,
        hasMore: newProjects.length === limit,
        loading: false,
        isFetching: false,
      });
    } catch (err) {
      set({
        error: err?.message,
        loading: false,
        isFetching: false,
      });
    }
  },


  reset: () =>
    set({
      developers: [],
      selectedDeveloper: null,
      projects: [],
      page: 1,
      hasMore: true,
      pagination: null,
    }),
}));