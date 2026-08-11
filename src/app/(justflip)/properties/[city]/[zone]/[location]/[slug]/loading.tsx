import React from 'react';
import DescriptionSkeleton from '@/src/app/(justflip)/components/Skelton/DescriptionSkeleton';
import ProjectOverviewSkeleton from '@/src/app/(justflip)/components/Skelton/ProjectOverviewSkeleton';
import UnitTableSkeleton from '@/src/app/(justflip)/components/Skelton/UnitTableSkeleton';
import FeaturesSkeleton from '@/src/app/(justflip)/components/Skelton/FeaturesSkeleton';
import CallbackFormSkeleton from '@/src/app/(justflip)/components/Skelton/CallbackFormSkeleton';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export default function Loading() {
    return (
        <>
            <ScrollToTop />
            <div className='w-full max-w-full overflow-x-hidden px-2 md:px-4'>
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-1/2 md:w-1/3 bg-gray-200 animate-pulse rounded-sm my-2 mb-3"></div>

            {/* Description (Header + Image Gallery) Skeleton */}
            <DescriptionSkeleton />

            {/* Additional Sections Loader */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-2 lg:gap-4">
                <div className="lg:col-span-4 xl:col-span-5 ">
                    <div className="px-2 md:px-4 py-1 md:py-2 space-y-4 w-full rounded-xl shadow-[0px_0px_10px_1px_#dad6d6]">
                        <ProjectOverviewSkeleton />
                        <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                        <UnitTableSkeleton />
                        <div className="border-[#BABABA] border-b-[0.5px] mx-2" />
                        <FeaturesSkeleton />
                    </div>
                </div>

                {/* Right Column */}
                <div className="hidden lg:flex flex-col lg:col-span-2 xl:col-span-2 gap-4">
                    {/* Placeholder for Static Ad */}
                    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-sm relative">
                        <span className="px-2 py-0.5 bg-black/10 text-xs absolute top-2 left-2 text-white/50 rounded-sm">
                            AD
                        </span>
                    </div>

                    {/* Placeholder for Lead Form / Contact */}
                    <CallbackFormSkeleton />
                </div>
            </div>
        </div>
        </>
    );
}
