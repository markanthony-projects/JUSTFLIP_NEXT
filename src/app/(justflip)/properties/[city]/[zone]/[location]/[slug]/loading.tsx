import React from 'react';
import DescriptionSkeleton from '@/src/app/(justflip)/components/Skelton/DescriptionSkeleton';
import ProjectOverviewSkeleton from '@/src/app/(justflip)/components/Skelton/ProjectOverviewSkeleton';
import UnitTableSkeleton from '@/src/app/(justflip)/components/Skelton/UnitTableSkeleton';
import FeaturesSkeleton from '@/src/app/(justflip)/components/Skelton/FeaturesSkeleton';
import ExploreMapSkeleton from '@/src/app/(justflip)/components/Skelton/ExploreMapSkeleton';
import HighlightProjectSkeleton from '@/src/app/(justflip)/components/Project/HighlightProjectSkeleton';
import { ReviewsSkeleton } from '@/src/app/(justflip)/components/Skelton/ReviewsSkeleton';
import DeveloperLegacySkeleton from '@/src/app/(justflip)/components/Skelton/DeveloperDetailsSkeleton';
import CallbackFormSkeleton from '@/src/app/(justflip)/components/Skelton/CallbackFormSkeleton';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export default function Loading() {
    return (
        <div className="w-full max-w-full overflow-x-hidden px-2 md:px-4 bg-gray-50/50">
            <ScrollToTop />

            {/* Breadcrumb Skeleton */}
            <div className="py-2 text-sm w-full overflow-hidden px-2 md:px-0">
                <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-sm my-1"></div>
            </div>

            {/* Hero / Description Skeleton */}
            <DescriptionSkeleton />

            {/* Nav Tabs Skeleton */}
            <div className="w-full bg-white border border-gray-100 rounded-xl p-2 my-4 flex gap-3 overflow-x-auto">
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
                <div className="h-8 w-28 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-lg shrink-0"></div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-4 xl:col-span-5 space-y-4 md:space-y-6">
                    {/* Project Overview Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <ProjectOverviewSkeleton />
                    </div>

                    {/* Floor Plans / Unit Table Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <UnitTableSkeleton />
                    </div>

                    {/* Features & Amenities Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <FeaturesSkeleton />
                    </div>

                    {/* Explore Map Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <ExploreMapSkeleton />
                    </div>

                    {/* Project Highlights Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <HighlightProjectSkeleton />
                    </div>

                    {/* Reviews Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <ReviewsSkeleton />
                    </div>

                    {/* Developer Legacy Skeleton */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <DeveloperLegacySkeleton />
                    </div>
                </div>

                {/* Right Column: Sticky Sidebar Skeleton */}
                <div className="hidden lg:block lg:col-span-2 xl:col-span-2 space-y-4">
                    <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-xl"></div>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <CallbackFormSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}
