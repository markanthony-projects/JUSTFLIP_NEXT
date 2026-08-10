import { Project } from "../types";

const KEY = "compare_properties";

export const compareStorage = {
    get(): Project[] {
        if (typeof window === "undefined") return [];
        try {
            const data = localStorage.getItem(KEY);
            return data ? JSON.parse(data) : [];
        } catch (e: any) {
            console.error("Storage get error", e);
            return [];
        }
    },

    set(data: Project[]): void {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e: any) {
            console.error("Storage set error", e);
        }
    },

    clear(): void {
        localStorage.removeItem(KEY);
    }
};