import SearchBar from "@/src/components/SearchBar/SearchBar.server";
import InchargeHeader from "@/src/layout/Header/InchargeHeader.server";
import Banners from "../(justflip)/components/Banners/Banners";
import PopularCities from "../(justflip)/components/PopularCities/PopularCities";
import TaggedProperties from "../(justflip)/components/TaggedProperties/TaggedProperties";
import TopBuilders from "../(justflip)/components/TopBuilders/TopBuilders";
import { cookies } from "next/headers";
import Blogs from "../(justflip)/components/Blogs";
import MortgageCalculator from "@/src/components/molecules/MortgageCalculators";

import { constructMetadata } from "@/src/utils/seo";
import { buildWebsiteSchema } from "@/src/utils/schema";

export const metadata = constructMetadata({
    title: "Real Estate Properties in India & Dubai",
    description: "Discover new apartments, villas, and plots across top cities in India and Dubai with Justflip.",
    canonical: "/"
});

export const revalidate = 3600;

export default async function JustFlipHomePage() {
    const cookieStore = await cookies();
    const raw = cookieStore.get("activeCity")?.value;
    const city = raw ? JSON.parse(raw) : null;

    const websiteSchema = buildWebsiteSchema();

    return (
        <main className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <section className="relative w-full">
                <Banners />
                <div className="absolute top-0 left-0 w-full z-20 bg-linear-to-b from-black/90 via-black/60 to-transparent">
                    <InchargeHeader />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 w-full px-2 sm:px-0 sm:w-150 lg:w-112.5 xl:w-150">
                    <SearchBar />
                </div>
            </section>

            <span id="banner-end" className="block h-px w-full" />

            <div className="w-full min-h-screen py-10 px-4 lg:px-6 lg:max-w-310 mx-auto flex flex-col gap-4 md:gap-8">
                <TaggedProperties city={city} />
                <TopBuilders city={city} />
                <MortgageCalculator />
                <PopularCities />
                <Blogs tag={"Latest Blogs"} />
            </div>
        </main>
    );
}
