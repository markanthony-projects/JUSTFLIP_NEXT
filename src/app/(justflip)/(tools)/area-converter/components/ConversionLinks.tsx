import React from 'react'
import { conversionGroups } from '../data/conversionLinks';
import Link from 'next/link';

const ConversionLinks = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {conversionGroups.map((group) => (
        <div
            key={group.title}
            className="rounded-lg border border-gray-200 bg-white p-5"
        >
            <h3 className="mb-5 text-lg font-semibold text-[#002B5B]">
                {group.title}
            </h3>

            <div className="space-y-4">
                {group.links.map((link) => (
                    <Link
                        key={link.conversion}
                        href={`/area-converter/${link.conversion}`}
                        target='_blank'
                        className="block text-sm text-[#002B5B] underline underline-offset-2 transition hover:text-[#1d5da3]"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    ))}
</div>
  )
}

export default ConversionLinks