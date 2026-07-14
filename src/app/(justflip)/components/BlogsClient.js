"use client";

import { useState } from "react";
import Link from "next/link";

import Carousel from "@/src/components/Carousel";
import LazyHydrate from "@/src/components/LazyHydrate";

import BlogCard from "@/src/components/molecules/BlogCard";

import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";
import { BlogsSkeleton } from "./Skelton/BlogsSkelton";

export default function BlogsClient({ tag, initialBlogs }) {

    const [enabled, setEnabled] = useState(false);
    const [blogs] = useState(initialBlogs);

    return (
        <div className="pt-2">

            <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-base sm:text-lg text-[#002b5b]">
                    Explore blogs to simplify your home buying
                </h2>

                <Link href="/blogs" className="text-[#002B5B] flex items-center gap-1 items-center py-0.5 px-1 rounded-xs hover:bg-[#002B5B]/5 hover:underline transition-all duration-300 ease-in-out">
                    <span className="hidden sm:block text-xs font-semibold">View More</span>
                    <MdReadMore className="text-xl" />
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
                            row={1}
                            items={blogs}
                            gap={16}
                            aspect="h-fit"
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