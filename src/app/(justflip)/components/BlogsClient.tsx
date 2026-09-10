"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/src/components/Carousel"), { ssr: false });
import LazyHydrate from "@/src/components/LazyHydrate";
const BlogCard = dynamic(() => import("@/src/components/molecules/BlogCard"), { ssr: false });
import { BlogsSkeleton } from "./Skelton/BlogsSkelton";
import { CgChevronRightO } from "react-icons/cg";

export default function BlogsClient({ tag, initialBlogs }: { tag?: string; initialBlogs?: any }) {

    const [enabled, setEnabled] = useState(false);
    const [blogs] = useState(initialBlogs);

    return (
        <div className="w-full flex flex-col">

            <div className="flex justify-between items-center mb-0 md:mb-2">
                <h2 className="section-heading mb-3">
                    Explore blogs to simplify your home buying
                </h2>

                <Link aria-label="View More" href="/blogs" className="text-primary flex items-center gap-1 items-center py-0.5 px-1 transition-all duration-300 hover:underline">
                    <span className="hidden sm:block text-lg font-semibold">View More</span>
                    <CgChevronRightO className="text-2xl" />

                </Link>
            </div>

            <div className="relative">

                <LazyHydrate
                    rootMargin="500px"
                    placeholder={<BlogsSkeleton />}
                    onVisible={() => setEnabled(true)}
                >

                    {enabled && blogs?.length > 0 ? (
                        <Carousel
                            rows={1}
                            items={blogs}
                            gap={16}
                            showDots={false}
                            renderItem={(blog) => (
                                <BlogCard
                                    key={blog?.id}
                                    blog={blog}
                                />
                            )}
                        />
                    ) : (
                        <BlogsSkeleton />
                    )}

                </LazyHydrate>

            </div>

        </div>
    );

}