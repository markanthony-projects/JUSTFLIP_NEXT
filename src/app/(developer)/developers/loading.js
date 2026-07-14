"use client";

import { SkeletonBlock } from "../../(justflip)/components/Skelton/SkeletonSection";



export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 px-2 md:px-4 py-1  w-full  mx-auto md:max-w-[1440px]">
      <div className="h-screen lg:col-span-3 flex flex-col relative ">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-40 rounded-md" />
            <SkeletonBlock className="h-3 w-52 rounded-md" />
          </div>

          <div className="w-full max-w-sm">
            <SkeletonBlock className="h-10 w-full rounded-full" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1 px-1 py-2">

          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBlock key={i} className="w-full h-[180px] rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t">
          <SkeletonBlock className="h-8 w-32 rounded-md" />
          <SkeletonBlock className="h-8 w-48 rounded-md" />
        </div>
      </div>
    </div>
  );
}