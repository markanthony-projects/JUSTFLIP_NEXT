import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const FAQItemSkeleton = () => {
    return (
        <div className="py-3.5 px-4 md:py-4 md:px-6 flex items-center justify-between gap-4">
            <SkeletonBlock className="h-4 md:h-5 w-3/4 max-w-md rounded-md" />
            <SkeletonBlock className="flex-shrink-0 w-4 h-4 rounded-sm" />
        </div>
    );
};

const FAQListSkeleton = ({ count = 5 }) => {
    return (
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200/90 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <FAQItemSkeleton key={i} />
            ))}
        </div>
    );
};

export const FAQSkeleton = memo(() => {
    return (
        <div className="py-6 md:py-10 my-2 md:my-4">
            <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
                <div className="text-center mb-6 md:mb-8 px-2 flex flex-col items-center">
                    <SkeletonBlock className="h-7 md:h-8 w-60 md:w-80 rounded-lg mb-2" />
                    <SkeletonBlock className="h-3.5 md:h-4 w-full max-w-sm rounded-md" />
                </div>
                <FAQListSkeleton />
            </div>
        </div>
    );
});