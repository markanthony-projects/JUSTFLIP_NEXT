import * as ProjectService from '@/src/services/ProjectService'
import React from 'react'
import ProjectSection from './TaggedProperties/ProjectSection'

async function TopProperty({ type, typeId }) {
  const projects = await ProjectService.fetchTopProjects({ type, typeId, limit: 15, page: 1, })
  return (
    <section className="lg:border border-gray-300 rounded-xl lg:p-4  bg-white" aria-label="Top Properties">
      <h2 className="text-lg font-semibold ">Top Properties</h2>
      <div className=" w-full lg:w-[260px] mx-auto ">
        {projects?.length > 0 ? (
          <ProjectSection projects={projects} />
        ) : (
          <div className="flex items-center justify-center w-full h-[36vh]">
            No properties found
          </div>
        )}
      </div>
    </section>)
}

export default TopProperty