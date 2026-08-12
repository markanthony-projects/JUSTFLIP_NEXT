import { BlogsSkeleton } from "./BlogsSkelton";
import { SkeletonBlock } from "./SkeletonSection";

export default function BlogDetailsClientSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
                <article>
                    {/* HERO HEADER SKELETON */}
                    <header className="mb-10 flex flex-col items-center max-w-6xl mx-auto text-center">
                        <SkeletonBlock className="h-4 w-32 mb-5" />
                        <SkeletonBlock className="h-10 md:h-12 w-3/4 rounded-md mb-3" />
                        <SkeletonBlock className="h-10 md:h-12 w-1/2 rounded-md mb-8" />
                        
                        <SkeletonBlock className="h-5 w-2/3 rounded mb-2" />
                        <SkeletonBlock className="h-5 w-1/2 rounded mb-6" />
                    </header>

                    {/* COVER IMAGE SKELETON */}
                    <div className="w-full aspect-[16/8] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-12 bg-gray-50">
                         <SkeletonBlock className="w-full h-full" />
                    </div>

                    {/* MAIN CONTENT SKELETON */}
                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* description paragraph */}
                        <div className="space-y-4">
                             <SkeletonBlock className="h-5 w-full rounded" />
                             <SkeletonBlock className="h-5 w-full rounded" />
                             <SkeletonBlock className="h-5 w-5/6 rounded" />
                        </div>

                        {/* SECTIONS */}
                        {[1, 2].map((_, idx) => (
                            <section key={idx} className="space-y-6 mt-12">
                                <SkeletonBlock className="h-8 w-1/2 md:w-1/3 rounded mb-6" />
                                
                                <div className="space-y-4">
                                     <SkeletonBlock className="h-5 w-full rounded" />
                                     <SkeletonBlock className="h-5 w-full rounded" />
                                     <SkeletonBlock className="h-5 w-4/5 rounded" />
                                </div>
                                
                                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 my-8 shadow-sm">
                                     <SkeletonBlock className="w-full h-full" />
                                </div>
                                
                                <div className="space-y-4">
                                     <SkeletonBlock className="h-5 w-full rounded" />
                                     <SkeletonBlock className="h-5 w-5/6 rounded" />
                                     <SkeletonBlock className="h-5 w-3/4 rounded" />
                                </div>
                            </section>
                        ))}
                    </div>
                </article>
            </main>

            {/* SIMILAR BLOGS FOOTER SKELETON */}
            <div className="w-full border-t border-gray-200 mt-16 pt-16 pb-12">
                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center md:justify-start">
                        <SkeletonBlock className="h-9 w-64 rounded mb-8" />
                    </div>
                    
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                            <SkeletonBlock className="h-6 w-72 rounded" />
                            <SkeletonBlock className="hidden sm:block h-5 w-24 rounded" />
                        </div>
                        <BlogsSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}