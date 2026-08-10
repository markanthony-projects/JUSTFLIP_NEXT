import React from 'react'
import { SkeletonBlock } from '../Skelton/SkeletonSection'

function BlogCarouselSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 my-6 animate-pulse">
            <SkeletonBlock className="h-72 bg-gray-200 rounded-xl" />
        </div>
    )
}

export default BlogCarouselSkeleton;