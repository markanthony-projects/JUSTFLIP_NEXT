import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const TabSkeleton = () => {
  return (
    <div className="flex-1 px-2 py-2 border border-gray-300 rounded-xl min-w-40 flex gap-3 items-center">
      <SkeletonBlock className="w-10 h-10 rounded-md" />

      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-3 w-20" />
      </div>
    </div>
  );
};

const PropertyItemSkeleton = () => {
  return (
    <div className="p-2 flex items-center gap-3 w-[320px]">
      {/* Image */}
      <SkeletonBlock className="w-16 h-16 rounded-full" />

      {/* Text */}
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="h-3 w-28" />
      </div>
    </div>
  );
};

const CarouselSkeleton1 = ({ count = 3 }) => {
  return (
    <div className="flex  gap-4 overflow-x-auto scrollbar-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <PropertyItemSkeleton />
          <PropertyItemSkeleton />
          <PropertyItemSkeleton />
        </div>

      ))}
    </div>
  );
};

export const PropertySupplySkeleton = memo(() => {
  return (
    <div className="bg-[#F3F8FA] rounded-md p-4">
      <SkeletonBlock className="h-5 w-56 mb-4" />

      <div className="flex gap-3 overflow-x-auto h-[74px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <TabSkeleton key={i} />
        ))}
      </div>

      <div className="my-4">
        <SkeletonBlock className="h-[1px] w-full" />
      </div>

      <CarouselSkeleton1 />
    </div>
  );
});