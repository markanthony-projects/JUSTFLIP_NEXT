import Link from "next/link";
import Image from "../atoms/Image";
import { formatUrl } from "@/src/utils/URLFormatter";

export default function BlogCard({ blog }) {

    const published = new Date(blog.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).replace(/(\d+) (\w+) (\d+)/, "$1 $2, $3");

    const description = blog?.description || blog?.meta?.description || blog?.subHeading || null;

    return (
        <Link
            href={`/blogs/${formatUrl(blog.heading)}-${blog?.id}`}
            className="group w-[300px] md:w-[320px] flex-shrink-0 h-[380px] flex flex-col"
        >
            <div className="relative w-full h-[190px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                {blog?.image?.url ? (
                    <Image
                        src={blog.image.url}
                        alt={blog.image?.alt || blog.heading || "blog"}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100" />
                )}
            </div>

            <div className="pt-3 flex flex-col flex-1 overflow-hidden">
                <time className="text-[12px] text-gray-400 mb-1.5 block">
                    {published}
                </time>

                <h3 className="text-[16px] font-medium leading-snug text-gray-900 line-clamp-2 mb-2">
                    {blog.heading}
                </h3>

                {description && (
                    <div dangerouslySetInnerHTML={{ __html: description }} className="line-clamp-3 text-[13px] text-gray-500 leading-relaxed whitespace-pre-line" />
                )}
            </div>
        </Link>
    );
}