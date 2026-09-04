import { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

// eslint-disable-next-line react/display-name
export const FeaturedPropertySkeleton = memo(() => {
  return (
    <article className="group relative w-full min-w-[350px] overflow-hidden rounded-xl bg-white border border-gray-200">
      
      {/* ================= IMAGE ================= */}
      <div className="relative h-54 w-full overflow-hidden bg-gray-100">
        <SkeletonBlock className="w-full h-full rounded-none" />

        {/* Featured badge */}
        <div className="absolute left-4 top-3">
          <SkeletonBlock className="h-6 w-24 rounded-md" />
        </div>

        {/* Favourite button */}
        <div className="absolute right-4 top-3">
          <SkeletonBlock className="h-9 w-9 rounded-full" />
        </div>

        {/* Location */}
        <div className="absolute bottom-3 left-0">
          <SkeletonBlock className="h-7 w-32 rounded-r-lg" />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-5 py-3">

        {/* Title */}
        <SkeletonBlock className="h-5 w-3/4 rounded-md" />

        {/* Description */}
        <div className="mt-2 space-y-1.5">
          <SkeletonBlock className="h-3 w-full rounded" />
          <SkeletonBlock className="h-3 w-2/3 rounded" />
        </div>

        {/* ================= PROPERTY SPECS ================= */}
        <div className="mt-3 grid grid-cols-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">

          {/* Type */}
          <SkeletonPropertySpec />

          {/* Area */}
          <SkeletonPropertySpec />

          {/* Floors */}
          <SkeletonPropertySpec />

          {/* Possession */}
          <SkeletonPropertySpec />

        </div>

        {/* ================= AMENITIES ================= */}
        <div className="mt-3 rounded-lg bg-[#F4F7FA] p-2">
          <div className="flex gap-1">

            <SkeletonAmenity />
            <SkeletonAmenity />
            <SkeletonAmenity />
            <SkeletonAmenity />

          </div>
        </div>

        {/* ================= PRICE ================= */}
        <div className="mt-3 border-t border-gray-200 pt-5">

          <div className="flex items-end justify-between gap-4">

            {/* Price */}
            <div className="min-w-0 flex-1">

              {/* Price ranges */}
              <SkeletonBlock className="h-3 w-20 rounded" />

              {/* Main price */}
              <SkeletonBlock className="mt-2 h-6 w-32 rounded-md" />

              {/* Price per sqft */}
              <SkeletonBlock className="mt-2 h-3 w-24 rounded" />

            </div>

            {/* View Details */}
            <SkeletonBlock className="h-9 w-28 rounded-xl" />

          </div>

        </div>

      </div>
    </article>
  );
});


// ================= PROPERTY SPEC =================

const SkeletonPropertySpec = memo(function SkeletonPropertySpec(){
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-2 py-2 text-center">

      {/* Icon */}
      <SkeletonBlock className="h-[18px] w-[18px] rounded-full" />

      {/* Value */}
      <SkeletonBlock className="mt-1.5 h-3 w-12 rounded" />

      {/* Label */}
      <SkeletonBlock className="mt-1 h-2.5 w-10 rounded" />

    </div>
  );
});


// ================= AMENITY =================

const SkeletonAmenity = memo(function SkeletonAmenity(){
  return (
    <div className="flex h-[52px] w-14 shrink-0 flex-col items-center justify-center rounded-md bg-white px-2 py-2">

      {/* Amenity icon */}
      <SkeletonBlock className="h-4 w-4 rounded" />

      {/* Amenity name */}
      <SkeletonBlock className="mt-1.5 h-2 w-9 rounded" />

    </div>
  );
});


// ================= LIST =================

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