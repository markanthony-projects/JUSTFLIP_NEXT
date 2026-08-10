import React from 'react'
import BlogDetailsClientSkelton from '../../components/blogs/BlogDetailsClientSkelton'
import { SkeletonBlock } from '../../components/Skelton/SkeletonSection'

function loading() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="h-screen lg:col-span-3 flex flex-col relative min-h-screen px-4 md:px-6 lg:px-8 ">
                    <SkeletonBlock className="h-4 w-34 bg-gray-200 rounded" />
                    <BlogDetailsClientSkelton />
                </div>
            </div>
            )
}

            export default loading