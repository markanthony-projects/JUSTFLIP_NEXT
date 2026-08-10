import TopBuildersClient from "../TopBuilders/TopBuildersClient";
import { City, Builder } from "@/src/types";

export default function BuildersSection({ builders, city }: { builders?: Builder[]; city?: City }) {
    return (
        <div >
            <TopBuildersClient city={city} initialBuilders={builders || []} />
        </div>
    );
}
