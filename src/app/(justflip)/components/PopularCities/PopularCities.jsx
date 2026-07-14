import SiteService from "@/src/services/SiteService";
import PopularCitiesClient from "./PopularCitiesClient";

export default async function PopularCities() {

    const {
        cities,
        hasMore,
        nextOffset
    } = await SiteService.fetchPopularCities({
        offset: 0,
        limit: 15
    });

    return (
        <section className="space-y-2">

            <div className="max-w-3xl">
                <h2 className="text-sm md:text-xl font-semibold text-[#002b5b]">
                    Explore Properties Across India’s Most Popular Cities
                </h2>
            </div>

            <PopularCitiesClient
                initialCities={cities}
                initialHasMore={hasMore}
                initialOffset={nextOffset}
            />

        </section>
    );

}