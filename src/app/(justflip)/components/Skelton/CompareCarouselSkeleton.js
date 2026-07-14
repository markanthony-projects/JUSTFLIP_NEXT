"use client";

import { SkeletonBlock } from "./SkeletonSection";


function CompareCardSkeleton() {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full rounded-2xl border border-gray-300 overflow-hidden">

        {/* IMAGE AREA */}
        <div className="h-[260px] w-full relative">

          {/* Image */}
          <SkeletonBlock className="w-full h-full rounded-2xl" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 inset-0 flex flex-col justify-end p-4">

            {/* Title */}
            <SkeletonBlock className="h-4 w-40 mb-2" />

            {/* Location */}
            <SkeletonBlock className="h-3 w-28 mb-2" />

            {/* Price */}
            <SkeletonBlock className="h-4 w-32 mb-3" />

            {/* Button */}
            <SkeletonBlock className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompareCarouselSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      {/* Fake carousel track */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="min-w-[320px] w-[320px] shrink-0">
            <CompareCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}