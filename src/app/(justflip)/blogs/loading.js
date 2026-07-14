"use client";

import React from "react";
import BlogCarouselSkeleton from "../components/blogs/BlogCarouselSkeleton";
import BlogMainSkeleton from "../components/blogs/BlogMainSkeleton";
import { SkeletonBlock } from "../components/Skelton/SkeletonSection";


export default function Loading() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="h-screen lg:col-span-3 flex flex-col relative min-h-screen px-4 md:px-6 lg:px-8 ">
                <SkeletonBlock className="h-4 w-34 bg-gray-200 rounded" />
                <BlogCarouselSkeleton />
                <BlogMainSkeleton count={6} />
                <div className="flex justify-between items-center py-6 animate-pulse">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonBlock key={i} className="h-8 w-8 bg-gray-200 rounded" />
                        ))}
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}