"use client";

function SkeletonCard() {
    return (
        <div className="w-[240px] sm:w-[260px] md:w-[280px] h-36 sm:h-36 md:h-40 rounded-2xl bg-gray-200 animate-pulse" />
    );
}

export default function Skeleton() {
    return (
        <div className="w-full grid grid-flow-col grid-rows-2 auto-cols-[280px] gap-4 overflow-hidden py-2">
            {Array.from({ length: 8 }).map((_, index) => (<SkeletonCard key={index} />))}
        </div>
    );
}