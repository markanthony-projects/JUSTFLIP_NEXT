"use client";

function SkeletonCard() {
    return (
        <div className="w-[240px] sm:w-[260px] md:w-[280px] rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 animate-pulse">

            <div className="flex items-center gap-3 sm:gap-4">

                {/* IMAGE */}

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-200 shrink-0" />

                {/* CONTENT */}

                <div className="min-w-0 flex-1 space-y-3">

                    <div className="h-4 w-3/4 rounded-md bg-gray-200" />

                    <div className="h-3 w-1/2 rounded-md bg-gray-100" />

                </div>

            </div>

        </div>
    );
}

export default function Skeleton() {
    return (
        <div className="w-full grid grid-flow-col grid-rows-2 auto-cols-[280px] gap-4 overflow-hidden py-2">
            {Array.from({ length: 8 }).map((_, index) => (<SkeletonCard key={index} />))}
        </div>
    );
}