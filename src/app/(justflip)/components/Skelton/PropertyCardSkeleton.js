import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

// eslint-disable-next-line react/display-name
export const PropertyCardSkeleton = memo(() => {
  return (
    <div className="relative border border-gray-300 rounded-2xl overflow-hidden bg-white my-4 w-[280px]">

      {/* Image */}
      <div className="w-full h-[10rem] md:h-[10rem] lg:h-[12rem] xl:h-[10rem] relative">
        <SkeletonBlock className="w-full h-full rounded-t-2xl" />

        {/* Location badge */}
        <div className="absolute left-3 top-3">
          <SkeletonBlock className="h-6 w-24 rounded-md" />
        </div>

        {/* Favorite icon */}
        <div className="absolute top-3 right-3">
          <SkeletonBlock className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className=" px-3 py-2 space-y-2">
        <SkeletonBlock className="h-3 w-3/4" />
        <SkeletonBlock className="h-2 w-full" />
        <SkeletonBlock className="h-2 w-1/2" />
      </div>
    </div>
  );
});


// eslint-disable-next-line react/display-name
export const PropertyCardSkeletonList = memo(({ count = 5 }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hidden">
      <div className="flex gap-4 shrink-0">
        {Array.from({ length: count }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>

    </div>
  );
});