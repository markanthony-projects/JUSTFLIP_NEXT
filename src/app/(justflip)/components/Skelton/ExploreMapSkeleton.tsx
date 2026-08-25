"use client";

import { SkeletonBlock } from "./SkeletonSection";

export function AccordionItemSkeleton() {
  return (
    <div className="py-3.5 flex justify-between items-center border-b border-gray-100">
      <SkeletonBlock className="h-4 w-40 rounded-sm" />
      <SkeletonBlock className="h-4 w-16 rounded-sm" />
    </div>
  );
}

export default function ExploreMapSkeleton() {
  return (
    <section className="w-full space-y-4 animate-pulse">
      {/* Header */}
      <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
        <SkeletonBlock className="h-5 w-44 rounded-sm" />
      </div>

      {/* Map Banner Preview */}
      <SkeletonBlock className="w-full h-[180px] sm:h-[210px] rounded-2xl" />

      {/* Pill Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-hidden py-1">
        {["w-24", "w-28", "w-20", "w-24", "w-20", "w-32"].map((w, i) => (
          <SkeletonBlock key={i} className={`h-9 ${w} rounded-xl shrink-0`} />
        ))}
      </div>

      {/* Category Subheading */}
      <SkeletonBlock className="h-4 w-52 rounded-sm mt-3" />

      {/* Place Items */}
      <div className="space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <AccordionItemSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}