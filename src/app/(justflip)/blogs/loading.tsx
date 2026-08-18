"use client";

import React from "react";
import BlogCarouselSkeleton from "../components/Skelton/BlogCarouselSkeleton";
import BlogMainSkeleton from "../components/Skelton/BlogMainSkeleton";
import { SkeletonBlock } from "../components/Skelton/SkeletonSection";


export default function Loading() {
    return (
        <div className="min-h-screen">
            <div className="py-4 px-4 md:px-0">
                <SkeletonBlock className="h-5 w-40 bg-gray-200 rounded" />
            </div>
            <div className="max-w-screen-xl mx-auto w-full px-4 md:px-0">
                <BlogCarouselSkeleton />
                <BlogMainSkeleton count={6} />
                <div className="flex justify-between items-center py-6 animate-pulse">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonBlock key={i} className="h-8 w-8 bg-gray-200 rounded" />
                        ))}
                    </div>
                    <div className="h-8 w-20 rounded" />
                </div>
            </div>
        </div>
    );
}