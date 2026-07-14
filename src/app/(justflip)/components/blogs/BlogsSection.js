"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useBlogStore } from "@/src/stores/blog.store";
import BlogCarouselSkeleton from "./BlogCarouselSkeleton";
import BlogMainSkeleton from "./BlogMainSkeleton";
import BlogCarousel from "./BlogCarousel";
import BlogMain from "./BlogMain";

function BlogsSection({ initialBlogs = [], initialCategory = "Trending Blogs" }) {
    const { blogs, getBlogs, loadingBlogs, hasMore } = useBlogStore();

    const [category, setCategory] = useState(initialCategory);
    const [page, setPage] = useState(1);
    
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            useBlogStore.setState({ 
                blogs: initialBlogs, 
                page: 1, 
                loadingBlogs: false, 
                hasMore: initialBlogs.length > 0 
            });
            initialized.current = true;
            return;
        }
        getBlogs({ page, tag: category });
    }, [page, category, initialBlogs, getBlogs]);

    useEffect(() => {
        if (initialized.current) {
            setPage(1);
        }
    }, [category]);

    const displayBlogs = initialized.current ? blogs : initialBlogs;

    return (
        <div className="min-h-screen">
            <Suspense fallback={<BlogCarouselSkeleton />}>
                <BlogCarousel
                    blogs={displayBlogs?.slice(0, 6)}
                    loading={loadingBlogs && initialized.current}
                />
            </Suspense>

            <Suspense fallback={<BlogMainSkeleton />}>
                <BlogMain
                    key={category}
                    blogs={displayBlogs}
                    page={page}
                    setPage={setPage}
                    category={category}
                    setCategory={setCategory}
                    loadingBlogs={loadingBlogs && initialized.current}
                    hasMore={initialized.current ? hasMore : initialBlogs.length > 0}
                />
            </Suspense>
        </div>
    );
}

export default BlogsSection;