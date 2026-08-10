"use client";

import { SkeletonBlock } from "./SkeletonSection";


export default function FloatingActionsSkeleton() {
  return (
    <div className="fixed hidden md:flex right-3 top-1/2 -translate-y-1/2 flex-col gap-3 z-20 animate-pulse">
      
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-full shadow-md"
        >
          <SkeletonBlock className="h-12 w-12 rounded-full" />
        </div>
      ))}

    </div>
  );
}