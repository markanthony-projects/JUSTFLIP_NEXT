import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const BulletSkeleton = memo(() => {
  return (
    <div className="my-4 flex gap-3 items-start">
      <SkeletonBlock className="w-8 h-8 rounded-full" />

      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-full" />
      </div>
    </div>
  );
});

const SectionSkeleton = ({ count = 4 }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 ">
        <SkeletonBlock className="w-6 h-6 rounded-full" />
        <SkeletonBlock className="h-4 w-40" />
      </div>

      <div className="border-b border-gray-200 my-4" />

      {/* List */}
      {Array.from({ length: count }).map((_, i) => (
        <BulletSkeleton key={i} />
      ))}
    </div>
  );
};

export const HighlightSkeleton = memo(() => {
  return (
    <section className="w-full">
      {/* Title */}
      <SkeletonBlock className="h-5 w-64 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 md:p-6 border border-gray-200 rounded-xl min-h-[200px]">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </section>
  );
});