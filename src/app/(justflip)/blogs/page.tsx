import Breadcrumb from '@/src/components/organisms/breadCrumb';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';
import React from 'react'
import Blogssection from '../components/blogs/BlogsSection';
import BlogService from '@/src/services/Blog.Service';
import { constructMetadata } from "@/src/utils/seo";
import { buildItemListSchema } from "@/src/utils/schema";
import { Blog } from "@/src/types";

import type { Metadata } from 'next';

export interface BlogsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = constructMetadata({
    title: "Trending Blog - Real Estate News, Market Trends & Guides | JustFlip",
    description: "Read the latest blogs about real estate in India and Dubai. Discover top market trends, property buying guides, and expert investment tips on JustFlip.",
    canonical: "/blogs"
});

export const revalidate = 3600;

async function Blogs(props: BlogsPageProps) {
    const searchParams = await props.searchParams;
    const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
    const category = (searchParams?.category as string) || "Trending Blog";

    let initialBlogData: { blogs: Blog[] } = { blogs: [] };
    try {
        initialBlogData = await BlogService.fetchBlogs({ page, limit: 20, tag: category });
    } catch (error) {
        console.error("Error fetching blogs for SSR:", error);
    }

    const breadcrumbItems = [{ label: "Blogs" }];

    const itemListSchema = buildItemListSchema(
        initialBlogData?.blogs?.map(blog => ({
            url: blog?.slug ? `https://justflip.in/blog/${blog.slug}` : `https://justflip.in/blogs`
        })) || []
    );

    return (
        <div>
            <ScrollToTop />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <div className="max-w-screen-xl mx-auto w-full">
                <Blogssection initialBlogs={initialBlogData?.blogs || []} initialCategory={category} />
            </div>
        </div>
    )
}

export default Blogs