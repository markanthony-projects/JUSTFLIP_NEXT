import { PropertyCardSkeletonList } from "./PropertyCardSkeleton";
import { SkeletonBlock } from "./SkeletonSection";

const SectionSkeleton = () => (
    <section>
        <div className="md:mb-2">
            <div className="flex items-center justify-between">
                <SkeletonBlock className="h-6 w-48 md:w-64" />
                <SkeletonBlock className="hidden sm:block h-5 w-20" />
            </div>
            <SkeletonBlock className="h-4 w-64 md:w-96 mt-2" />
        </div>
        <div className="mt-4">
            <PropertyCardSkeletonList />
        </div>
    </section>
);

export const TaggedPropertiesSkeleton = () => (
    <div className="contents">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
    </div>
);
