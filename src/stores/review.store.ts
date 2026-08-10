"use client";

import { create } from "zustand";
import ReviewService from "@/src/services/ReviewService";
import { getReviewEndpoint } from "@/src/utils/getReviewEndpoint";
import { toast } from "@/src/utils/toast";
import { Review } from "@/src/types";

export interface ReviewData {
  reviews: Review[];
  average: number | string;
  aspects: any[];
  pagination: { totalReviews: number };
  counts: Record<string, number>;
}

export interface ReviewState {
  reviews: ReviewData;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface ReviewActions {
  hydrateStore: (serverData: any) => void;
  setReviews: (data: ReviewData) => void;
  fetchReviews: (params: { type: string; id: string }) => Promise<{ success: boolean }>;
  submitReview: (params: { type: string; typeId: string; rating: number; review: string; aspects?: any }) => Promise<{ success: boolean }>;
}

export const useReviewStore = create<ReviewState & ReviewActions>((set, get) => ({
  reviews: {
    reviews: [],
    average: 0,
    aspects: [],
    pagination: { totalReviews: 0 },
    counts: {},
  },
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Hydrate initial data from server on page load
  hydrateStore: (serverData) => {
    if (!serverData) return;
    set((state) => {
      // Don't overwrite if store already has submitted user reviews
      if (state.reviews?.reviews?.length > (serverData?.reviews?.length || 0)) {
        return state;
      }

      return {
        reviews: {
          reviews: serverData?.reviews || [],
          average: serverData?.global?.average || serverData?.average || 0,
          aspects: serverData?.aspects || [],
          pagination: serverData?.pagination || { totalReviews: 0 },
          counts: serverData?.counts || {},
        },
      };
    });
  },

  setReviews: (data) => {
    if (!data) return;
    set({ reviews: data });
  },

  fetchReviews: async ({ type, id }) => {
    set({ isLoading: true, error: null });

    try {
      const data = await ReviewService.getReviews({ type, typeId: id });
      const reviewData = data?.global || {
        reviews: [],
        average: 0,
        aspects: [],
        pagination: { totalReviews: 0 },
        counts: {},
      };

      set({
        reviews: reviewData,
        isLoading: false,
      });

      return { success: true };
    } catch (err: any) {
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
      let payload: any = { rating, comment: review, aspects };

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
        const currentCounts: Record<string, number> = { ...(state.reviews?.counts || {}) };

        const newReview = {
          id: String(Date.now()),
          rating: Number(rating),
          comment: review,
          aspects: aspects || {},
          userName: "You",
          reviewer: { name: "You" },
          createdAt: new Date().toISOString(),
        };

        const updatedReviews = [newReview, ...currentReviews];
        const newTotal = currentTotal + 1;

        currentCounts[String(rating)] = (currentCounts[String(rating)] || 0) + 1;

        const totalRatingSum = updatedReviews.reduce(
          (sum, r) => sum + (Number(r?.rating) || 0),
          0
        );
        const newAverage = (totalRatingSum / newTotal).toFixed(2);

        return {
          reviews: {
            ...state.reviews,
            average: newAverage,
            counts: currentCounts,
            pagination: {
              ...state.reviews?.pagination,
              totalReviews: newTotal,
            },
            reviews: updatedReviews,
          },
          isSubmitting: false,
        };
      });

      toast.success("Review Submitted Successfully");
      return { success: true };
    } catch (error: any) {
      set({ isSubmitting: false });
      toast.error(error?.response?.data?.message || "Failed to submit review");
      return { success: false };
    }
  },
}));