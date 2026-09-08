import { SkeletonBlock } from "./SkeletonSection";
import Skeleton from "../PopularCities/Skeleton";

export const PopularCitiesSkeleton = () => (
    <section className="w-full flex flex-col">
        <div className="mb-0 md:mb-2 max-w-3xl">
            <SkeletonBlock className="h-7 md:h-8 w-64 md:w-96 rounded-md" />
        </div>
        <Skeleton />
    </section>
);
