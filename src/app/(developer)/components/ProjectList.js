import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import { convertToCurrency, getLowestAndHighestPrice } from "@/src/utils/RenderFunction";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";


function ProjectList({ projects, loading }) {
 
    return (
        <div className="relative md:bg-[#F4F9FA] rounded-b-md flex mt-2 items-center gap-1 min-h-[190px] md:px-2">
            <Carousel
                rows={2}
                items={projects}
                itemWidth={260}
                gap={16}
                aspect="h-fit"
                showDots={false}
                showArrows
                renderItem={(project, i) => {
                    if (!project?.units || project?.units?.length === 0) return null;
                    const { minPrice, maxPrice } = getLowestAndHighestPrice(project?.units)
          

                    return (
                        <Link href="" key={project?.id} >
                            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md px-2 gap-2  h-[76px] flex items-center   justify-between">
                                <div className="flex items-center  gap-4">
                                    <div
                                        className="h-[62px] w-[62px] bg-cover bg-center rounded-xl"
                                        style={{
                                            backgroundImage: `url(${project?.medias?.find((media) => media.title === "banner")?.url})`,
                                        }}
                                    ></div>

                                    <div className="flex flex-col justify-start">
                                        <h3 className="text-[10px] md:text-sm font-bold text-gray-900 line-clamp-1 truncate max-w-30">
                                            {project?.name}
                                        </h3>
                                        <p className="text-gray-800 text-[10px]">
                                            {minPrice === maxPrice
                                                ? ` ₹ ${convertToCurrency(minPrice)}`
                                                : ` ₹ ${convertToCurrency(minPrice)} - ${convertToCurrency(
                                                    maxPrice
                                                )}`}
                                        </p>
                                        <p className="text-gray-800 text-[10px] ">{project?.location?.name}</p>
                                    </div>
                                </div>
                                <MdArrowForward />
                            </div>
                        </Link>
                    );

                }}
            />
            {projects?.length == 0 && (<div className="flex justify-center items-center  w-full">
                <p className="text-center mt-4">No Properties</p>
            </div>)}

        </div>
    );
}

export default ProjectList;