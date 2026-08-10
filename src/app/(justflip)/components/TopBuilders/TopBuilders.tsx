import * as BuilderService from "@/src/services/BuilderService";
import TopBuildersClient from "./TopBuildersClient";

import { City } from "@/src/types";

export default async function TopBuilders({ city }: { city?: City }) {

    let data = null;
    if (city?.id) {
        data = await BuilderService.fetchTopBuilders({
            cityId: city.id,
            limit: 20
        });
    }

    return (
        <TopBuildersClient
            city={city}
            initialBuilders={data || []}
        />
    );

}