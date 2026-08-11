"use client";
import React, { useCallback, useMemo } from "react";
import { useFavouritesStore } from "@/src/stores/favourites.store";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "@/src/utils/toast";
import { Project } from "../types";

export const useFavourite = (project: Project | Record<string, any>) => {
    const token = useAuthStore((s: any) => s.token);

    const list = useFavouritesStore((s: any) => s.list);
    const modifyFavourite = useFavouritesStore((s: any) => s.modifyFavourite);

    const isFavourite = useMemo(() => {
        if(!token || !project?.id) return false
        return list.includes(project.id);
    }, [token, list, project?.id]);

    const toggleFavourite = useCallback(
        async (e?: React.MouseEvent | any) => {
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