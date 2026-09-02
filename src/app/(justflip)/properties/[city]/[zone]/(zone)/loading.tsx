import React from 'react';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';
import { SkeletonBlock } from '@/src/app/(justflip)/components/Skelton/SkeletonSection';
import { HighlightSkeleton } from "@/src/app/(justflip)/components/Skelton/HighlightSkeleton";
import { TopBuildersSkeleton } from "@/src/app/(justflip)/components/Skelton/TopBuildersSkeleton";
import { PropertySupplySkeleton } from "@/src/app/(justflip)/components/Skelton/PropertySupplySkeleton";
import { ReviewsSkeleton } from "@/src/app/(justflip)/components/Skelton/ReviewsSkeleton";
import { BlogsSkeleton } from "@/src/app/(justflip)/components/Skelton/BlogsSkelton";
import { GallerySkeleton } from "@/src/app/(justflip)/components/Skelton/GallerySkeleton";
import { FAQSkeleton } from "@/src/app/(justflip)/components/Skelton/FAQSkeleton";
import { RatingCardSkeleton } from "@/src/app/(justflip)/components/Skelton/RatingCardSkeleton";
import { TopPropertySkeleton } from "@/src/app/(justflip)/components/Skelton/TopPropertySkeleton";

export default function Loading() {
    return (
        <>
            <ScrollToTop />
            <div className="">
                {/* Breadcrumb Skeleton */}
                <div className="py-2 text-sm w-full overflow-hidden">
                    <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-sm my-1"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4 gap-6 mx-auto">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                        
                        {/* HeaderTop Skeleton */}
                        <div>
                            <div className="grid grid-flow-col justify-between items-end relative space-y-2">
                                <div className="p-1">
                                    <SkeletonBlock className="h-[36px] w-64" />
                                </div>
                                <div className="relative w-[180px] h-[60px] md:w-[300px] md:h-[100px]">
                                    <SkeletonBlock className="w-full h-full rounded-md" />
                                </div>
                            </div>
                            <div className="border-b-[0.7px] border-[#696A6C] block relative mt-2">
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-[#696A6C] rounded-full"></div>
                            </div>
                            <div className="my-2 py-4 md:py-8 min-h-25">
                                <SkeletonBlock className="h-25 w-full" />
                            </div>
                        </div>

                        <div className="block lg:hidden">
                            <TopPropertySkeleton />
                            <RatingCardSkeleton />
                        </div>

                        <HighlightSkeleton />
                        <TopBuildersSkeleton />
                        <PropertySupplySkeleton />
                        <ReviewsSkeleton />
                        <GallerySkeleton />
                        <BlogsSkeleton />
                        <FAQSkeleton />

                    </div>

                    <div className="sticky top-28 self-start lg:col-span-2 xl:col-span-1 hidden lg:flex lg:flex-col lg:gap-2">
                        <RatingCardSkeleton />
                        <TopPropertySkeleton />
                    </div>
                </div>
            </div>
        </>
    );
}
