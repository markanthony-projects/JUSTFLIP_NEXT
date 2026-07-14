const KEY = "compare_properties";

export const compareStorage = {
    get() {
        if (typeof window === "undefined") return [];
        try {
            const data = localStorage.getItem(KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Storage get error", e);
            return [];
        }
    },

    set(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Storage set error", e);
        }
    },

    clear() {
        localStorage.removeItem(KEY);
    }
};