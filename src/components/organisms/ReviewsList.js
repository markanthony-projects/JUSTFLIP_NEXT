"use client";

import AvgRating from "@/src/app/(justflip)/components/CityComponent/AvgRating";
import ReviewCard from "../molecules/ReviewCard";

export default function ReviewsList({ reviews = {} }) {
  // Ensure we get the array regardless of nesting
  const reviewList = Array.isArray(reviews) ? reviews : (reviews?.reviews || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 bg-[#F3F8FA] rounded-lg p-4">
      <AvgRating reviews={reviews} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 auto-rows-max max-h-73 overflow-y-auto scrollbar-modern ">
        {reviewList.length > 0 ? (
          reviewList.map((review, index) => (
            <ReviewCard key={review?.id ?? index} review={review} />
          ))
        ) : (
          <div className="flex items-center justify-center min-h-73 col-span-full flex-1 rounded-lg border border-gray-200 bg-white text-sm text-gray-500">
            No reviews available
          </div>
        )}
      </div>
    </div>
  );
}