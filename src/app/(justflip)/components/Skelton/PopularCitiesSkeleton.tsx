import { SkeletonBlock } from "./SkeletonSection";
import Skeleton from "../PopularCities/Skeleton";

export const PopularCitiesSkeleton = () => (
    <section className="space-y-2">
        <div className="max-w-3xl">
            <SkeletonBlock className="h-5 md:h-7 w-[280px] md:w-[450px]" />
        </div>
        <Skeleton />
    </section>
);
