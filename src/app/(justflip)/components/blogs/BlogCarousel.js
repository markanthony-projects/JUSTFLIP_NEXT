"use client";

import Image from "@/src/components/atoms/Image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

 const BlogCarousel = ({ blogs = [] }) => {
    const [current, setCurrent] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const intervalRef = useRef(null);
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
        }, 4000);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-lg my-2"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            role="region"
            aria-label="Blog carousel"
        >
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {blogs.map((blog, index) => (
                    <div key={index} className="min-w-full relative" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${length}`}  >
                        <Link href="#">
                            <div className="w-full h-48  md:h-[19rem] lg:h-[22rem]  rounded-xl">
                                <Image src={blog.image?.url} alt={blog.heading} className="object-cover w-full h-full" />
                            </div>

                            <div className="absolute inset-0 flex items-center">
                                <div className="bg-white/10 backdrop-blur-3xl p-2 md:p-10 rounded-r-xl max-w-sm md:max-w-lg">
                                    <h3 className="text-white font-bold text-xs md:text-lg mb-2 line-clamp-2">
                                        {blog.heading}
                                    </h3>
                                    <p className="text-white text-[10px] md:text-xs line-clamp-3">
                                        {blog.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/10 px-3 py-2 backdrop-blur-3xl rounded-3xl">
                {blogs?.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 w-2 rounded-full transition-all ${current === i ? "bg-white w-4" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BlogCarousel;