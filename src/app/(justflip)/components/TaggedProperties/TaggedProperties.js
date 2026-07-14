import * as ProjectService from "@/src/services/ProjectService";

import SSRProjectSection from "./SSRProjectSection";
import DeferredProjectSection from "./DeferredProjectSection";

export default async function TaggedProperties({ city }) {

    const newLaunches = await ProjectService.fetchProjectsByTag({
        tag: "New Launches",
        cityId: city?.id,
        limit: 15
    });

    return (
        <div className="flex flex-col gap-4 md:gap-8">

            <SSRProjectSection
                city={city}
                tag="New Launches"
                projects={newLaunches}
            />

            <DeferredProjectSection
                city={city}
                tag="Upcoming Launches"
            />

            <DeferredProjectSection
                city={city}
                tag="Featured Properties"
            />

        </div>
    );

}