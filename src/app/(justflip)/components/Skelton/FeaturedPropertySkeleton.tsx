import { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

// eslint-disable-next-line react/display-name
export const FeaturedPropertySkeleton = memo(() => {
  return (
    <article className="group relative sm:w-87.5 w-[calc(100vw-100px)] overflow-hidden rounded-lg bg-white border border-gray-200">
      
      {/* ================= BANNER IMAGE ================= */}
      <div className="relative sm:h-54 h-48 w-full overflow-hidden bg-gray-100">
        <SkeletonBlock className="w-full h-full rounded-none" />

        {/* RERA Badge */}
        <div className="absolute left-0 top-4">
          <SkeletonBlock className="h-6 w-28 rounded-r-lg" />
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-3 left-0">
          <SkeletonBlock className="h-7 w-28 rounded-r-lg" />
        </div>

        {/* Favourite Button */}
        <div className="absolute right-4 top-3">
          <SkeletonBlock className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-5 py-3 border border-gray-200">

        {/* Title and Map Link */}
        <div className="flex items-start justify-between gap-4">
          <SkeletonBlock className="h-5 w-3/5 rounded-md" />
          <SkeletonBlock className="h-4 w-20 rounded" />
        </div>

        {/* Description / Address */}
        <div className="mt-2 space-y-1">
          <SkeletonBlock className="h-3 w-3/4 rounded" />
          <SkeletonBlock className="h-3 w-1/2 rounded" />
        </div>

        {/* ================= PROPERTY SPECS ================= */}
        <div className="mt-3 grid grid-cols-3 divide-gray-200 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <SkeletonPropertySpec />
          <SkeletonPropertySpec />
          <SkeletonPropertySpec />
          <SkeletonPropertySpec />
          <SkeletonPropertySpec />
          <SkeletonPropertySpec />
        </div>

        {/* ================= PRICE & FOOTER ================= */}
        <div className="mt-3 border-t border-gray-200 pt-5">
          <div className="flex items-end justify-between gap-4">

            {/* Price Details */}
            <div className="min-w-0 flex-1">
              {/* "Price ranges" label */}
              <SkeletonBlock className="h-2.5 w-16 rounded" />

              {/* Main price */}
              <SkeletonBlock className="mt-1.5 h-5 w-28 rounded-md" />

              {/* Price per sqft */}
              <SkeletonBlock className="mt-1.5 h-2.5 w-20 rounded" />
            </div>

            {/* View Details Button */}
            <SkeletonBlock className="h-8 w-28 rounded-lg" />

          </div>
        </div>

      </div>
    </article>
  );
});

// ================= PROPERTY SPEC ITEM =================

const SkeletonPropertySpec = memo(function SkeletonPropertySpec() {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center border-t border-r border-slate-100 px-1.5 py-3 gap-1">
      
      {/* Icon + Label row */}
      <div className="flex items-center gap-1">
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-2.5 w-10 rounded" />
      </div>

      {/* Value */}
      <SkeletonBlock className="mt-1 h-3 w-12 rounded" />

    </div>
  );
});

// ================= LIST SKELETON =================

// eslint-disable-next-line react/display-name
export const FeaturedPropertySkeletonList = memo(
  ({ count = 4 }: { count?: number }) => {
    return (
      <div className="flex overflow-x-auto scrollbar-hidden">
        <div className="flex gap-4 shrink-0">
          {Array.from({ length: count }).map((_, index) => (
            <FeaturedPropertySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
);