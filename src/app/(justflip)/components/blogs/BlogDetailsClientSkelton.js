import { BlogsSkeleton } from "../Skelton/BlogsSkelton";
import { SkeletonBlock } from "../Skelton/SkeletonSection";

export default function Loading() {
    return (
        <div className="space-y-2">
         <SkeletonBlock className="h-4 w-94 bg-gray-200 rounded" />
            <main className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <article className="lg:col-span-3 space-y-4">
                        <SkeletonBlock className="w-full aspect-[16/8]" />
                        <SkeletonBlock className="h-4 w-3/4" />
                        <SkeletonBlock className="h-3 w-1/2" />

                        <div className="space-y-2">
                            <SkeletonBlock className="h-3 w-full" />
                            <SkeletonBlock className="h-3 w-5/6" />
                            <SkeletonBlock className="h-3 w-4/6" />
                        </div>

                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="space-y-3">
                                <SkeletonBlock className="h-4 w-1/3" />
                                <SkeletonBlock className="w-full aspect-[16/8]" />
                                <div className="space-y-2">
                                    <SkeletonBlock className="h-3 w-full" />
                                    <SkeletonBlock className="h-3 w-5/6" />
                                    <SkeletonBlock className="h-3 w-4/6" />
                                </div>
                            </div>
                        ))}
                    </article>
                </div>

                <div className="space-y-3 pb-4">
                    <SkeletonBlock className="h-4 w-1/4" />
                      <BlogsSkeleton />
                </div>
            </main>
        </div>
    );
}