"use client";
import React, { memo } from "react";
import { SkeletonBlock } from "./SkeletonSection";

const CategorySkeleton = () => {
    return (
        <div className="px-3 py-2 min-w-[160px] rounded-full border border-gray-300 flex items-center gap-2 justify-center">
            <SkeletonBlock className="w-4 h-4 rounded-full" />
            <SkeletonBlock className="h-3 w-20" />
        </div>
    );
};

const MapFilterSkeleton = () => {
    return (
        <div className="w-full">
            <SkeletonBlock className="h-5 w-48 mb-3" />

            <div
                className="relative rounded-lg overflow-hidden border border-gray-300 shadow"
                role="status"
                aria-busy="true"
            >
                <SkeletonBlock className="w-full h-[450px]" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <SkeletonBlock className="w-44 h-11 rounded-full" />
                </div>
            </div>

            <div className="flex overflow-x-auto py-4">
                <div className="grid grid-flow-col grid-rows-2 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CategorySkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(MapFilterSkeleton);