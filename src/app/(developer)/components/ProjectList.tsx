import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import { convertToCurrency, getLowestAndHighestPrice } from "@/src/utils/RenderFunction";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
import { createProjectUrl } from "@/src/utils/url";


export interface ProjectListProps {
  projects?: any[];
  loading?: boolean;
}

function ProjectList({ projects, loading }: ProjectListProps) {
    // console.log(projects)
    return (
        <div className="relative md:bg-[#F4F9FA] rounded-b-md flex mt-2 items-center gap-1 min-h-[190px] md:px-2">
            <Carousel
                rows={2}
                items={projects}
                gap={16}
                showDots={false}
                showArrows
                renderItem={(project: any, i: number) => {
                    if (!project?.units || project?.units?.length === 0) return null;
                    const { minPrice, maxPrice } = getLowestAndHighestPrice(project?.units)

                    const hasMin = Number.isFinite(Number(minPrice)) && Number(minPrice) > 0;
                    const hasMax = Number.isFinite(Number(maxPrice)) && Number(maxPrice) > 0;

                    const isPriceOnRequest = 
                        (!hasMin && !hasMax) && 
                        (
                            project?.units?.some((u: any) => u.priceStatus === "ON_REQUEST") || 
                            project?.units?.every((u: any) => !u.price || u.price === 0)
                        );

                    const formattedPrice = isPriceOnRequest || !hasMin
                        ? "Price On Request"
                        : minPrice === maxPrice || !hasMax
                        ? `₹ ${convertToCurrency(minPrice)}`
                        : `₹ ${convertToCurrency(minPrice)} - ${convertToCurrency(maxPrice)}`;
          
                    const projectUrl = createProjectUrl(
                        project?.city?.name,
                        project?.zone?.name,
                        project?.location?.name,
                        project?.name,
                        project?.id
                    );

                    return (
                        <Link href={projectUrl} key={project?.id} >
                            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md px-2 gap-2  h-[76px] flex items-center   justify-between">
                                <div className="flex items-center  gap-4">
                                    <div
                                        className="h-[62px] w-[62px] bg-cover bg-center rounded-xl"
                                        style={{
                                            backgroundImage: `url(${project?.medias?.find((media: any) => media.title === "banner")?.url})`,
                                        }}
                                    ></div>

                                    <div className="flex flex-col justify-start">
                                        <h3 className="text-[10px] md:text-sm font-bold text-gray-900 line-clamp-1 truncate max-w-30">
                                            {project?.name}
                                        </h3>
                                        <p className="text-gray-800 text-[10px]">
                                            {formattedPrice}
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