"use client";

import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

export default function Loading() {
  return (
    <div className='bg-[#F4F9FA] min-h-screen pb-20'>
      {/* Hero Section */}
      <div className="w-full h-[60vh] md:h-[70vh] relative flex flex-col justify-end">
        
        {/* Breadcrumb Skeleton */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
            <SkeletonBlock className="h-4 w-16 bg-white/40 rounded animate-pulse" />
            <SkeletonBlock className="h-4 w-4 bg-white/40 rounded animate-pulse" />
            <SkeletonBlock className="h-4 w-24 bg-white/40 rounded animate-pulse" />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {/* Dynamic Background Banner Skeleton */}
          <div className="h-full w-full bg-gradient-to-br from-[#002B5B] to-slate-800 animate-pulse" />
          {/* Rich Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#001f42]/90"></div>
        </div>

        {/* Glassmorphism Info Card */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-10 translate-y-16 md:translate-y-24">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-all duration-500">
            {/* Logo Container */}
            <div className="w-28 h-28 md:w-40 md:h-40 shrink-0 bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transform -translate-y-12 md:-translate-y-16 group">
              <SkeletonBlock className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
            </div>

            {/* Builder Details Skeleton */}
            <div className="flex-1 text-center md:text-left -mt-8 md:mt-0 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
                <SkeletonBlock className="h-10 md:h-12 w-48 md:w-80 rounded-lg bg-white/40 animate-pulse" />
                <SkeletonBlock className="h-7 w-24 rounded-full bg-white/20 animate-pulse" />
              </div>

              <div className="space-y-3 mt-6">
                <SkeletonBlock className="h-4 w-full rounded bg-white/30 animate-pulse" />
                <SkeletonBlock className="h-4 w-[90%] rounded bg-white/30 animate-pulse" />
                <SkeletonBlock className="h-4 w-[75%] rounded bg-white/30 animate-pulse" />
                <SkeletonBlock className="h-4 w-24 rounded mt-4 bg-white/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 space-y-16 md:space-y-24">
        
        {/* Key Employees Skeleton */}
        <section>
          <div className="mb-8 md:mb-12">
            <SkeletonBlock className="h-8 w-40 rounded-lg mb-3 bg-gray-300 animate-pulse" />
            <SkeletonBlock className="h-1 w-16 rounded-full bg-gray-300 animate-pulse" />
          </div>
          <div className="flex gap-4 md:gap-6 overflow-hidden py-4 px-2 -mx-2">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock 
                key={i} 
                className="shrink-0 w-[240px] md:w-[280px] h-[320px] md:h-[380px] rounded-3xl bg-gray-200 animate-pulse" 
              />
            ))}
          </div>
        </section>

        {/* Our Projects (Map) Skeleton */}
        <section>
          <div className="mb-8">
            <SkeletonBlock className="h-8 w-48 rounded-lg mb-3 bg-gray-300 animate-pulse" />
            <SkeletonBlock className="h-1 w-20 rounded-full bg-gray-300 animate-pulse" />
          </div>
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100">
            <SkeletonBlock className="w-full h-[400px] rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </section>

      </div>
    </div>
  );
}
