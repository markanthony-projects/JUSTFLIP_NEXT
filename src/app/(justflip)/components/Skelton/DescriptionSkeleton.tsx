"use client";
import { SkeletonBlock } from "./SkeletonSection";

export default function DescriptionSkeleton() {
    return (
        <div className="flex flex-col-reverse md:flex-col gap-4 mt-2 mb-6 animate-pulse w-full">
            {/* Property info bar (Desktop: Top, Mobile: Below Images) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-gray-100/90 pb-4">
                {/* Logo + name + address + builder */}
                <div className="flex items-start md:items-center gap-3.5">
                    <div className="hidden md:block w-16 h-16 rounded-lg bg-gray-200 shrink-0 border border-gray-100" />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                            <SkeletonBlock className="h-7 w-48 sm:w-64 md:w-80 rounded-lg" />
                            <SkeletonBlock className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <SkeletonBlock className="h-4 w-36 sm:w-48 rounded-md" />
                            <SkeletonBlock className="h-5 w-24 rounded-full" />
                        </div>
                        <SkeletonBlock className="h-4 w-28 sm:w-36 rounded-md" />
                    </div>
                </div>

                {/* Price range */}
                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <SkeletonBlock className="h-3 w-20 rounded" />
                    <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-2">
                        <SkeletonBlock className="h-7 w-40 md:w-48 rounded-lg" />
                        <SkeletonBlock className="h-5 w-28 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Image gallery grid */}
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 w-full h-auto md:h-[540px] lg:h-[580px]">
                {/* Hero placeholder */}
                <div className="w-full md:flex-[3.2] aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-full bg-gray-200 rounded-lg" />

                {/* Side strip */}
                <div className="flex flex-row md:flex-col gap-2 md:gap-2.5 w-full md:flex-1 h-[125px] sm:h-[145px] md:h-full">
                    <div className="flex-1 bg-gray-200 rounded-lg" />
                    <div className="flex-1 bg-gray-200 rounded-lg" />
                    <div className="flex-1 bg-gray-200 rounded-lg hidden md:block" />
                </div>
            </div>
        </div>
    );
}