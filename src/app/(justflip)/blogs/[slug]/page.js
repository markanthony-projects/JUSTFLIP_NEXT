import Breadcrumb from '@/src/components/organisms/breadCrumb';
import BlogService from '@/src/services/Blog.Service';
import { parseBlogDetailsUrl } from '@/src/utils/url';
import { constructMetadata } from "@/src/utils/seo";
import BlogDetailsClient from '../../components/blogs/BlogDetailsClient';

async function getBlogData({id}) {
    const { blog } = await BlogService.fetchBlogById(id);
    return blog
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { name, id } = parseBlogDetailsUrl(slug);

  const blog = await getBlogData({id});

  const title = blog?.title || name;
  const description = blog?.shortDescription || `Read ${title} on Justflip Blogs.`;

 return constructMetadata({
  title,
  description,
  canonical: `/blogs/${name}-${id}`,
  image: blog?.image?.url || 'https://justflip.in/logo.png',
  type: 'article'
});
}

export const revalidate = 3600;

export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const { name, id } = parseBlogDetailsUrl(slug);

  const blog =  await getBlogData({id});

  if (!blog) {
    return <div className="p-4 text-center">Blog not found</div>;
  }

  return (
    <div className='space-y-2'>
      <Breadcrumb items={[{ label: "Blogs", href: "/blogs" },{ label: name } ]} />
      <BlogDetailsClient initialBlog={blog} />
    </div>
  );
}