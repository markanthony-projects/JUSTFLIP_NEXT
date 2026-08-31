"use client";

import AvgRating from "@/src/app/(justflip)/components/CityComponent/AvgRating";
import ReviewCard from "../molecules/ReviewCard";

export interface ReviewsListProps {
  reviews?: any | any[];
  onWriteReview?: () => void;
}

export default function ReviewsList({ reviews = {}, onWriteReview }: ReviewsListProps) {
  // Ensure we get the array regardless of nesting
  const reviewList = Array.isArray(reviews)
    ? reviews
    : reviews?.reviews || reviews?.data || [];

  const hasOnlyRatingsWithoutMessages = reviewList.length > 0 && reviewList.every((review: any) => !review?.comment);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 bg-[#F8FAFC] border border-gray-200/70 rounded-xl p-4 md:p-5">
      <AvgRating reviews={reviews} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5 auto-rows-max max-h-73 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 pr-1">
        {reviewList.length === 0 ? (
          <div className="flex items-center justify-center min-h-73 col-span-full flex-1 rounded-lg border border-dashed border-gray-200 bg-white text-xs text-gray-400">
            No reviews available
          </div>
        ) : hasOnlyRatingsWithoutMessages ? (
          <div className="flex flex-col items-center justify-center min-h-73 col-span-full flex-1 rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">Review submitted without comments.</p>
            <p className="text-xs text-gray-400 mb-5">Be the first one to comment!</p>
            <div>
            {onWriteReview && (
              <button 
                onClick={onWriteReview} 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#002B5B] hover:bg-[#002B5B] text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                  Write a Review
              </button>
            )}
            </div>
          </div>
        ) : (
          reviewList.map((review: any, index: number) => {
            // Skip rendering individual cards if comment is empty
            if (!review?.comment || review.comment.trim() === "") {
              return null;
            }
            return <ReviewCard key={review?.id ?? index} review={review} />;
          })
        )}
      </div>
    </div>
  );
}