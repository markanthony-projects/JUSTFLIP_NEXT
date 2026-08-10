"use client";

import { SkeletonBlock } from "../Skelton/SkeletonSection";


function HighlightItemSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center mt-1">
        <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
          <SkeletonBlock className="w-2.5 h-2.5 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <SkeletonBlock className="h-4 w-[140px]" />
        <SkeletonBlock className="h-3 w-[400px]" />
        <SkeletonBlock className="h-3 w-[400px]" />
        <SkeletonBlock className="h-3 w-[200px]" />
      </div>
    </div>
  );
}

export default function HighlightProjectSkeleton() {
  return (
    <section className="pt-4 md:pt-0 animate-pulse">
      <div className="pb-4">
        <SkeletonBlock className="h-5 w-[220px]" />
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
        <div className="bg-gray-200 px-5 py-6 relative">
          <SkeletonBlock className="h-4 w-[180px]" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-white rounded-t-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6 px-2 md:px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <HighlightItemSkeleton key={i} />
          ))}
        </div>

      </div>
    </section>
  );
}