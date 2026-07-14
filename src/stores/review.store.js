"use client";

import { create } from "zustand";
import ReviewService from "@/src/services/ReviewService";
import { getReviewEndpoint } from "@/src/utils/getReviewEndpoint";
import { toast } from "@/src/utils/toast";

export const useReviewStore = create((set, get) => ({
    reviews: {
        reviews: [],
        average: 0,
        pagination: { totalReviews: 0 },
        counts: {}
    },
    isLoading: false,
    isSubmitting: false,
    error: null,

    setReviews: (data) => {
        if (!data) return;
        set({ reviews: data });
    },

    fetchReviews: async ({ type, id }) => {
        set({ isLoading: true, error: null });

        try {
            const endpoint = getReviewEndpoint(type, id);
            if (!endpoint) throw new Error("Invalid endpoint");

            const data = await ReviewService.getReviews(endpoint);
            const reviewData = data?.global || { reviews: [], average: 0, pagination: { totalReviews: 0 } };

            set({
                reviews: reviewData,
                isLoading: false,
            });

            return { success: true };
        } catch (err) {
            set({
                error: err?.message || "Failed to fetch reviews",
                isLoading: false,
            });

            return { success: false };
        }
    },

    submitReview: async ({ type, typeId, rating, review, aspects }) => {
        set({ isSubmitting: true });

        try {
            let endpoint = "";
            let payload = { rating, comment: review };

            switch (type?.toLowerCase()) {
                case "city":
                    endpoint = "/city/review";
                    payload.cityId = typeId;
                    break;
                case "zone":
                    endpoint = "/zone/review";
                    payload.zoneId = typeId;
                    break;
                case "location":
                    endpoint = "/location/review";
                    payload.locationId = typeId;
                    break;
                case "project":
                    endpoint = "/project/review";
                    payload.projectId = typeId;
                    break;
                default:
                    throw new Error("Invalid type");
            }

            await ReviewService.submitReview(endpoint, payload);
            
            set((state) => {
                const currentReviews = state.reviews?.reviews || [];
                const currentTotal = state.reviews?.pagination?.totalReviews || 0;
                
                return {
                    reviews: {
                        ...state.reviews,
                        pagination: {
                            ...state.reviews.pagination,
                            totalReviews: currentTotal + 1
                        },
                        reviews: [
                            {
                                rating,
                                comment: review,
                                reviewer: { name: "You" },
                                createdAt: new Date().toISOString()
                            },
                            ...currentReviews,
                        ]
                    },
                    isSubmitting: false,
                };
            });

            toast.success("Review Submitted Successfully")
            return { success: true };
        } catch (error) {
            set({ isSubmitting: false });
            toast.error(error?.response?.data?.message || "Failed to submit review")
            return { success: false };
        }
    },
}));