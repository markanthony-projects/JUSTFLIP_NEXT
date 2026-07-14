import { memo } from "react";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { SkeletonBlock } from "./SkeletonSection";

export const TopPropertySkeleton = memo(() => {
  return (
    <section
      className="lg:border border-gray-300 rounded-xl lg:p-4 bg-white w-full"
      aria-label="Top Properties"
      role="status"
      aria-busy="true"
    >
      <SkeletonBlock className="h-5 w-40" />
      <div className="w-full lg:w-[260px] mx-auto overflow-x-auto scrollbar-hidden">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <PropertyCardSkeleton />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
});