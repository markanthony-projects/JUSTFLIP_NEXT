"use client";

import AvgRating from "@/src/app/(justflip)/components/CityComponent/AvgRating";
import ReviewCard from "../molecules/ReviewCard";

export interface ReviewsListProps {
  reviews?: any | any[];
}

export default function ReviewsList({ reviews = {} }: ReviewsListProps) {
  // Ensure we get the array regardless of nesting
  const reviewList = Array.isArray(reviews)
    ? reviews
    : reviews?.reviews || reviews?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 bg-[#F8FAFC] border border-gray-200/70 rounded-xl p-4 md:p-5">
      <AvgRating reviews={reviews} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5 auto-rows-max max-h-73 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 pr-1">
        {reviewList.length > 0 ? (
          reviewList.map((review: any, index: number) => (
            <ReviewCard key={review?.id ?? index} review={review} />
          ))
        ) : (
          <div className="flex items-center justify-center min-h-73 col-span-full flex-1 rounded-lg border border-dashed border-gray-200 bg-white text-xs text-gray-400">
            No reviews available
          </div>
        )}
      </div>
    </div>
  );
}