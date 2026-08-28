"use client";

import Image from "@/src/components/atoms/Image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Blog } from "@/src/types";
import { formatUrl } from "@/src/utils/URLFormatter";

export interface BlogCarouselProps {
    blogs?: Blog[];
    loading?: boolean;
}

const BlogCarousel = ({ blogs = [], loading }: BlogCarouselProps) => {
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const length = blogs.length;

    useEffect(() => {
        if (!length) return;

        startAutoPlay();
        return stopAutoPlay;
    }, [current, length]);

    const startAutoPlay = () => {
        stopAutoPlay();
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % length);
        }, 5000);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl my-6 shadow-2xl"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            role="region"
            aria-label="Blog carousel"
        >
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {blogs.map((blog, index) => (
                    <div key={index} className="min-w-full relative group" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${length}`}>
                        <Link
                            href={`/blogs/${formatUrl(blog.heading || "blog")}-${blog?.id}`}
                            aria-label={blog.heading || `Featured blog slide ${index + 1}`}
                        >
                            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative overflow-hidden bg-gray-900">
                                <Image src={blog.image?.url} alt={blog.heading || "Blog image"} className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-105" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12 pb-16 md:pb-20">
                                    <div className="max-w-3xl transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                        <h3 className="text-white font-bold text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 leading-tight drop-shadow-md">
                                            {blog.heading}
                                        </h3>
                                        <p className="text-gray-200 text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 font-light drop-shadow">
                                            {blog.description?.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 z-10">
                {blogs?.map((_, i) => (
                    <button
                        type="button"
                        key={i}
                        aria-label={`Go to slide ${i + 1} of ${length}`}
                        aria-current={current === i ? "true" : undefined}
                        onClick={() => setCurrent(i)}
                        className="min-w-12 min-h-12 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full group"
                    >
                        <span className="sr-only">{`Go to slide ${i + 1} of ${length}`}</span>
                        <div className={`h-1.5 rounded-full transition-all duration-300 ease-in-out ${current === i ? "w-8 bg-white shadow-lg" : "w-2 bg-white/40 group-hover:bg-white/70"}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogCarousel;