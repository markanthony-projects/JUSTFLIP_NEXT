import TopBuildersClient from "../TopBuilders/TopBuildersClient";

export default function BuildersSection({ builders, city }) {
    return (
        <div >
            <TopBuildersClient city={city} initialBuilders={builders || []} />
        </div>
    );
}
