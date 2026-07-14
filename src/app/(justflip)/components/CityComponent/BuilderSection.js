import Link from "next/link";
import TopBuildersClient from "../TopBuilders/TopBuildersClient";

export default function BuildersSection({ builders }) {
    return (
        <div >
            <div className="flex justify-between">
                <h2 className="font-medium text-lg">Popular Developers</h2>

                <Link href="/" className="text-sm underline flex items-center gap-2">
                    View All
                </Link>
            </div>

            <TopBuildersClient initialBuilders={builders || []} />
        </div>
    );
}