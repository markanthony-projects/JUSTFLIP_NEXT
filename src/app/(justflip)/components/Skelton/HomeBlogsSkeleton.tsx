import { SkeletonBlock } from "./SkeletonSection";
import { BlogsSkeleton } from "./BlogsSkelton";

export const HomeBlogsSkeleton = () => (
    <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
            <SkeletonBlock className="h-5 md:h-7 w-[280px] md:w-[350px]" />
            <SkeletonBlock className="hidden sm:block h-5 w-20" />
        </div>
        <div className="relative">
            <BlogsSkeleton />
        </div>
    </div>
);
