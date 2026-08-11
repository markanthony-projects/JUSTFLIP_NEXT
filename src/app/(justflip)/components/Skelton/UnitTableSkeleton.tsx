"use client";

import { SkeletonBlock } from "./SkeletonSection";

function UnitCardSkeleton() {
    return (
        <div className="border border-slate-200/60 rounded-2xl bg-white shadow-sm flex flex-col h-fit overflow-hidden max-w-[340px] w-full">
            <div className="px-4 pt-4 sm:px-5 sm:pt-5 pb-3 flex flex-col gap-2">
                <SkeletonBlock className="h-5 sm:h-6 w-16 rounded-sm mb-1" />
                <SkeletonBlock className="h-6 sm:h-7 w-32 rounded-sm mb-2" />
                <SkeletonBlock className="h-4 w-24 rounded-sm" />
            </div>
            <div className="border-t border-slate-100 px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <SkeletonBlock className="h-4 w-20 rounded-sm" />
                <SkeletonBlock className="h-3 w-3 rounded-sm" />
            </div>
        </div>
    );
}

export default function UnitTableSkeleton({ rows = 3 }) {
    return (
        <div className="w-full animate-pulse">
            <h2 className="text-sm font-semibold pb-2 pl-2 md:text-lg">
                <SkeletonBlock className="h-5 w-48 rounded-sm" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: rows }).map((_, index) => (
                    <UnitCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}