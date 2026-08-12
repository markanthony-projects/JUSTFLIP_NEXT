import React from 'react'
import { SkeletonBlock } from './SkeletonSection'

function BlogCarouselSkeleton() {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl my-6 shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden bg-gray-100">
                <SkeletonBlock className="absolute inset-0 w-full h-full bg-gray-200" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/30 to-transparent flex flex-col justify-end p-6 md:p-12 pb-16 md:pb-20 gap-4">
                    <SkeletonBlock className="h-8 md:h-12 w-3/4 rounded-lg bg-gray-300" />
                    <SkeletonBlock className="h-4 md:h-5 w-full rounded bg-gray-300" />
                    <SkeletonBlock className="h-4 md:h-5 w-5/6 rounded bg-gray-300" />
                </div>
            </div>

            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                <SkeletonBlock className="h-1.5 w-8 rounded-full bg-gray-300" />
                <SkeletonBlock className="h-1.5 w-2 rounded-full bg-gray-300" />
                <SkeletonBlock className="h-1.5 w-2 rounded-full bg-gray-300" />
                <SkeletonBlock className="h-1.5 w-2 rounded-full bg-gray-300" />
            </div>
        </div>
    )
}

export default BlogCarouselSkeleton;