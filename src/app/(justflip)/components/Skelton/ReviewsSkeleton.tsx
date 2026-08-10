import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const HeaderSkeleton = () => (
  <div className="flex justify-between mb-4">
    <SkeletonBlock className="h-5 w-32" />
    <SkeletonBlock className="h-4 w-28" />
  </div>
);

const AvgRatingSkeleton = () => {
  return (
    <div className="md:px-2 md:border-r-2 md:border-gray-300">
      <div className="text-center">
        <SkeletonBlock className="h-10 w-16 mx-auto" />
        <SkeletonBlock className="h-4 w-24 mx-auto mt-2" />
        <SkeletonBlock className="h-3 w-32 mx-auto mt-2" />
      </div>

      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-4" />
            <SkeletonBlock className="h-4 w-4" />
            <SkeletonBlock className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <div className="bg-white  p-3 rounded-lg border border-gray-200 min-h-33">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="w-8 h-8 rounded-full" />

        <div className="space-y-1">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
    </div>
  );
};

const ReviewsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-73 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ReviewsSkeleton = memo(() => {
  return (
    <section>
      <HeaderSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 bg-[#F3F8FA] rounded-lg p-4">
        <AvgRatingSkeleton />
        <ReviewsGridSkeleton />
      </div>
    </section>
  );
});