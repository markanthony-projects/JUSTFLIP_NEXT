import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const GridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className="w-full h-28 md:h-44 rounded-lg"
        />
      ))}
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const GallerySkeleton = memo(() => {
  return (
    <section className="relative py-2">
      <SkeletonBlock className="h-5 w-40 mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <SkeletonBlock className="w-full h-44 md:h-full rounded-lg" />
        <div className="relative">
          <GridSkeleton />
          <div className="absolute bottom-2 right-2">
            <SkeletonBlock className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
});