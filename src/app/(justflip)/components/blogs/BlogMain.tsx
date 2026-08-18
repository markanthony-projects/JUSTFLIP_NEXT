"use client";

import React, { useCallback, useMemo } from "react";
import BlogGridCard from "@/src/components/molecules/BlogGridCard";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";

import { Blog } from "@/src/types";

export interface BlogMainProps {
    blogs?: Blog[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    loadingBlogs: boolean;
    hasMore: boolean;
}

function BlogMain({
    blogs = [],
    page,
    setPage,
    category,
    setCategory,
    loadingBlogs,
    hasMore,

}: BlogMainProps) {
    const categories = ["Trending Blog", "Upcoming Blog", "New Blog"];

    const loadMore = useCallback(() => {
        if (!loadingBlogs && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [loadingBlogs, hasMore, setPage]);
    const sentinelRef = useInfiniteScroll({
        hasMore,
        loading: loadingBlogs,
        onLoadMore: loadMore,
    });

    const categoryTagMap: Record<string, string> = {
        "Trending Blog": "Trending Blog",
        "New Blog": "New Blog",
        "Upcoming Blog": "Upcoming Blog",
    };

    const filteredBlogs = useMemo(() => {
        return blogs?.filter(({ tag }) => {
            const tagValue = typeof tag === "string" ? tag : tag?.tag;

            return (tagValue?.split(",") || [])
                .map((t) => t.trim())
                .includes(categoryTagMap[category]);
        });
    }, [blogs, category]);

    return (
        <section className="mb-12">
            <nav className="flex space-x-2 md:space-x-3 py-6 overflow-x-auto scrollbar-hidden">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-300 ${category === cat
                                ? "bg-black text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        onClick={() => {
                            setCategory(cat);
                            setPage(1);
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {filteredBlogs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
                    {filteredBlogs.map((blog) => (
                        <BlogGridCard key={blog?.id || blog?._id} blog={blog} />
                    ))}
                </div>
            ) : (
                !loadingBlogs && (
                    <div className="text-center py-10 text-gray-400">
                        No blogs found
                    </div>
                )
            )}

            <div ref={sentinelRef} />
        </section>
    );
}

export default BlogMain;