'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from '@/src/components/atoms/Image';

export default function DeveloperDetail({ project, data }) {
    const [expanded, setExpanded] = useState(false);

    const developerUrl = useMemo(() => {
        const name = project?.builder?.name;
        const id = project?.builder?.id;
        if (!name || !id) return '#';
        return `/`;
    }, [project]);

    const description = project?.builder?.description ?? '';
    const isLong = description.length > 1000;

    const displayText = expanded ? description : isLong ? `${description.slice(0, 1000)}...` : description;

    return (
        <section className="">
            <h2 className="text-base font-semibold pb-4">
                Developer's Legacy
            </h2>

            <div className="grid md:grid-cols-[200px_1fr] gap-4  items-start">
                <div className="bg-[#F3F8FA] rounded-2xl p-4 flex flex-col items-center gap-4 shadow-sm">
                    <div className="relative w-[150px] h-[150px] rounded-xl overflow-hidden shadow-md">
                        <Image
                            src={project?.builder?.logo?.url}
                            alt={project?.builder?.name || 'builder'}
                            sizes="150px"
                            className="object-cover"
                        />
                    </div>

                    <Link href={developerUrl} className="w-full text-center text-xs h-9 flex items-center justify-center rounded-full bg-[#002B5B] text-white hover:bg-[#001f42] transition"    >
                        Explore more
                    </Link>
                </div>

                <div className="text-xs leading-relaxed text-gray-700">
                    <p className="text-justify whitespace-pre-line">
                        {displayText}
                    </p>

                    {isLong && (
                        <button onClick={() => setExpanded((prev) => !prev)} className="mt-2 text-[#002B5B] font-medium hover:underline" >
                            {expanded ? 'Show Less' : 'Read More'}
                        </button>
                    )}
                </div>
            </div>

            <div className=''> 
            <h2 className="text-[16px] font-semibold py-4">
                Know {project?.location?.name} Better!
            </h2>
                <p className="text-xs font-normal text-justify">
                    {data?.description}
                </p>
            </div>
        </section>
    );
}