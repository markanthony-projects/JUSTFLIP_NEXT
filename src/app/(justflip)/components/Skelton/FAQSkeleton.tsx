import { SkeletonBlock } from "./SkeletonSection";
import { memo } from "react";

const FAQItemSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 flex items-center justify-between gap-3 md:gap-4">
            <SkeletonBlock className="h-5 md:h-6 w-3/4 max-w-md rounded-md" />
            <SkeletonBlock className="flex-shrink-0 w-7 h-7 md:w-10 md:h-10 rounded-full" />
        </div>
    );
};

const FAQListSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <FAQItemSkeleton key={i} />
            ))}
        </div>
    );
};

export const FAQSkeleton = memo(() => {
    return (
        <div className="py-8 md:py-16 my-4 md:my-8 rounded-3xl">
            <div className="px-4 mx-auto w-full max-w-4xl">
                <div className="text-center mb-8 md:mb-12 px-2 flex flex-col items-center">
                    <SkeletonBlock className="h-8 md:h-10 w-64 md:w-96 rounded-lg mb-3 md:mb-4" />
                    <SkeletonBlock className="h-4 md:h-5 w-full max-w-lg rounded-md" />
                </div>
                <FAQListSkeleton />
            </div>
        </div>
    );
});