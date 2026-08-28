
import Link from "next/link";
import Image from "../atoms/Image";
import { formatUrl } from "@/src/utils/URLFormatter";
import { Blog } from "@/src/types";

export interface BlogGridCardProps {
    blog: Blog;
}

export default function BlogGridCard({ blog }: BlogGridCardProps) {

    const published = new Date(blog.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).replace(/(\d+) (\w+) (\d+)/, "$1 $2, $3");

    const description = blog?.description || blog?.meta?.description || blog?.subHeading || null;

    return (
        <Link
            href={`/blogs/${formatUrl(blog.heading || "blog")}-${blog?.id}`}
            aria-label={blog.heading || "Read blog post"}
            className="group w-full flex flex-col h-full bg-white border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5"
        >
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50">
                {blog?.image?.url ? (
                    <Image
                        src={blog.image.url}
                        alt={blog.image?.alt || blog.heading || "blog"}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100" />
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                <time className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-widest block">
                    {published}
                </time>

                <h3 className="text-lg md:text-[20px] font-bold leading-snug text-gray-900 line-clamp-2 mb-3 group-hover:text-black transition-colors duration-200">
                    {blog.heading}
                </h3>

                {description && (
                    <div className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
                        {description.replace(/<[^>]*>?/gm, '')}
                    </div>
                )}
            </div>
        </Link>
    );
}