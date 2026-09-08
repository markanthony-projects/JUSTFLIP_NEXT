import ProjectSection from '../TaggedProperties/ProjectSection'

import { Project } from "@/src/types";
import SimilarSection from '../TaggedProperties/SimilarSection';

function SimilarProject({ data }: { data: Project[] }) {
    if(!data || data.length === 0) return null
    return (
        <div className="">
            <div className="pt-6">
                <h2 className="section-heading">
                    Similar Properties
                </h2>
            </div>
            <SimilarSection projects={data} />
        </div>
    )
}

export default SimilarProject