"use client";

import { SkeletonBlock } from "./SkeletonSection";


function FeatureItemSkeleton() {
  return (
    <div className="p-2 w-full sm:w-1/2 lg:w-1/4 flex items-center gap-2">
      
      <div className="w-6 h-6">
        <SkeletonBlock className="w-full h-full rounded-sm" />
      </div>

      <SkeletonBlock className="h-3 w-[100px]" />

    </div>
  );
}

export default function FeaturesSkeleton() {
  return (
    <section className="animate-pulse">
      
      {/* Title */}
      <div className="m-2">
        <SkeletonBlock className="h-4 w-24" />
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap m-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <FeatureItemSkeleton key={i} />
        ))}
      </div>

      {/* Toggle Button */}
      <div className="ml-4 mt-2">
        <SkeletonBlock className="h-4 w-32" />
      </div>

    </section>
  );
}