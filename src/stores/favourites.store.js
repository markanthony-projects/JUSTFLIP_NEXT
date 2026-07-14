import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { JUSTFLIP } from "../lib/axios/api";

const getUserType = () => {
    if (typeof window === "undefined") return "";

    try {
        const stored = localStorage.getItem("auth-store");
        const userData = stored ? JSON.parse(stored) : null;
        return userData?.state?.authType === "visitor" ? "user" : "broker";
    } catch {
        return "";
    }
};

export const useFavouritesStore = create(
    devtools(
        persist(
            (set, get) => ({
                list: [],
                dataList: [],
                loading: false,
                error: null,

                fetchFavouriteData: async () => {
                    if (get().loading) return;

                    try {
                        set({ loading: true, error: null });

                        const userType = getUserType();
                        const res = await JUSTFLIP.get("/favourites/user", { params: { mode: "data", userType }, });
                        set({
                            dataList: res?.data?.favourites || [],
                            loading: false,
                        });
                    } catch (err) {
                        set({
                            error: err?.response?.data?.message || err?.message || "Failed to fetch favourites",
                            loading: false,
                        });
                    }
                },

                fetchFavouriteIds: async () => {
                    if (get().loading) return;

                    try {
                        set({ loading: true, error: null });

                        const userType = getUserType();
                        const res = await JUSTFLIP.get("/favourites/user", { params: { mode: "ids", userType } });

                        set({
                            list: res?.data?.favourites || [],
                            loading: false,
                        });
                    } catch (err) {
                        set({
                            error: err?.response?.data?.message || err?.message || "Failed to fetch ids",
                            loading: false,
                        });
                    }
                },

                modifyFavourite: async ({ action, id, property = {} }) => {
                    const prev = get();

                    try {
                        if (action === "add") {
                            if (!prev.list.includes(id)) {
                                set({
                                    list: [id, ...prev.list],
                                    dataList: [property, ...prev.dataList],
                                });
                            }
                        } else {
                            set({
                                list: prev.list.filter((i) => i !== id),
                                dataList: prev.dataList.filter((d) => d.id !== id),
                            });
                        }

                        const userType = getUserType()
                        await JUSTFLIP.post("/favourites/user", { userType, action, projectId: id, });
                    } catch (err) {
                        set({
                            list: prev.list,
                            dataList: prev.dataList,
                            error: err?.response?.data?.message || err?.message || "Update failed",
                        });
                    }
                },
            }),
            {
                name: "favourites-storage",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ list: state.list, dataList: state.dataList, }),
            }
        ),
        { name: "FAVOURITES_STORE" }
    )
);