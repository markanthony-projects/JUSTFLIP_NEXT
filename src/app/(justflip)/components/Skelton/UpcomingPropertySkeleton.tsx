import { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

// eslint-disable-next-line react/display-name
export const UpcomingPropertySkeleton = memo(
  function UpcomingPropertySkeleton() {
    return (
        <article className="group relative flex w-87.5 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white">

            <div className="relative h-54 w-full overflow-hidden bg-gray-100">
                <SkeletonBlock className="h-full w-full rounded-none" />
                <div className="absolute left-0 top-4">
                    <SkeletonBlock className="h-7 w-28 rounded-r-md" />
                </div>

                <div className="absolute right-4 top-4">
                    <SkeletonBlock className="h-9 w-9 rounded-full" />
                </div>

                <div className="absolute bottom-3 left-0">
                    <SkeletonBlock className="h-7 w-32 rounded-r-lg" />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-3">

                <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <SkeletonBlock className="h-5 w-40 rounded-md" />
                        <SkeletonBlock className="hidden sm:block h-4 w-20 rounded" />
                        <SkeletonBlock className="block sm:hidden h-5 w-10 rounded" />
                    </div>
                    <SkeletonBlock className="mt-2 h-3 w-28 rounded" />
                </div>

                <div className="flex flex-col gap-2 border-y border-slate-200 py-4">

                    <div className="flex items-center gap-2">
                        <SkeletonBlock className="h-5 w-5 rounded" />
                        <SkeletonBlock className="h-4 w-48 rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                        <SkeletonBlock className="h-5 w-5 rounded" />
                        <SkeletonBlock className="h-4 w-44 rounded" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <SkeletonBlock className="h-7 w-20 rounded-lg" />
                        <SkeletonBlock className="h-1.5 w-1.5 rounded-full" />
                        <SkeletonBlock className="h-7 w-20 rounded-lg" />
                        <SkeletonBlock className="h-1.5 w-1.5 rounded-full" />
                        <SkeletonBlock className="h-7 w-20 rounded-lg" />
                    </div>

                </div>

            <div className="mt-auto flex items-end justify-between gap-4 pt-2">
                <div className="flex flex-col">
                    <SkeletonBlock className="h-3 w-20 rounded" />
                    <SkeletonBlock className="mt-1.5 h-5 w-24 rounded-md" />
                    <SkeletonBlock className="mt-1.5 h-3 w-28 rounded" />
                </div>
                <SkeletonBlock className="h-9 w-28 rounded-lg" />
            </div>

            </div>
        </article>
    );
  }
);



export const UpcomingPropertySkeletonList = memo(
  function UpcomingPropertySkeletonList({
    count = 4,
  }: {
    count?: number;
  }) {
    return (
        <div className="flex overflow-x-auto scrollbar-hidden">
            <div className="flex shrink-0 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <UpcomingPropertySkeleton key={index} />
            ))}
            </div>
        </div>
    );
  }
);