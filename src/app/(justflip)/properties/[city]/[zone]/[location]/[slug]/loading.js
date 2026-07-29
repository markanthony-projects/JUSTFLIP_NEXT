import React from 'react';
import PropertyHeaderSkeleton from '@/src/app/(justflip)/components/Skelton/PropertyHeaderSkeleton';
import ProjectOverviewSkeleton from '@/src/app/(justflip)/components/Skelton/ProjectOverviewSkeleton';
import UnitTableSkeleton from '@/src/app/(justflip)/components/Skelton/UnitTableSkeleton';
import FeaturesSkeleton from '@/src/app/(justflip)/components/Skelton/FeaturesSkeleton';

export default function Loading() {
    return (
        <section className='pt-2 sm:pt-4 md:pt-[24px] px-2 sm:px-4 md:px-[24px] lg:px-[60px] pb-4 min-h-screen relative max-w-[1440px] mx-auto'>
            {/* Breadcrumb Skeleton */}
            <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded-md my-4 ml-4"></div>

            {/* Image Banner Skeleton */}
            <div className="h-20 w-full bg-gray-100 animate-pulse mb-4"></div>

            {/* Top Property Header Skeleton */}
            <PropertyHeaderSkeleton />

            {/* Additional Sections Loader */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-2 lg:gap-4 mt-4">
                <div className="lg:col-span-4 xl:col-span-5 ">
                    <div className="px-2 md:px-4 py-1 md:py-2 space-y-4 w-full rounded-xl shadow-[0px_0px_10px_1px_#dad6d6]">
                        <ProjectOverviewSkeleton />
                        <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                        <UnitTableSkeleton />
                        <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                        <FeaturesSkeleton />
                    </div>
                </div>
            </div>
        </section>
    );
}
