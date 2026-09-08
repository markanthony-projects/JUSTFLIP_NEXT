"use client";

import AvgRating from "@/src/app/(justflip)/components/CityComponent/AvgRating";
import ReviewCard from "../molecules/ReviewCard";
export interface ReviewsListProps {
  reviews?: any | any[];
  onWriteReview?: () => void;
}

export default function ReviewsList({ reviews = {}, onWriteReview }: ReviewsListProps) {
  const reviewList = Array.isArray(reviews)
    ? reviews
    : reviews?.reviews || reviews?.data || [];

  const hasOnlyRatingsWithoutMessages = reviewList.length > 0 && reviewList.every((review: any) => !review?.comment);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] gap-6 items-start">
      <div className="w-full">
        <AvgRating reviews={reviews} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max max-h-96 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 pr-1">
        {reviewList.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-60 col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-800 mb-1">No reviews yet</p>
            <p className="text-xs text-slate-500 mb-4 max-w-sm">Be the first one to review!</p>
            {onWriteReview && (
              <button 
                onClick={onWriteReview} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary text-white font-semibold text-sm rounded-lg cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Write a Review
              </button>
            )}
          </div>
        ) : hasOnlyRatingsWithoutMessages ? (
          <div className="flex flex-col items-center justify-center min-h-60 col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-800 mb-1">Review submitted without comments.</p>
            <p className="text-xs text-slate-500 mb-4 max-w-sm">Be the first one to comment!</p>
            {onWriteReview && (
              <button 
                onClick={onWriteReview} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary text-white font-semibold text-sm rounded-lg cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Write a Review
              </button>
            )}
          </div>
        ) : (
          reviewList.map((review: any, index: number) => {
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