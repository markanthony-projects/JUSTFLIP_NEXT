"use client";

import React, { useCallback, useMemo } from "react";
import BlogCard from "@/src/components/molecules/BlogCard";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll ";

function BlogMain({
    blogs = [],
    page,
    setPage,
    category,
    setCategory,
    loadingBlogs,
    hasMore,

}) {
    const categories = ["Trending Blogs", "Upcoming Blogs", "New Blogs"];

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

    const categoryTagMap = {
        "Trending Blogs": "Trending Blog",
        "New Blogs": "New Blog",
        "Upcoming Blogs": "Upcoming Blog",
    };

    const filteredBlogs = useMemo(() => {
        return blogs?.filter(({ tag }) => {
            const tagValue = typeof tag === "string" ? tag : tag?.tag;

            return tagValue
                ?.split(",")
                .map((t) => t.trim())
                .includes(categoryTagMap[category]);
        });
    }, [blogs, category]);

    return (
        <section className="mb-2">
            <nav className="flex md:space-x-4 py-4 overflow-x-auto scrollbar-hidden">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`pb-2 px-4 text-sm whitespace-nowrap transition ${category === cat
                                ? "font-semibold border-b-2 border-black"
                                : "text-gray-500"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-screen scrollbar-modern ">
                    {filteredBlogs.map((blog) => (
                        <BlogCard key={blog?.id || blog?._id} blog={blog} />
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