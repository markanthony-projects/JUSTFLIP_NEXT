import ProjectSection from '../TaggedProperties/ProjectSection'

import { Project } from "@/src/types";

function SimilarProject({ data }: { data: Project[] }) {
    if(!data || data.length === 0) return null
    return (
        <div className="">
            <div className="pt-6">
                <h2 className="text-sm font-semibold md:text-lg">
                    Similar Properties
                </h2>
            </div>
            <ProjectSection projects={data} />
        </div>
    )
}

export default SimilarProject