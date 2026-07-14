"use client";

import React from "react";
import { SkeletonBlock } from "../components/Skelton/SkeletonSection";

export default function Loading() {
  return (
    <div className="min-h-screen font-sans pb-20 bg-gray-50/50">
      {/* Breadcrumb Skeleton */}
      <div className="px-4 md:px-8 py-4">
        <SkeletonBlock className="h-4 w-32" />
      </div>

      <div className='py-4 px-4 md:px-8 max-w-7xl mx-auto'>
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <SkeletonBlock className="h-10 w-64 mb-3" />
            <SkeletonBlock className="h-5 w-96" />
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* Features Column Skeleton (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col lg:col-span-2 pt-[280px] space-y-6 bg-transparent pr-4">
             <SkeletonBlock className="h-6 w-20 my-4" />
             <SkeletonBlock className="h-6 w-24 my-4" />
             <SkeletonBlock className="h-6 w-28 my-4" />
             <SkeletonBlock className="h-6 w-24 my-4" />
             <div className="flex-1 min-h-[140px] pt-4">
                <SkeletonBlock className="h-6 w-24" />
             </div>
             <SkeletonBlock className="h-6 w-20 my-4" />
          </div>

          {/* Property Cards Skeleton Container */}
          <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {/* Image Skeleton */}
                <SkeletonBlock className="h-64 w-full rounded-none" />
                
                {/* Quick Stats Skeleton */}
                <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-2 bg-[#f8fbfe]">
                  <SkeletonBlock className="h-8 w-20 rounded-xl" />
                  <SkeletonBlock className="h-8 w-24 rounded-xl" />
                  <SkeletonBlock className="h-8 w-20 rounded-xl" />
                </div>

                {/* Detailed Stats Skeleton */}
                <div className="flex-1 p-5 space-y-6">
                  {/* Location */}
                  <div className="lg:h-14 flex items-center gap-3">
                    <SkeletonBlock className="h-8 w-8 rounded-full shrink-0" />
                    <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="h-3 w-40" />
                    </div>
                  </div>

                  {/* Builder */}
                  <div className="lg:h-14 border-t border-gray-50 pt-5 lg:pt-0 lg:border-none flex items-center gap-3">
                    <SkeletonBlock className="h-8 w-8 rounded-full shrink-0" />
                    <SkeletonBlock className="h-4 w-28" />
                  </div>

                  {/* Unit Types */}
                  <div className="lg:h-14 border-t border-gray-50 pt-5 lg:pt-0 lg:border-none flex flex-col gap-2">
                    <SkeletonBlock className="h-8 w-full rounded-lg" />
                    <SkeletonBlock className="h-8 w-full rounded-lg" />
                  </div>

                  {/* Total Units */}
                  <div className="lg:h-14 border-t border-gray-50 pt-5 lg:pt-0 lg:border-none">
                    <SkeletonBlock className="h-10 w-28 rounded-xl" />
                  </div>

                  {/* Amenities */}
                  <div className="lg:min-h-[140px] border-t border-gray-50 pt-5 lg:pt-0 lg:border-none flex flex-wrap gap-2">
                     {[...Array(5)].map((_, j) => (
                         <SkeletonBlock key={j} className="h-8 w-24 rounded-full" />
                     ))}
                  </div>

                  {/* Status */}
                  <div className="lg:h-14 border-t border-gray-50 pt-5 lg:pt-0 lg:border-none">
                     <SkeletonBlock className="h-10 w-36 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}