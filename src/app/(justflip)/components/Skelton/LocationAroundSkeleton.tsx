"use client";
import React, { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";


const TabSkeleton = () => {
  return (
    <div className="px-4 py-2 w-full flex items-center justify-center gap-2 border border-gray-300">
      <SkeletonBlock className="w-5 h-5 rounded-md" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  );
};


const ListItemSkeleton = () => {
  return (
    <li className="flex items-center py-1">
      <SkeletonBlock className="w-5 h-5 rounded-full" />
      <SkeletonBlock className="h-3 w-32 ml-2" />
    </li>
  );
};


const CategorySkeleton = () => {
  return (
    <ul className="ml-4 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </ul>
  );
};


const LocationAroundSkeleton = () => {
  return (
    <div>
      <SkeletonBlock className="h-5 w-40 mb-4" />

      <div
        className="border border-gray-300 rounded-lg overflow-hidden"
        role="status"
        aria-busy="true"
      >
        <div className="flex overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <TabSkeleton key={i} />
          ))}
        </div>

        <div className="p-4 min-h-[120px]">
          <div className="grid md:grid-cols-2 gap-3">
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LocationAroundSkeleton);