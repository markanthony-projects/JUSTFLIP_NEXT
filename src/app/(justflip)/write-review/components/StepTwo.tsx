"use client";

import React, { useState } from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi2";
import { useReviewStore } from "@/src/stores/review.store";
import { StepOneData, AspectRatings } from "@/src/types";

interface StepTwoProps {
  stepOneData: StepOneData;
  onSuccess?: () => void;
}

export default function StepTwo({ stepOneData, onSuccess }: StepTwoProps) {
  const submitReview = useReviewStore((state) => state.submitReview);
  const isSubmitting = useReviewStore((state) => state.isSubmitting);

  const isProject = stepOneData.type === "project";

  const [aspects, setAspects] = useState<AspectRatings>({
    environment: 0,
    lifestyle: 0,
    transport: 0,
  });

  const [overallRating, setOverallRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const handleAspectRating = (key: keyof AspectRatings, val: number) => {
    const updated = { ...aspects, [key]: val };
    setAspects(updated);

    const activeRatings = Object.values(updated).filter((v) => v > 0);
    if (activeRatings.length > 0) {
      const avg = activeRatings.reduce((a, b) => a + b, 0) / activeRatings.length;
      setOverallRating(Number(avg.toFixed(2)));
    }
  };

  const handleSubmit = async () => {
    if (!overallRating) return;

    const res = await submitReview({
      type: stepOneData.type,
      typeId: stepOneData.typeId,
      rating: overallRating,
      review: comment,
      aspects: {
        ...(isProject
          ? { environment: overallRating, lifestyle: overallRating, transport: overallRating }
          : aspects),
        userRole: stepOneData.userRole,
        userName: stepOneData.userName,
      },
    });

    if (res.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white p-7 md:p-10 rounded-2xl border border-gray-100 shadow-md">
      {/* Title Header matching StepOne */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#002B5B] tracking-tight">
          Review {stepOneData.locationName}
        </h2>
        <p className="text-base text-gray-500 font-medium mt-1.5">
          Reviewing as <span className="font-bold text-[#002B5B]">{stepOneData.userRole}</span>
        </p>
      </div>

      {/* Rating Input Area */}
      {isProject ? (
        <div className="mb-8 p-6 bg-slate-50/80 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
            RATE THIS PROJECT <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 my-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const activeStar = hoverRating ? star <= hoverRating : star <= overallRating;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setOverallRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  {activeStar ? (
                    <HiStar className="text-amber-400 text-4xl" />
                  ) : (
                    <HiOutlineStar className="text-gray-300 text-4xl hover:text-amber-300" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-sm font-bold text-[#002B5B] mt-2 h-5">
            {overallRating === 1 && "Poor"}
            {overallRating === 2 && "Below Average"}
            {overallRating === 3 && "Average"}
            {overallRating === 4 && "Good"}
            {overallRating === 5 && "Excellent!"}
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
            RATE KEY ASPECTS <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {[
              { key: "environment", title: "ENVIRONMENT", desc: "Greenery, noise levels, and cleanliness" },
              { key: "lifestyle", title: "LIFESTYLE", desc: "Amenities, safety, and community facilities" },
              { key: "transport", title: "TRANSPORT", desc: "Commute availability and connectivity" },
            ].map(({ key, title, desc }) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-gray-100 gap-3"
              >
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#002B5B] uppercase">{title}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
                </div>

                <div className="flex gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleAspectRating(key as keyof AspectRatings, star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= aspects[key as keyof AspectRatings] ? (
                        <HiStar className="text-amber-400 text-2xl" />
                      ) : (
                        <HiOutlineStar className="text-gray-300 text-2xl hover:text-amber-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Comment Input */}
      <div className="mb-10">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-2.5">
          DETAILED EXPERIENCE
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            isProject
              ? "Share your overall experience living in or visiting this project..."
              : "Share your experience regarding environment, lifestyle, or commute..."
          }
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-[#002B5B] text-base font-semibold text-gray-900 transition-all placeholder:text-gray-400 placeholder:font-normal resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isSubmitting || overallRating === 0}
        onClick={handleSubmit}
        className="w-full py-4 bg-[#002B5B] hover:bg-[#001f42] disabled:bg-gray-200 disabled:text-gray-400 text-white text-lg font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
        {!isSubmitting && <span className="text-xl">→</span>}
      </button>
    </div>
  );
}