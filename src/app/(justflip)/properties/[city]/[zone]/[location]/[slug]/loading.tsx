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

            {/* Description (Header + Image Gallery) Skeleton */}
            <DescriptionSkeleton />

            {/* Additional Sections Loader */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 xl:grid-cols-7 gap-4 lg:gap-6">
                <div className="lg:col-span-4 xl:col-span-5 space-y-4 md:space-y-6">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <ProjectOverviewSkeleton />
                    </div>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
                        <UnitTableSkeleton />
                    </div>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
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
