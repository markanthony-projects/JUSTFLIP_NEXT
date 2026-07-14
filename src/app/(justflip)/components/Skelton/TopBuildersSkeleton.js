import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const BuilderCardSkeleton = () => {
  return (
    <div className="rounded-lg flex items-center p-2 border border-gray-200 gap-4 w-70">
      {/* Logo */}
      <SkeletonBlock className="h-20 w-20 rounded-xl" />

      {/* Text */}
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    </div>
  );
};

const CarouselSkeleton = ({ count = 3 }) => {
  return (
    <div className="flex overflow-x-auto scrollbar-hidden gap-4 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <BuilderCardSkeleton />
          <BuilderCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export const TopBuildersSkeleton = memo(() => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="h-4 w-20" />
      </div>

      {/* Carousel */}
      <CarouselSkeleton />
    </div>
  );
});