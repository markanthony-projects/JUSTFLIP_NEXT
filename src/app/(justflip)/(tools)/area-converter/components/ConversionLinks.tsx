import React, { useState } from 'react'
import { conversionGroups } from '../data/conversionLinks';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ConversionLinks = () => {
 const [openUnit, setOpenUnit] = useState<string | null>(
        conversionGroups[0]?.title || null
    );

    const handleToggle = (title: string) => {
        setOpenUnit((prev) => (prev === title ? null : title));
    };

    return (
        <div className="w-full border-2 border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(0,3,9,0.10)] rounded-lg px-4 py-3">
            <div className="space-y-2">
                {conversionGroups.map((group) => {
                    const isOpen = openUnit === group.title;
                    return (
                        <div
                            key={group.title}
                            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                        >
                            {/* UNIT HEADER */}
                            <button
                                type="button"
                                onClick={() => handleToggle(group.title)}
                                className="flex w-full items-center justify-between px-3 py-3 text-left"
                            >
                                <span className="text-[13px] font-semibold text-gray-600">
                                    {group.title}
                                </span>

                                {isOpen ? (
                                    <FiChevronUp className="text-gray-500" />
                                ) : (
                                    <FiChevronDown className="text-gray-500" />
                                )}
                            </button>


                            {/* CONVERSION LINKS */}
                            {isOpen && (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-3 pb-4">
                                    {group.links.map((link) => (
                                        <Link
                                            key={link.conversion}
                                            href={`/area-converter/${link.conversion}`}
                                            target="_blank"
                                            className="text-[11px] text-gray-600 underline underline-offset-2 transition hover:text-[#002B5B]"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default ConversionLinks