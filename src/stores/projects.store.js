import { create } from "zustand";
import * as ProjectService from "@/src/services/ProjectService";

export const useProjectStore = create((set, get) => ({
    projects: [],
    project: {},
    trends: [],
    similarProjects: [],
    topProperty: [],
    loadingProjects: false,
    loadingTopProperty: false,
    loadingProject: false,
    loadingTrends: false,
    loadingSimilarProjects: false,
    error: null,
    itemsPerView: 1,
    activeTab: "New Launches",

    fetchExploreProjects: async ({ typeId, type, page = 1, limit = 25 }) => {
        try {
            set({ loadingProjects: true, error: null });

            const res = await ProjectService.fetchExploreProjects({ typeId, type, page, limit, });
            set({ projects: res || [], loadingProjects: false, });
        } catch (error) {
            set({
                error: error?.message || "Something went wrong",
                loadingProjects: false,
            });
        }
    },

    fetchProjectsTrends: async ({ typeId, type, page = 1, limit = 4 }) => {
        try {
            set({ loadingTrends: true, error: null });
            const res = await ProjectService.fetchProjectsTrends({ typeId, type, page, limit, });
            set({ trends: res || [], loadingTrends: false, });
        } catch (error) {
            set({
                error: error?.message || "Something went wrong",
                loadingTrends: false,
            });
        }
    },

    fetchTopProjects: async ({ typeId, type, page = 1, limit = 4 }) => {
        try {
            set({ loadingTopProperty: true, error: null });
            const res = await ProjectService.fetchTopProjects({ typeId, type, page, limit, });
            set({ topProperty: res || [], loadingTopProperty: false, });
        } catch (error) {
            set({
                error: error?.message || "Something went wrong",
                loadingTrends: false,
            });
        }
    },

    fetchProjectById: async (id) => {
        try {
            set({ loadingProject: true, error: null });
            const res = await ProjectService.fetchProjectById(id);
            set({
                project: res || {},
                loadingProject: false,
            });
        } catch (error) {
            set({
                error: error?.message || "Something went wrong",
                loadingProject: false,
            });
        }
    },

    fetchSimilarProjects: async ({ id, page = 1, limit = 20 }) => {
        try {
            set({ loadingSimilarProjects: true, error: null });
            const res = await ProjectService.fetchSimilarProjects({ id, page, limit });
            set({ similarProjects: res || [], loadingSimilarProjects: false });
        } catch (error) {
            set({
                error: error?.message || "Something went wrong",
                loadingSimilarProjects: false,
            });
            return [];
        }
    },

    setItemsPerView: (value) => set({ itemsPerView: value }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    clearProjects: () => set({ projects: [] }),
    clearTrends: () => set({ trends: [] }),
    clearProject: () => set({ project: {} }),
    clearSimilarProjects: () => set({ similarProjects: [] }),
}));