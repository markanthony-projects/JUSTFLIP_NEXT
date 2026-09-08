"use client";

function SkeletonCard() {
    return (
        <div className="relative w-[150px] md:w-[200px] h-24 md:h-30 rounded-lg overflow-hidden bg-gray-200 animate-pulse flex flex-col justify-end p-2.5 md:p-3">
            <div className="h-3.5 md:h-4 w-3/4 bg-gray-300 rounded mb-1 md:mb-1.5" />
            <div className="h-2.5 md:h-3 w-1/2 bg-gray-300 rounded" />
        </div>
    );
}

export default function Skeleton() {
    return (
        <div className="w-full grid grid-flow-col grid-rows-3 auto-cols-[150px] md:auto-cols-[200px] gap-4 overflow-hidden py-2">
            {Array.from({ length: 18 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}