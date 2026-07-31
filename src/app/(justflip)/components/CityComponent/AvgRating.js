"use client";

import StarRating from "@/src/components/atoms/StarRating";
import { useMemo } from "react";

const RATING_COLORS = {
  5: "bg-[#54954E]",
  4: "bg-[#A9D350]",
  3: "bg-[#EFE167]",
  2: "bg-[#E2A93E]",
  1: "bg-[#D9534F]",
};

export default function AvgRating({ reviews }) {
  // Normalize review array safely
  const reviewList = useMemo(() => {
    if (Array.isArray(reviews)) return reviews;
    if (Array.isArray(reviews?.reviews)) return reviews.reviews;
    if (Array.isArray(reviews?.data)) return reviews.data;
    return [];
  }, [reviews]);

  // Calculate stats dynamically
  const stats = useMemo(() => {
    const totalReviews = reviewList.length;

    if (totalReviews === 0) {
      return {
        average: "0.0",
        totalReviews: 0,
        counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalSum = 0;

    reviewList.forEach((r) => {
      const rating = Math.round(Number(r?.rating || r?.stars || r?.star)) || 0;
      if (rating >= 1 && rating <= 5) {
        totalSum += rating;
        counts[rating] += 1;
      }
    });

    return {
      average: (totalSum / totalReviews).toFixed(1),
      totalReviews,
      counts,
    };
  }, [reviewList]);

  return (
    <div className="md:px-2 md:border-r-2 md:border-gray-300 h-fit">
      <div className="text-center">
        <h2 className="text-4xl font-semibold text-gray-900">
          {stats.average}
        </h2>

        <div className="flex justify-center mt-1 gap-1">
          <StarRating
            height={5}
            width={5}
            value={Number(stats.average)}
            readOnly={true}
          />
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Based on{" "}
          <span className="font-medium text-gray-700">
            {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
          </span>
        </p>
      </div>

      {/* Breakdown Bars with Hover Tooltips */}
      <div className="mt-6 space-y-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const total = stats.totalReviews;
          const count = stats.counts[rating] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div
              key={rating}
              className="group relative flex items-center text-sm cursor-pointer"
            >
              <span className="text-gray-600 w-5 font-medium">{rating}</span>
              <span className="text-[#D9A20D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#D9A20D"
                  className="w-3.5 h-3.5 mb-0.5"
                >
                  <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                </svg>
              </span>

              {/* Bar Container */}
              <div className="flex-1 mx-2 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${RATING_COLORS[rating]}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>

              {/* Hover Tooltip Popup */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-gray-900 text-white text-xs py-1 px-2.5 rounded shadow-md whitespace-nowrap z-10">
                {count} {count === 1 ? "review" : "reviews"} ({percentage.toFixed(0)}%)
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}