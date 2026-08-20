import Breadcrumb from '@/src/components/organisms/breadCrumb';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';
import BlogService from '@/src/services/Blog.Service';
import { parseBlogDetailsUrl } from '@/src/utils/url';
import { constructMetadata } from "@/src/utils/seo";
import { buildArticleSchema } from "@/src/utils/schema";
import BlogDetailsClient from '../../components/blogs/BlogDetailsClient';

import type { Metadata } from 'next';

export interface BlogDetailsProps {
  params: Promise<{ slug: string }>;
}

async function getBlogData({ id }: { id: string }) {
  const { blog } = await BlogService.fetchBlogById(id);
  return blog;
}

export async function generateMetadata({ params }: BlogDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const { name, id } = parseBlogDetailsUrl(slug);

  const blog = await getBlogData({ id });

  const title = blog?.title || blog?.heading ? `${blog?.title || blog?.heading} | JustFlip Blogs` : `${name} - Real Estate Blog | JustFlip`;
  const description = blog?.shortDescription || blog?.meta?.description || blog?.subHeading || (blog?.description ? blog.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Read the latest insights on ${name}. Get expert real estate news, market trends, and investment tips on JustFlip Blogs.`);

  return constructMetadata({
    title,
    description,
    canonical: `/blogs/${slug}`,
    image: blog?.image?.url || 'https://justflip.in/logo.png',
    type: 'article'
  });
}

export const revalidate = 3600;

export default async function BlogDetails({ params }: BlogDetailsProps) {
  const { slug } = await params;
  const { name, id } = parseBlogDetailsUrl(slug);

  const blog = await getBlogData({ id });

  if (!blog) {
    return <div className="p-4 text-center">Blog not found</div>;
  }

  const blogTitle = blog?.title || blog?.heading || decodeURIComponent(name);
  const blogDescription = blog?.shortDescription || blog?.meta?.description || blog?.subHeading || blog?.description;
  const coverImage = blog?.image?.url || 'https://justflip.in/logo.png';
  const sectionImages = blog?.sections?.map((s: any) => s.image?.url).filter(Boolean) || [];
  const tag = typeof blog?.tag === 'object' ? blog?.tag?.tag : blog?.tag;

  const articleSchema = buildArticleSchema({
    title: blogTitle,
    url: `/blogs/${slug}`,
    publishDate: blog?.date || blog?.createdAt || blog?.publishedAt,
    updateDate: blog?.updatedAt || blog?.modifiedAt || blog?.date,
    coverImage,
    images: sectionImages,
    shortDescription: blogDescription,
    articleSection: tag || "Real Estate",
    keywords: tag ? [tag, "Real Estate", "JustFlip"] : ["Real Estate", "JustFlip", "Property"],
  });

  return (
    <div className='space-y-2'>
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumb items={[{ label: "Blogs", href: "/blogs" }, { label: blogTitle }]} />
      <BlogDetailsClient initialBlog={blog} />
    </div>
  );
}