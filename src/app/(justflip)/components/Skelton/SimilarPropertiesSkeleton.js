"use client";

import { PropertyCardSkeletonList } from "./PropertyCardSkeleton";
import { SkeletonBlock } from "./SkeletonSection";

export default function SimilarPropertiesSkeleton() {
  return (
    <div>

      {/* Title */}
      <div className="pt-6">
        <SkeletonBlock className="h-5 w-44 px-1 md:px-0 mb-3" />
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
       <PropertyCardSkeletonList />
      </div>

    </div>
  );
}