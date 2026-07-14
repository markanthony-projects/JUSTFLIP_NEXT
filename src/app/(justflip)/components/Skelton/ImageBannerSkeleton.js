"use client";

import { SkeletonBlock } from "./SkeletonSection";

function OverlaySkeleton() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <SkeletonBlock className="h-3 w-12" />
                <SkeletonBlock className="h-3 w-6" />
                <SkeletonBlock className="h-4 w-4 rounded-sm" />
            </div>
        </div>
    );
}

export default function ImageBannerSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full relative animate-pulse">
            <div className="w-full h-44 md:h-[388px] lg:h-[456px] rounded overflow-hidden">
                <SkeletonBlock className="w-full h-full rounded" />
            </div>
            <div className="absolute inset-0 md:hidden flex items-center justify-center">
                <SkeletonBlock className="h-4 w-40" />
            </div>

            <div className="hidden md:grid grid-cols-2 gap-1">
                <div className="rounded overflow-hidden">
                    <SkeletonBlock className="w-full h-full" />
                </div>
                <div className="rounded overflow-hidden">
                    <SkeletonBlock className="w-full h-full" />
                </div>
                <div className="relative rounded overflow-hidden">
                    <SkeletonBlock className="w-full h-full" />
                    <OverlaySkeleton />
                </div>
                <div className="relative rounded overflow-hidden">
                    <SkeletonBlock className="w-full h-full" />
                    <OverlaySkeleton />
                </div>
            </div>
        </div>
    );
}