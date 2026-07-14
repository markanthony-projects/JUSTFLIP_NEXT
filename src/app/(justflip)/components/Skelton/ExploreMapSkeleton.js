"use client";

import { SkeletonBlock } from "./SkeletonSection";

function TabSkeleton() {
  return (
    <div className="flex border-b border-gray-200">
      {["w-20", "w-24", "w-20"].map((w, i) => (
        <div key={i} className="px-4 py-2">
          <SkeletonBlock className={`h-4 ${w}`} />
        </div>
      ))}
    </div>
  );
}

export function AccordionItemSkeleton() {
  return (
    <div className="border-b border-gray-300 py-3 space-y-2">
      
      {/* Title row */}
      <div className="flex items-center gap-1">
        <SkeletonBlock className="h-2 w-4 rounded-sm" />
        <SkeletonBlock className="h-3 w-32" />
      </div>

     
    </div>
  );
}

export default function ExploreMapSkeleton() {
  return (
    <section className="m-2 space-y-3 animate-pulse">
      
      {/* Location text */}
      <SkeletonBlock className="h-3 w-[220px]" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* MAP SECTION */}
        <div className="lg:col-span-3 space-y-2">
          
          {/* Map placeholder */}
          <SkeletonBlock className="w-full min-h-[280px] md:min-h-[400px] rounded" />

          {/* Map footer */}
          <div className="flex justify-between items-center gap-2">
            <SkeletonBlock className="h-3 w-[120px]" />

            <div className="flex gap-2">
              <SkeletonBlock className="h-8 w-16 rounded-md" />
              <SkeletonBlock className="h-8 w-16 rounded-md" />
              <SkeletonBlock className="h-8 w-20 rounded-md" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 space-y-2">
          
          {/* Tabs */}
          <TabSkeleton />

          {/* Accordion */}
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <AccordionItemSkeleton key={i} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}