"use client";

import React from "react";
import { SkeletonBlock } from "../Skelton/SkeletonSection";

function BlogMainSkeleton({ count = 16 }) {
    return (
        <section className="md:py-6">
            <nav className="flex space-x-4 py-4 overflow-x-auto">
                {[...Array(3)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-6 w-28" />
                ))}
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="rounded-xl p-3 space-y-3">
                        <SkeletonBlock className="h-[12rem] w-full rounded-lg" />
                        <SkeletonBlock className="h-3 w-3/4" />
                        <SkeletonBlock className="h-2 w-1/2" />
                        <SkeletonBlock className="h-2 w-1/3" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BlogMainSkeleton;