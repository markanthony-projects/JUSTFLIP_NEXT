import { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

// eslint-disable-next-line react/display-name
export const UpcomingPropertySkeleton = memo(() => {
  return (
    <article className="group relative flex sm:w-87.5 w-[calc(100vw-100px)] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white">
      
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
        <div className="absolute right-4 top-4">
          <SkeletonBlock className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-3 border border-gray-200">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            {/* Project Title */}
            <SkeletonBlock className="h-5 w-3/5 rounded-md" />

            {/* Map Link */}
            <SkeletonBlock className="h-4 w-20 rounded" />
          </div>

          {/* Builder Name */}
          <SkeletonBlock className="mt-1.5 h-3 w-28 rounded" />
        </div>

        {/* ================= DETAILS ================= */}
        <div className="flex flex-col gap-1 border-t border-slate-200 pt-3">
          
          {/* Configuration */}
          <div className="flex items-center gap-1.5">
            <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
            <SkeletonBlock className="h-3.5 w-3/4 rounded" />
          </div>

          {/* Possession Date */}
          <div className="flex items-center gap-1.5 mt-1">
            <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
            <SkeletonBlock className="h-3.5 w-1/2 rounded" />
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <SkeletonBlock className="h-6 w-16 rounded-lg" />
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <SkeletonBlock className="h-6 w-16 rounded-lg" />
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <SkeletonBlock className="h-6 w-16 rounded-lg" />
          </div>

        </div>

        {/* ================= PRICE & FOOTER ================= */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-end justify-between gap-4">

            {/* Price Info */}
            <div className="min-w-0 flex-1">
              {/* "Starting from" label */}
              <SkeletonBlock className="h-2.5 w-20 rounded" />

              {/* Main price */}
              <SkeletonBlock className="mt-1 h-5 w-28 rounded-md" />

              {/* Price per sqft */}
              <SkeletonBlock className="mt-1 h-2.5 w-24 rounded" />
            </div>

            {/* View Details Button */}
            <SkeletonBlock className="h-8 w-28 rounded-lg shrink-0" />

          </div>
        </div>

      </div>
    </article>
  );
});

// ================= LIST SKELETON =================

// eslint-disable-next-line react/display-name
export const UpcomingPropertySkeletonList = memo(
  ({ count = 4 }: { count?: number }) => {
    return (
      <div className="flex overflow-x-auto scrollbar-hidden">
        <div className="flex gap-4 shrink-0">
          {Array.from({ length: count }).map((_, index) => (
            <UpcomingPropertySkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
);