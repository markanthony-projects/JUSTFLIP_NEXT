"use client";
import React, { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

const ChartSkeleton = () => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[1px] bg-gray-200 w-full" />
        ))}
      </div>

      <SkeletonBlock className="w-full h-full rounded-lg" />
    </div>
  );
};


const PriceTrendSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-xl">
      
      <SkeletonBlock className="h-5 w-48 mb-3" />

      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-4 w-32" />
        </div>

        <SkeletonBlock className="h-8 w-20 rounded-md" />
      </div>

      <div className="flex flex-col h-[350px] md:h-[400px]">
        <div className="flex-1 min-h-0">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
};

export default memo(PriceTrendSkeleton);