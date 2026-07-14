"use client";

import Image from "@/src/components/atoms/Image";
import { formatUrl } from "@/src/utils/URLFormatter";
import Link from "next/link";

export default function DeveloperCard({ data }) {
    const banner = data?.medias?.find((m) => m.title === "banner");

    return (
        <div className=" flex justify-center w-full " >
            <div className="w-full hover:-translate-y-2 transition-all duration-500 ">
                <div className="h-[180px] w-full relative rounded-lg overflow-hidden border border-gray-300">
                    <Link href={`/developers/${formatUrl(data?.name)}-${data?.id}`}>
                        <Image src={banner?.url} alt={banner?.name} className="w-full h-full object-cover transition-transform duration-700 " />
                        <div className="absolute bottom-0 inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent  opacity-90 ">
                            <h3 className="text-base font-semibold text-white  truncate max-w-[250px]">
                                {data?.name}
                            </h3>

                            <p className="text-xs text-white/70">
                                {data?.totalProjects > 0 ? data?.totalProjects : "No"} Properties
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}