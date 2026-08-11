"use client";
import { SkeletonBlock } from "./SkeletonSection";

export default function DescriptionSkeleton() {
    return (
        <div className="flex flex-col-reverse md:flex-col gap-4 mt-2 mb-4 md:mb-8 animate-pulse w-full">
            
            {/* Property info bar */}
            <div className="flex flex-col justify-between md:flex-row md:items-center px-3 py-2 md:p-0 gap-4 md:shadow-none rounded-lg bg-gray-100 md:bg-white">
                
                {/* Mobile-only: map link + RERA */}
                <div className="flex md:hidden items-center justify-between gap-2">
                    <SkeletonBlock className="h-6 w-24 rounded-sm" />
                    <SkeletonBlock className="h-4 w-12 rounded-sm" />
                </div>

                {/* Logo + name + address + builder */}
                <div className="flex gap-2">
                    <div className="hidden md:flex items-center justify-center p-1 w-[75px] h-[75px] border border-gray-100 rounded-sm shadow-lg">
                        <div className="w-full h-full rounded-sm bg-gray-200" />
                    </div>
                    <div className="flex flex-col justify-between gap-1.5 md:gap-0 py-0.5">
                        <SkeletonBlock className="h-6 w-48 md:w-64" />
                        <SkeletonBlock className="h-4 w-56 md:w-80" />
                        <SkeletonBlock className="h-4 w-32 md:w-48" />
                    </div>
                </div>

                {/* Price range */}
                <div className="flex flex-col items-start md:items-end gap-1">
                    <SkeletonBlock className="h-3 w-20" />
                    <SkeletonBlock className="h-6 w-36 md:w-48" />
                    <SkeletonBlock className="h-4 w-28 md:w-36" />
                </div>
            </div>

            {/* Image gallery grid */}
            <div className="flex flex-col md:flex-row gap-2 w-full">
                
                {/* Primary (hero) image */}
                <div className="w-full md:flex-[2] aspect-video bg-gray-200 rounded-sm" />

                {/* Right-hand media strip */}
                <div className="flex flex-row md:flex-col gap-2 w-full md:flex-1 h-[100px] sm:h-[120px] md:h-auto">
                    <div className="flex-1 bg-gray-200 rounded-sm" />
                    <div className="flex-1 bg-gray-200 rounded-sm" />
                </div>
            </div>
        </div>
    );
}