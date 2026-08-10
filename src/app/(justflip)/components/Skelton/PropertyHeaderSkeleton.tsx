"use client";

import { SkeletonBlock } from "./SkeletonSection";

export default function PropertyHeaderSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 pt-4 pb-3 animate-pulse">
            <div className="space-y-2">
                <div className="flex items-end gap-2">
                    <SkeletonBlock className="h-4 w-[220px]" />
                    <SkeletonBlock className="h-3 w-16" />
                </div>

                <SkeletonBlock className="h-3 w-[180px]" />
            </div>

            <div className="hidden md:flex items-end justify-end">
                <SkeletonBlock className="h-9 w-[170px] rounded-md" />
            </div>

        </div>
    );
}