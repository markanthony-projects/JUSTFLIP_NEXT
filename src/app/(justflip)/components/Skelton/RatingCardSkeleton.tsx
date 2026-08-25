import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const CircularRatingSkeleton = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-1">
        <SkeletonBlock className="w-[60px] h-[60px] !rounded-full" />
      </div>
      <SkeletonBlock className="h-[11px] w-16 mt-1" />
    </div>
  );
});

CircularRatingSkeleton.displayName = "CircularRatingSkeleton";

const PriceCardSkeleton = memo(() => {
  return (
    <div className="w-full lg:w-[260px] p-3 border border-gray-300 rounded-2xl flex justify-between items-center h-[106px]">
      <div>
        <SkeletonBlock className="h-[16px] w-10 mb-1" />
        <SkeletonBlock className="h-[28px] w-24 mb-1" />
        <SkeletonBlock className="h-[16px] w-32 pt-1" />
      </div>
      <SkeletonBlock className="w-11 h-11 !rounded-full shrink-0" />
    </div>
  );
});

PriceCardSkeleton.displayName = "PriceCardSkeleton";

export const RatingCardSkeleton = memo(() => {
  return (
    <div className="lg:px-5 lg:rounded-2xl lg:shadow-sm bg-white w-full p-2 md:p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      
      {/* Global Average Rating Display */}
      <div className="flex items-center space-x-2 border-gray-100 border-b pb-1 mb-1">
        <SkeletonBlock className="w-10 h-10 !rounded-xl" />
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline space-x-1.5">
            <SkeletonBlock className="h-[28px] w-12" />
            <SkeletonBlock className="h-[14px] w-14" />
          </div>
        </div>
      </div>

      {/* Circular Ratings Breakdown */}
      <div className="grid grid-cols-3 gap-2 w-full justify-items-center pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <CircularRatingSkeleton key={i} />
        ))}
      </div>

      {/* Price Trends Carousel */}
      <div className="mt-3 md:mt-4">
        <div className="flex items-center justify-between mb-2">
          <SkeletonBlock className="h-[14px] w-24" />
        </div>
        <div className="flex items-center justify-center h-[108px] mx-auto w-full lg:w-[260px]">
          <PriceCardSkeleton />
        </div>
      </div>

    </div>
  );
});

RatingCardSkeleton.displayName = "RatingCardSkeleton";
