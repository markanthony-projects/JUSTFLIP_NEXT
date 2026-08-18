import React from 'react'
import BlogDetailsClientSkelton from '../../components/Skelton/BlogDetailsClientSkelton'
import { SkeletonBlock } from '../../components/Skelton/SkeletonSection'

function loading() {
    return (
        <div className='space-y-2'>
            <div className="py-4 px-4 md:px-0">
                <SkeletonBlock className="h-4 w-40 bg-gray-200 rounded" />
            </div>
            <BlogDetailsClientSkelton />
        </div>
    )
}

export default loading