import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const CircularRatingSkeleton = memo(() => {
  return (
    <div className="grid place-items-center">
      <SkeletonBlock className="w-[55px] h-[55px] rounded-full mb-2" />
      <SkeletonBlock className="h-3 w-12" />
    </div>
  );
});

const PriceCardSkeleton = memo(() => {
  return (
    <div className="w-full lg:w-[260px] p-3 border border-gray-200 rounded-lg h-[106px] flex justify-between">
      <div className="flex flex-col justify-between ">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-5 w-28" />
        <SkeletonBlock className="h-3 w-24 mt-2" />
      </div>

      <SkeletonBlock className="w-10 h-10 rounded-full" />
    </div>
  );
});

const PriceCarouselSkeleton = memo(({ count = 1 }) => {
  return (
    <div className="flex gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <PriceCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const RatingCardSkeleton = memo(() => {
  return (
    <div className="lg:p-4 lg:border border-gray-300 lg:rounded-xl bg-white w-full">
            <div className="flex items-end gap-2 border-b border-gray-300 pb-2">
        <SkeletonBlock className="w-6 h-6" />
        <SkeletonBlock className="h-8 w-16" />
        <SkeletonBlock className="h-4 w-16" />
      </div>

      <div className="flex gap-8 mt-4 justify-between">
        {Array.from({ length: 3 }).map((_, i) => (
          <CircularRatingSkeleton key={i} />
        ))}
      </div>

      <div>
        <SkeletonBlock className="h-4 w-32 my-4" />
        <div className="flex items-center justify-center h-[128px] w-full  overflow-x-auto">
          <PriceCarouselSkeleton />
        </div>
      </div>
    </div>
  );
});
