import Breadcrumb from '@/src/components/organisms/breadCrumb';
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

export async function generateMetadata(props: BlogsPageProps): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const category = (searchParams?.category as string) || "Trending Blog";
    const title = `${category} - Real Estate News, Market Trends & Guides | JustFlip`;
    const description = `Read the latest ${category.toLowerCase()} about real estate in India and Dubai. Discover top market trends, property buying guides, and expert investment tips on JustFlip.`;
    const url = `/blogs${category !== "Trending Blog" ? `?category=${category}` : ''}`;

    return constructMetadata({
        title,
        description,
        canonical: url
    });
}

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <Blogssection initialBlogs={initialBlogData?.blogs || []} initialCategory={category} />
                </div>
            </div>
        </div>
    )
}

export default Blogs