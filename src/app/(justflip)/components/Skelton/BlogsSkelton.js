function BlogSkeletonCard() {
    return (
        <div className="w-[300px] md:w-[320px] flex-shrink-0 h-[380px] flex flex-col">
            <div className="w-full h-[190px] flex-shrink-0 rounded-xl bg-gray-100 animate-pulse" />
            <div className="pt-3 flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-[15px] w-[95%] bg-gray-100 rounded animate-pulse" />
                <div className="h-[15px] w-[78%] bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse mt-1" />
                <div className="h-3 w-[90%] bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-[70%] bg-gray-100 rounded animate-pulse" />
            </div>
        </div>
    );
}

export function BlogsSkeleton() {
    return (
        <div className="flex items-start gap-5 py-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
                <BlogSkeletonCard key={i} />
            ))}
        </div>
    );
}
