"use client";

import StarRating from "@/src/components/atoms/StarRating";
import { useMemo, useState } from "react";

const RATING_COLORS: Record<number, string> = {
  5: "bg-emerald-500",
  4: "bg-emerald-400",
  3: "bg-amber-400",
  2: "bg-orange-400",
  1: "bg-rose-400",
};

export default function AvgRating({ reviews }: { reviews: any }) {
  const [activeRating, setActiveRating] = useState<number | null>(null);

  // Normalize review array safely
  const reviewList = useMemo(() => {
    if (Array.isArray(reviews)) return reviews;
    if (Array.isArray(reviews?.reviews)) return reviews.reviews;
    if (Array.isArray(reviews?.data)) return reviews.data;
    return [];
  }, [reviews]);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const explicitAverage = Number(reviews?.average || reviews?.global?.average);
    const explicitTotal = Number(reviews?.pagination?.totalReviews);
    const explicitCounts = reviews?.counts || reviews?.global?.counts;

    const totalReviews =
      !isNaN(explicitTotal) && explicitTotal > 0
        ? explicitTotal
        : reviewList.length;

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalSum = 0;

    if (explicitCounts && Object.keys(explicitCounts).length > 0) {
      for (let i = 1; i <= 5; i++) {
        counts[i] = Number(explicitCounts[i] || explicitCounts[String(i)] || 0);
      }
    } else {
      reviewList.forEach((r: any) => {
        const rating =
          Math.round(Number(r?.rating || r?.stars || r?.star)) || 0;
        if (rating >= 1 && rating <= 5) {
          totalSum += rating;
          counts[rating] += 1;
        }
      });
    }

    let average = "0.0";
    if (!isNaN(explicitAverage) && explicitAverage > 0) {
      average = explicitAverage.toFixed(1);
    } else if (totalReviews > 0) {
      average = (totalSum / totalReviews).toFixed(1);
    }

    return { average, totalReviews, counts };
  }, [reviews, reviewList]);

  return (
    <div className="md:pr-5 md:border-r md:border-gray-200/80 flex flex-col justify-center h-full">
      {/* Score and Stars */}
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
          {stats.average}
        </h3>

        <div className="flex justify-center mt-1.5">
          <StarRating
            value={Number(stats.average)}
            readOnly={true}
            width={4}
            height={4}
          />
        </div>

        <p className="text-xs text-gray-500 mt-1 font-medium">
          Based on{" "}
          <span className="font-semibold text-gray-800">
            {stats.totalReviews}
          </span>{" "}
          {stats.totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* 5 to 1 Rating Breakdown with Hover Tooltips */}
      <div className="mt-5 space-y-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const total = stats.totalReviews;
          const count = stats.counts[rating] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const isActive = activeRating === rating;

          return (
            <div
              key={rating}
              onClick={() => setActiveRating(isActive ? null : rating)}
              onMouseLeave={() => setActiveRating(null)}
              className="group relative flex items-center text-xs text-gray-600 gap-1.5 cursor-pointer select-none py-0.5"
            >
              <span className="w-3 font-semibold text-right text-gray-700">
                {rating}
              </span>
              <span className="text-[#D9A20D] text-[11px] leading-none">★</span>

              {/* Progress Bar Track */}
              <div className="flex-1 mx-1.5 bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${RATING_COLORS[rating]}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              {/* Hover Tooltip Popup */}
              <div
                className={`absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none bg-gray-900 text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-md whitespace-nowrap z-20 transition-all duration-150 ${
                  isActive
                    ? "opacity-100 visible -translate-y-0.5"
                    : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                }`}
              >
                {count} {count === 1 ? "review" : "reviews"} ({percentage.toFixed(0)}%)
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}