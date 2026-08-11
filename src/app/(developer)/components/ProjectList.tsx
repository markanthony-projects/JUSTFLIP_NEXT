import ProjectCard from "@/src/components/Cards/ProjectCard";
import Carousel from "@/src/components/Carousel";
import { convertToCurrency, getLowestAndHighestPrice } from "@/src/utils/RenderFunction";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
import { createProjectUrl } from "@/src/utils/url";
import { FiMapPin } from "react-icons/fi";

export interface ProjectListProps {
  projects?: any[];
  loading?: boolean;
}

function ProjectList({ projects, loading }: ProjectListProps) {
    return (
        <div className="relative mt-4 flex items-center gap-1 min-h-[190px]">
            <Carousel
                rows={2}
                items={projects}
                gap={20}
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
                        <Link href={projectUrl} key={project?.id} className="block group w-[280px] lg:w-[310px]">
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-2.5 h-[90px] flex items-center justify-between">
                                <div className="flex items-center gap-4 w-full">
                                    <div
                                        className="h-[70px] w-[70px] shrink-0 bg-cover bg-center rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-500"
                                        style={{
                                            backgroundImage: `url(${project?.medias?.find((media: any) => media.title === "banner")?.url})`,
                                        }}
                                    ></div>

                                    <div className="flex flex-col justify-center flex-1 overflow-hidden min-w-0">
                                        <h3 className="text-sm font-bold text-[#002B5B] truncate mb-0.5" title={project?.name}>
                                            {project?.name}
                                        </h3>
                                        <p className="text-gray-800 font-semibold text-xs mb-1">
                                            {formattedPrice}
                                        </p>
                                        <p className="text-gray-500 text-[10px] flex items-center gap-1 truncate" title={project?.location?.name}>
                                            <FiMapPin className="text-[#002B5B] shrink-0" />
                                            <span className="truncate">{project?.location?.name}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#002B5B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#002B5B] group-hover:text-white transition-colors text-[#002B5B] ml-2">
                                    <MdArrowForward size={16} />
                                </div>
                            </div>
                        </Link>
                    );
                }}
            />
            {projects?.length === 0 && (
                <div className="flex justify-center items-center w-full py-8 text-gray-500">
                    <p className="text-center">No projects available for this category.</p>
                </div>
            )}
        </div>
    );
}

export default ProjectList;