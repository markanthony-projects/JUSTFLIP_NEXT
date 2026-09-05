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
        <section className="w-full flex flex-col">

            <div className="mb-0 md:mb-2 max-w-3xl">
                <h2 className="text-lg md:text-xl font-semibold text-primary">
                    Explore Properties Popular Cities
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