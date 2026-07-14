"use client";
import React, { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

const AreaCardSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
      <SkeletonBlock className="w-20 h-20 rounded-lg" />
      <div className="flex flex-col flex-grow space-y-2">
        <SkeletonBlock className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="w-3 h-3 rounded-sm" />
            ))}
          </div>
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
      <SkeletonBlock className="w-5 h-5 rounded-full" />
    </div>
  );
};

const AreasNearbySkeleton = () => {
  return (
    <div>
      <SkeletonBlock className="h-5 w-52 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="status" aria-busy="true" >
        {Array.from({ length: 4 }).map((_, i) => (
          <AreaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default memo(AreasNearbySkeleton);