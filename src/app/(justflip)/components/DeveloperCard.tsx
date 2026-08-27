"use client";

import Image from "@/src/components/atoms/Image";
import { formatUrl } from "@/src/utils/URLFormatter";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function DeveloperCard({ data }: { data: any }) {
    const banner = data?.medias?.find((m: any) => m.title === "banner");
    const logo = data?.medias?.find((m: any) => m.title === "logo");

    return (
        <div className="flex justify-center w-full group">
            <Link 
                href={`/developers/${formatUrl(data?.name)}-${data?.id}`}
                className="w-full relative h-[260px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
            >
                {/* Full Background Banner */}
                <Image 
                    src={banner?.url || "/placeholder-banner.jpg"} 
                    alt={banner?.name || "Banner"} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Content Panel at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 bg-white border border-gray-100 shadow-md p-3 rounded-xl flex items-center justify-between transition-transform duration-300">
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Logo Container */}
                        <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-xs">
                            {logo ? (
                                <Image 
                                    src={logo.url} 
                                    alt={`${data?.name} logo`} 
                                    className="w-full h-full object-contain p-1" 
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#002B5B] font-bold text-lg">
                                    {data?.name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Title & Properties */}
                        <div className="flex flex-col overflow-hidden">
                            <h3 className="text-gray-900 font-bold text-base truncate group-hover:text-[#002B5B] transition-colors">
                                {data?.name}
                            </h3>
                            <p className="text-gray-500 text-xs font-medium mt-0.5">
                                {data?.totalProjects > 0 ? `${data?.totalProjects} Properties` : "No Properties"}
                            </p>
                        </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="w-8 h-8 rounded-full bg-[#002B5B]/5 flex items-center justify-center text-[#002B5B] shrink-0 group-hover:bg-[#002B5B] group-hover:text-white transition-colors duration-300">
                        <FiArrowRight size={16} />
                    </div>

                </div>
            </Link>
        </div>
    );
}