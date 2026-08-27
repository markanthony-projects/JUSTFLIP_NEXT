import SearchBar from "@/src/components/SearchBar/SearchBar.server";
import { SEARCH_BAR_SLOT } from "@/src/components/SearchBar/search-bar.slot";
import InchargeHeader from "@/src/layout/Header/InchargeHeader.server";
import Banners from "../(justflip)/components/Banners/Banners";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SkeletonBlock } from "../(justflip)/components/Skelton/SkeletonSection";
import LazyHydrate from "@/src/components/LazyHydrate";
import { TopBuildersSkeleton } from "../(justflip)/components/Skelton/TopBuildersSkeleton";
import { TaggedPropertiesSkeleton } from "../(justflip)/components/Skelton/TaggedPropertiesSkeleton";
import { PopularCitiesSkeleton } from "../(justflip)/components/Skelton/PopularCitiesSkeleton";
import { HomeBlogsSkeleton } from "../(justflip)/components/Skelton/HomeBlogsSkeleton";

import PopularCities from "../(justflip)/components/PopularCities/PopularCities";
import TaggedProperties from "../(justflip)/components/TaggedProperties/TaggedProperties";
import TopBuilders from "../(justflip)/components/TopBuilders/TopBuilders";
import MortgageCalculator from "@/src/components/molecules/MortgageCalculatorsDynamic";
import PropertyTools from "../(justflip)/components/PropertyTools/PropertyTools";
import Blogs from "../(justflip)/components/Blogs";
import PostPropertyCTA from "../(justflip)/components/PostPropertyCTA";
import ExploreByBudget from "../(justflip)/components/ExploreByBudget";

import { constructMetadata } from "@/src/utils/seo";
import { buildWebsiteSchema, buildBreadcrumbSchema } from "@/src/utils/schema";
import PropertyRecommend from "../(justflip)/components/PropertyRecommend";

export const metadata = constructMetadata({
    title: "Buy Apartments, Villas & Plots in India & Dubai | JustFlip.in",
    description: "Browse 10,000+ verified new homes, apartments, villas, and plots from top developers across India and Dubai. Find your dream home on JustFlip today!",
    canonical: "/"
});

export const revalidate = 3600;

export default async function JustFlipHomePage() {
    const city = undefined;

    const websiteSchema = buildWebsiteSchema();
    const breadcrumbSchema = buildBreadcrumbSchema([{ label: "Home", href: "/" }]);

    return (
        <main className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <h1 className="sr-only">Buy Apartments, Villas & Plots in India & Dubai - JustFlip</h1>
            <section className="relative w-full">
                <Banners />
                <div className="absolute top-0 left-0 w-full z-20 bg-linear-to-b from-black/90 via-black/60 to-transparent">
                    <InchargeHeader />
                </div>
                <div className={`${SEARCH_BAR_SLOT} -bottom-6 z-30`}>
                    <SearchBar />
                </div>
            </section>

            <span id="banner-end" className="block h-px w-full" />

            <div className="w-full min-h-screen pt-12 md:pt-16 pb-10 px-4 lg:px-6 lg:max-w-310 mx-auto flex flex-col gap-4 md:gap-8">
                <Suspense fallback={<TaggedPropertiesSkeleton />}>
                    <TaggedProperties city={city} />
                </Suspense>

                <ExploreByBudget />

                <PropertyRecommend />

                <LazyHydrate rootMargin="350px" placeholder={<TopBuildersSkeleton />}>
                    <Suspense fallback={<TopBuildersSkeleton />}>
                        <TopBuilders city={city} />
                    </Suspense>
                </LazyHydrate>

                <LazyHydrate rootMargin="300px">
                    <MortgageCalculator />
                </LazyHydrate>

                <PropertyTools excludeId="mortgage-calculator" title="Financial & Planning Tools" />

                <LazyHydrate rootMargin="350px" placeholder={<PopularCitiesSkeleton />}>
                    <Suspense fallback={<PopularCitiesSkeleton />}>
                        <PopularCities />
                    </Suspense>
                </LazyHydrate>

                <PostPropertyCTA />

                <LazyHydrate rootMargin="350px" placeholder={<HomeBlogsSkeleton />}>
                    <Suspense fallback={<HomeBlogsSkeleton />}>
                        <Blogs tag={"Latest Blogs"} />
                    </Suspense>
                </LazyHydrate>
            </div>
        </main>
    );
}
