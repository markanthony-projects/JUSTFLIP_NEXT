import { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

// eslint-disable-next-line react/display-name
export const NewLaunhesPropertySkeleton = memo(() => {
  return (
    <article className="group relative flex w-87.5 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white">
      
      {/* ================= BANNER IMAGE ================= */}
      <div className="relative h-44 sm:h-48 md:h-54 w-full overflow-hidden bg-gray-100">
        <SkeletonBlock className="w-full h-full rounded-none" />

        {/* RERA Badge Skeleton */}
        <div className="absolute left-0 top-4">
          <SkeletonBlock className="h-7 w-24 rounded-r-lg" />
        </div>

        {/* Favourite Button Skeleton */}
        <div className="absolute right-4 top-4">
          <SkeletonBlock className="h-9 w-9 rounded-full" />
        </div>

        {/* Location Tag Skeleton */}
        <div className="absolute bottom-3 left-0">
          <SkeletonBlock className="h-7 w-28 rounded-r-lg" />
        </div>

        {/* Booking Countdown Skeleton */}
        <div className="absolute bottom-3 right-0">
          <SkeletonBlock className="h-7 w-32 rounded-l-lg" />
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="px-5 py-3 border border-gray-200 border-t-0">
        
        {/* Title and See in Map */}
        <div className="flex items-start justify-between gap-4">
          {/* Project Name Skeleton */}
          <SkeletonBlock className="h-5 w-3/5 rounded-md" />

          {/* Map Link Skeleton */}
          <SkeletonBlock className="h-4 w-20 rounded shrink-0" />
        </div>

        {/* Builder Name & Configurations */}
        <div className="mt-2 flex flex-col gap-1.5">
          {/* Builder Name */}
          <SkeletonBlock className="h-3 w-28 rounded" />
          
          {/* Configurations / Summary */}
          <SkeletonBlock className="h-2.5 w-4/5 rounded" />
        </div>

        {/* ================= PRICE & FOOTER ================= */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-end justify-between gap-4">

            {/* Price Info */}
            <div className="min-w-0 flex-1">
              {/* "Launch Price From" Label */}
              <SkeletonBlock className="h-2.5 w-24 rounded" />

              {/* Min Price Value */}
              <SkeletonBlock className="mt-1 h-5 w-28 rounded-md" />

              {/* Price Per Sqft */}
              <SkeletonBlock className="mt-1 h-2.5 w-20 rounded" />
            </div>

            {/* View Details Button Skeleton */}
            <SkeletonBlock className="h-8 w-28 rounded-lg shrink-0" />

          </div>
        </div>

      </div>
    </article>
  );
});

// ================= LIST SKELETON =================

// eslint-disable-next-line react/display-name
export const NewLaunhesPropertySkeletonList = memo(
  ({ count = 4 }: { count?: number }) => {
    return (
      <div className="flex overflow-x-auto scrollbar-hidden">
        <div className="flex gap-4 shrink-0">
          {Array.from({ length: count }).map((_, index) => (
            <NewLaunhesPropertySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
);