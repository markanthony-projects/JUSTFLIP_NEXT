"use client";
import { SkeletonBlock } from "./SkeletonSection";

export default function DescriptionSkeleton() {
    return (
        <div className="w-full py-2 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 h-auto md:h-[75px]">
                    <div className="relative  h-[75px] rounded overflow-hidden">
                        <SkeletonBlock className="w-[88px] h-full rounded" />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <SkeletonBlock className="h-4 w-[180px]" />
                        <SkeletonBlock className="h-3 w-[140px]" />
                        <SkeletonBlock className="h-6 w-[120px] rounded-md" />
                    </div>
                </div>

                <div className="hidden md:flex justify-end items-end">
                    <div className="flex border border-gray-300 rounded-md divide-x divide-gray-300 overflow-hidden">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="px-[17px] py-2 flex items-center gap-2">
                                <SkeletonBlock className="h-4 w-4 rounded-sm" />
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}