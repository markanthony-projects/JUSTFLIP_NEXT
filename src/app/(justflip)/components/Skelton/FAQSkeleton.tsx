import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const FAQItemSkeleton = () => {
  return (
    <div className="border-b border-gray-300 py-4 flex items-center justify-between gap-4">
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-5 w-5 rounded-full" />
    </div>
  );
};

const FAQListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-[8px]">
      {Array.from({ length: count }).map((_, i) => (
        <FAQItemSkeleton key={i} />
      ))}
    </div>
  );
};

export const FAQSkeleton = memo(() => {
  return (
    <div className="bg-[#F3F8FA] rounded-xl my-4">
      <div className="p-4 mx-auto w-full sm:w-4/5 md:w-4/5 lg:w-3/4 xl:w-3/4">
        <section className="py-8">
          <SkeletonBlock className="h-5 w-60 mx-auto mb-6" />
          <FAQListSkeleton />
        </section>
      </div>
    </div>
  );
});