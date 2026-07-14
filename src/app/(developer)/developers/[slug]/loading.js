"use client";

import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

export default function Loading() {
  return (
    <div className="">
      <div className="w-full h-screen relative overflow-hidden bg-gray-900 flex-1 px-2 md:px-4 py-1  ">

        <SkeletonBlock className="absolute inset-0 w-full h-full rounded-none opacity-30" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent" />

        <div className="absolute top-0 left-0 w-full z-20 px-4 py-4 flex items-center gap-2">
          <SkeletonBlock className="h-3 w-20 rounded-md opacity-40" />
          <SkeletonBlock className="h-3 w-3 rounded-full opacity-40" />
          <SkeletonBlock className="h-3 w-36 rounded-md opacity-40" />
        </div>

        <div className="absolute bottom-28 md:bottom-20 w-full">
          <div className="flex-1 px-4 md:px-8 py-1 w-full mx-auto md:max-w-[1440px]">

            <SkeletonBlock className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg opacity-40" />

            <div className="mt-4 flex items-center gap-3">
              <SkeletonBlock className="h-7 md:h-9 w-64 md:w-96 rounded-lg opacity-40" />
              <SkeletonBlock className="h-4 w-16 rounded-md opacity-30 hidden md:block" />
            </div>

            <div className="mt-3 flex flex-col gap-2 max-w-2xl">
              <SkeletonBlock className="h-3 w-full rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[95%] rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[90%] rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[85%] rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[80%] rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[75%] rounded-md opacity-30" />
              <SkeletonBlock className="h-3 w-[70%] rounded-md opacity-30" />
            </div>
            <SkeletonBlock className="mt-3 h-4 w-20 rounded-md opacity-40" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-2 md:px-4 py-4 w-full mx-auto md:max-w-[1440px]">
        <section>
          <SkeletonBlock className="h-6 w-28 rounded-md mb-3" />
          <div className="mt-1 border-b border-gray-200 mb-4" />
          <div className="border border-gray-200 p-1 rounded-lg overflow-hidden shadow-sm">
            <SkeletonBlock className="w-full h-[340px] md:h-[420px] rounded-md" />
          </div>
        </section>
      </div>
    </div>
  );
}
