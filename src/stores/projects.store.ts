import { create } from "zustand";
import * as ProjectService from "@/src/services/ProjectService";
import { Project } from "@/src/types";

export interface ProjectState {
    projects: Project[];
    project: Project | Record<string, any>;
    trends: Project[];
    similarProjects: Project[];
    topProperty: Project[];
    loadingProjects: boolean;
    loadingTopProperty: boolean;
    loadingProject: boolean;
    loadingTrends: boolean;
    loadingSimilarProjects: boolean;
    error: string | null;
    itemsPerView: number;
    activeTab: string;
}

export interface ProjectActions {
    fetchExploreProjects: (params: { typeId?: string; type?: string; page?: number; limit?: number }) => Promise<void>;
    fetchProjectsTrends: (params: { typeId?: string; type?: string; page?: number; limit?: number }) => Promise<void>;
    fetchTopProjects: (params: { typeId?: string; type?: string; page?: number; limit?: number }) => Promise<void>;
    fetchProjectById: (id: string) => Promise<void>;
    fetchSimilarProjects: (params: { id: string; page?: number; limit?: number }) => Promise<void | any[]>;
    
    setItemsPerView: (value: number) => void;
    setActiveTab: (tab: string) => void;
    clearProjects: () => void;
    clearTrends: () => void;
    clearProject: () => void;
    clearSimilarProjects: () => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
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

            const res = await ProjectService.fetchExploreProjects({ typeId, type, page, limit });
            set({ projects: res || [], loadingProjects: false });
        } catch (error: any) {
            set({
                error: error?.message || "Something went wrong",
                loadingProjects: false,
            });
        }
    },

    fetchProjectsTrends: async ({ typeId, type, page = 1, limit = 4 }) => {
        try {
            set({ loadingTrends: true, error: null });
            const res = await ProjectService.fetchProjectsTrends({ typeId, type, page, limit });
            set({ trends: res || [], loadingTrends: false });
        } catch (error: any) {
            set({
                error: error?.message || "Something went wrong",
                loadingTrends: false,
            });
        }
    },

    fetchTopProjects: async ({ typeId, type, page = 1, limit = 4 }) => {
        try {
            set({ loadingTopProperty: true, error: null });
            const res = await ProjectService.fetchTopProjects({ typeId, type, page, limit });
            set({ topProperty: res || [], loadingTopProperty: false });
        } catch (error: any) {
            set({
                error: error?.message || "Something went wrong",
                loadingTrends: false, // Intentionally leaving as loadingTrends since this was the original behavior, though likely a typo
            });
        }
    },

    fetchProjectById: async (id: string) => {
        try {
            set({ loadingProject: true, error: null });
            const res = await ProjectService.fetchProjectById(id);
            set({
                project: res || {},
                loadingProject: false,
            });
        } catch (error: any) {
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
        } catch (error: any) {
            set({
                error: error?.message || "Something went wrong",
                loadingSimilarProjects: false,
            });
            return [];
        }
    },

    setItemsPerView: (value: number) => set({ itemsPerView: value }),
    setActiveTab: (tab: string) => set({ activeTab: tab }),
    clearProjects: () => set({ projects: [] }),
    clearTrends: () => set({ trends: [] }),
    clearProject: () => set({ project: {} }),
    clearSimilarProjects: () => set({ similarProjects: [] }),
}));