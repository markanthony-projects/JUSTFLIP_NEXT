    "use client";
    import React from 'react'

    import Image from "@/src/components/atoms/Image";
    import { createProjectUrl } from "@/src/utils/url";
    import Link from "next/link";
    import { memo, useState } from "react";
    import { Project, Media } from "@/src/types";
    import { MdOutlineLocationOn } from "react-icons/md";
    import FavouriteButton from '@/src/components/atoms/FavouriteButton';
    import dynamic from "next/dynamic";

    const LoginModal = dynamic(() => import('@/src/components/organisms/LoginModal'), { ssr: false });

    const TopPropertyCard = ({ project, priority }: { project: Project; priority?: boolean }) => {
        const [showLoginPrompt, setShowLoginPrompt] = useState(false);

        if (!project) return null;
        const locationName = project?.location?.name || "";
        const projectName = project?.name || "";

        const zoneName = project?.location?.zone?.name || project?.zone?.name

        const projectUrl = createProjectUrl(project?.city?.name || "", zoneName || "", project?.location?.name || "", project?.name, project?.id)

        const bannerImage = project?.banner || (project?.medias?.find((m: Media) => m.title === 'banner') || project?.medias?.[0]);

        return (
            <>
                <Link href={projectUrl} className="w-full">
                    <div 
                        className="group relative bg-white shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:border-gray-300 rounded-lg overflow-hidden flex flex-col my-2 w-60 md:w-60 max-w-60 animate-slide-up"
                    >
                        <div className= "h-35 md:h-35 xl:h-35 relative overflow-hidden bg-gray-100 border-b border-gray-100 w-60 md:w-60 max-w-60">
                            <Image
                                src={bannerImage?.url || '/assets/project-banner.webp'}
                                alt={bannerImage?.alt || project.name}
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                priority={priority}
                                sizes="250px"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none z-0"></div>

                            <div className="absolute top-0 right-0 m-3 flex justify-between w-full z-10">
                                <div className="absolute left-2 top-3 bg-white/95 backdrop-blur-sm shadow-md text-[#002B5B] flex items-center rounded-r-lg shadow-gray-800 h-7 px-2.5">
                                    <MdOutlineLocationOn className="text-red-500" size={14} />
                                    <span className="text-[10px] font-bold md:font-bold pl-1 truncate max-w-30">
                                        {locationName}
                                    </span>
                                </div>
                                <div className="absolute top-0 -right-3 m-3">
                                    <FavouriteButton
                                        project={project}
                                        onAuthRequired={() => setShowLoginPrompt(true)}
                                        className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 py-1 z-10 bg-white h-16 md:h-16.5 overflow-hidden px-2 border border-gray-200">
                            <h3 className="text-[13px] leading-snug text-start line-clamp-1 font-extrabold text-gray-900 truncate tracking-tight text-sm md:font-bold">
                                {projectName}
                            </h3>

                            {project.summary ? (
                                <p className="text-[10px] font-medium text-gray-500 line-clamp-1 truncate text-xs md:font-medium">
                                    {project.summary}
                                </p>
                            ) : (
                                <p className="text-[10px] text-xs font-medium text-gray-500 line-clamp-1 truncate">
                                    {project.address || `${project?.residenceType || 'Property'} • ${project?.transactionTag || 'For Sale'}`}
                                </p>
                            )}

                            <div className="my-1 flex items-center justify-between">
                                <p className="text-[12px] text-start font-extrabold text-[#002B5B] md:font-bold">
                                    {project?.priceRange || 'Price on Request'}
                                </p>
                                {project.status && (
                                    <span className={`text-[8px] px-2 py-1 rounded-md font-bold uppercase tracking-widest ${project.status === 'active' ? 'bg-green-100 text-green-700' : project.status === 'pending' || project.approval === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {project.approval === 'pending' ? 'Pending' : project.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
                <LoginModal isOpen={showLoginPrompt} closeModal={() => setShowLoginPrompt(false)} />
            </>
        );
    };

    export default memo(TopPropertyCard);

