import BlogService from '@/src/services/Blog.Service';
import React from 'react'
import BlogsClient from './BlogsClient';

export default async function Blogs({ tag }) {
    let page = 1
    let limit = 20
    const { blogs } = await BlogService.fetchBlogs({ page, limit });
    return (
        <div className=''>
            <BlogsClient tag={tag} initialBlogs={blogs} />
        </div>
    )
}
