"use client";

import { SkeletonBlock } from "./SkeletonSection";

export default function CallbackFormSkeleton() {
  return (
    <div
      className="bg-white rounded-xl p-4 md:p-6 lg:p-8 animate-pulse"
      style={{ boxShadow: "0px 0px 10px 1px #dad6d6" }}
    >

      <div className="text-center space-y-2 mb-4">
        <SkeletonBlock className="h-4 w-48 mx-auto" />
        <SkeletonBlock className="h-3 w-40 mx-auto" />
      </div>

     
      <div className="space-y-3">

    
        <div className="relative">
          <SkeletonBlock className="h-10 w-full rounded" />
        </div>

       
        <div className="relative">
          <SkeletonBlock className="h-10 w-full rounded" />
        </div>

    
        <div className="relative">
          <SkeletonBlock className="h-10 w-full rounded" />
        </div>

     
        <div className="text-center">
          <SkeletonBlock className="h-3 w-64 mx-auto" />
        </div>

        <SkeletonBlock className="h-10 w-full rounded-lg" />
      </div>

      <div className="flex items-center my-4 gap-2">
        <div className="flex-1 h-[1px] bg-gray-200" />
        <SkeletonBlock className="h-3 w-6" />
        <div className="flex-1 h-[1px] bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-10 w-full rounded-lg" />
        <SkeletonBlock className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}