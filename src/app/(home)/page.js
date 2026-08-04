import SearchBar from "@/src/components/SearchBar/SearchBar.server";
import { SEARCH_BAR_SLOT } from "@/src/components/SearchBar/search-bar.slot";
import InchargeHeader from "@/src/layout/Header/InchargeHeader.server";
import Banners from "../(justflip)/components/Banners/Banners";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { SkeletonBlock } from "../(justflip)/components/Skelton/SkeletonSection";
import LazyHydrate from "@/src/components/LazyHydrate";
import { TopBuildersSkeleton } from "../(justflip)/components/Skelton/TopBuildersSkeleton";
import { BlogsSkeleton } from "../(justflip)/components/Skelton/BlogsSkelton";

const PopularCities = dynamic(() => import("../(justflip)/components/PopularCities/PopularCities"), { suspense: true });
const TaggedProperties = dynamic(() => import("../(justflip)/components/TaggedProperties/TaggedProperties"), { suspense: true });
const TopBuilders = dynamic(() => import("../(justflip)/components/TopBuilders/TopBuilders"), { suspense: true });
const Blogs = dynamic(() => import("../(justflip)/components/Blogs"), { suspense: true });
import MortgageCalculator from "@/src/components/molecules/MortgageCalculatorsDynamic";

import { constructMetadata } from "@/src/utils/seo";
import { buildWebsiteSchema, buildBreadcrumbSchema } from "@/src/utils/schema";

export const metadata = constructMetadata({
    title: "Buy Apartments, Villas & Plots in India & Dubai | JustFlip.in",
    description: "Browse 10,000+ verified new homes, apartments, villas, and plots from top developers across India and Dubai. Find your dream home on JustFlip today!",
    canonical: "/"
});

export const revalidate = 3600;

export default async function JustFlipHomePage() {
    const city = null;

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

            <div className="w-full min-h-screen py-1
            0 px-4 lg:px-6 lg:max-w-310 mx-auto flex flex-col gap-4 md:gap-8">
                <Suspense fallback={<SkeletonBlock className="h-64 w-full" />}>
                    <TaggedProperties city={city} />
                </Suspense>
                
                <Suspense fallback={<TopBuildersSkeleton />}>
                    <TopBuilders city={city} />
                </Suspense>

                <LazyHydrate rootMargin="300px">
                    <MortgageCalculator />
                </LazyHydrate>

                <Suspense fallback={<SkeletonBlock className="h-64 w-full" />}>
                    <PopularCities />
                </Suspense>

                <Suspense fallback={<BlogsSkeleton />}>
                    <Blogs tag={"Latest Blogs"} />
                </Suspense>
            </div>
        </main>
    );
}
