"use client";

import { SkeletonBlock } from "./SkeletonSection";


export default function DeveloperLegacySkeleton() {
    return (
        <section className="animate-pulse">
            <SkeletonBlock className="h-5 w-48 mb-4" />
            <div className="grid md:grid-cols-[200px_1fr] gap-4 items-start">
                <div className="bg-[#F3F8FA] rounded-2xl p-4 flex flex-col items-center gap-4 shadow-sm">
                    <div className="relative w-[150px] h-[150px] rounded-xl overflow-hidden shadow-md">
                        <SkeletonBlock className="w-full h-full rounded-xl" />
                    </div>
                    <SkeletonBlock className="h-9 w-full rounded-full" />
                </div>

                <div className="flex flex-col gap-2">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-[95%]" />
                    <SkeletonBlock className="h-3 w-[90%]" />
                    <SkeletonBlock className="h-3 w-[85%]" />
                    <SkeletonBlock className="h-3 w-[80%]" />
                    <SkeletonBlock className="h-3 w-20 mt-2" />
                </div>
            </div>

            <div className="mt-4">
                <SkeletonBlock className="h-5 w-56 mb-4" />
                <div className="flex flex-col gap-2">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-[95%]" />
                    <SkeletonBlock className="h-3 w-[92%]" />
                    <SkeletonBlock className="h-3 w-[88%]" />
                    <SkeletonBlock className="h-3 w-[85%]" />
                </div>

            </div>
        </section>
    );
}