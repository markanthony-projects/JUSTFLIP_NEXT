import ProjectSection from '../TaggedProperties/ProjectSection'

import { Project } from "@/src/types";
import SimilarSection from '../TaggedProperties/SimilarSection';

function SimilarProject({ data }: { data: Project[] }) {
    if(!data || data.length === 0) return null
    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-4 sm:p-5 md:p-6">
            <h2 className="section-heading">
                Similar Properties
            </h2>
            <SimilarSection projects={data} />
        </div>
    )
}

export default SimilarProject