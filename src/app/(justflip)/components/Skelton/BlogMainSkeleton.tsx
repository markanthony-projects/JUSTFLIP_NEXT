"use client";

import React from "react";
import { SkeletonBlock } from "./SkeletonSection";

export interface BlogMainSkeletonProps {
    count?: number;
}

function BlogMainSkeleton({ count = 6 }: BlogMainSkeletonProps) {
    return (
        <section className="mb-12">
            <nav className="flex space-x-2 md:space-x-3 py-6 overflow-x-auto scrollbar-hidden">
                {[...Array(3)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-10 w-28 md:w-32 rounded-full" />
                ))}
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="w-full flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50">
                            <SkeletonBlock className="w-full h-full" />
                        </div>
                        <div className="p-6 flex flex-col flex-1 gap-4">
                            <SkeletonBlock className="h-3 w-1/4 rounded-sm" />
                            
                            <div className="space-y-2 mt-1">
                                <SkeletonBlock className="h-5 w-full rounded-sm" />
                                <SkeletonBlock className="h-5 w-5/6 rounded-sm" />
                            </div>
                            
                            <div className="space-y-2 mt-2">
                                <SkeletonBlock className="h-3 w-full rounded-sm" />
                                <SkeletonBlock className="h-3 w-full rounded-sm" />
                                <SkeletonBlock className="h-3 w-2/3 rounded-sm" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BlogMainSkeleton;