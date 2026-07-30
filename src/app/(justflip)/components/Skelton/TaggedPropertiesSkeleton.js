"use client";

import SimilarPropertiesSkeleton from "./SimilarPropertiesSkeleton";

export default function TaggedPropertiesSkeleton() {
    return (
        <div className="flex flex-col gap-4 md:gap-8">
            <SimilarPropertiesSkeleton />
            <SimilarPropertiesSkeleton />
            <SimilarPropertiesSkeleton />
        </div>
    );
}
