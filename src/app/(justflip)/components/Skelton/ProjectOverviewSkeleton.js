"use client";

import { SkeletonBlock } from "./SkeletonSection";

function OverviewItemSkeleton() {
    return (
        <div className="flex items-center gap-3 py-2">
            <SkeletonBlock className="w-8 h-8 rounded-md" />
            <div className="flex flex-col gap-1">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-4 w-32" />
            </div>
        </div>
    );
}

export default function ProjectOverviewSkeleton() {
    return (
        <section className="animate-pulse">
            <div className="p-2">
                <SkeletonBlock className="h-4 w-40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white px-2 rounded-lg">
                {Array.from({ length: 6 }).map((_, index) => (
                    <OverviewItemSkeleton key={index} />
                ))}
            </div>
        </section>
    );
}