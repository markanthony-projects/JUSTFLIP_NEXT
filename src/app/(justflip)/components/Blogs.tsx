import BlogService from '@/src/services/Blog.Service';
import React from 'react'
import BlogsClient from './BlogsClient';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export default async function Blogs({ tag }: { tag?: string }) {
    let page = 1
    let limit = 20
    const { blogs } = await BlogService.fetchBlogs({ page, limit });
    return (
        <div className=''>
            <ScrollToTop />
            <BlogsClient tag={tag} initialBlogs={blogs} />
        </div>
    )
}
