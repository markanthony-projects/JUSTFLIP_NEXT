"use client";
import { useCallback, useMemo } from "react";
import { useFavouritesStore } from "@/src/stores/favourites.store";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "@/src/utils/toast";

export const useFavourite = (project) => {
    const token = useAuthStore((s) => s.token);

    const list = useFavouritesStore((s) => s.list);
    const modifyFavourite = useFavouritesStore((s) => s.modifyFavourite);

    const isFavourite = useMemo(() => {
        return project?.id ? list.includes(project.id) : false;
    }, [list, project?.id]);

    const toggleFavourite = useCallback(
        async (e) => {
            if (e) { e.preventDefault(); e.stopPropagation();}

            if (!project?.id) return;

            if (!token) {
                return { requiresAuth: true };
            }

            try {
                await modifyFavourite({
                    action: isFavourite ? "remove" : "add",
                    id: project.id,
                    property: project,
                });

                toast.success(
                    isFavourite
                        ? "Removed from favourites 💔"
                        : "Added to favourites ❤️"
                );
            } catch (err) {
                toast.error("Something went wrong");
            }
        },
        [isFavourite, project, token, modifyFavourite]
    );

    return {
        isFavourite,
        toggleFavourite,
    };
};