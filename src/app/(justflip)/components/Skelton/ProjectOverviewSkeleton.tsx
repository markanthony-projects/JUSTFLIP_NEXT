"use client";

import { SkeletonBlock } from "./SkeletonSection";

function OverviewItemSkeleton() {
    return (
        <div className="flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-lg bg-white border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <SkeletonBlock className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                <SkeletonBlock className="h-3 w-16 sm:w-20 rounded" />
                <SkeletonBlock className="h-4 sm:h-5 w-24 sm:w-28 rounded" />
            </div>
        </div>
    );
}

export default function ProjectOverviewSkeleton() {
    return (
        <section className="animate-pulse">
            <div className="mb-4 sm:mb-5">
                <SkeletonBlock className="h-6 sm:h-7 w-40 sm:w-48 rounded" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <OverviewItemSkeleton key={index} />
                ))}
            </div>
        </section>
    );
}