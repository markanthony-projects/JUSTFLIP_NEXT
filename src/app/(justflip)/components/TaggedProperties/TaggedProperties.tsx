import * as ProjectService from "@/src/services/ProjectService";

import SSRProjectSection from "./SSRProjectSection";
import DeferredProjectSection from "./DeferredProjectSection";
import { City } from "@/src/types";

export default async function TaggedProperties({ city }: { city?: City }) {

    const newLaunches = await ProjectService.fetchProjectsByTag({
        tag: "New Launches",
        cityId: city?.id as string,
        limit: 15
    });

    return (
        <div className="flex flex-col gap-4 md:gap-8">

            <DeferredProjectSection
                city={city}
                tag="Featured Properties"
            />

            <DeferredProjectSection
                city={city}
                tag="Upcoming Launches"
            />

            <SSRProjectSection
                city={city}
                tag="New Launches"
                projects={newLaunches}
            />


        </div>
    );

}