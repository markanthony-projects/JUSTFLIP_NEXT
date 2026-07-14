"use client";

import { SkeletonBlock } from "./SkeletonSection";


const headers = ["Unit Type", "Area", "Price", "Floor Plan"];

function TableRowSkeleton() {
    return (
        <tr className="">

            {/* Unit Type */}
            <td className="px-4 py-3 min-w-[150px]">
                <SkeletonBlock className="h-4 w-20" />
            </td>

            {/* Area */}
            <td className="px-4 py-3 min-w-[150px]">
                <SkeletonBlock className="h-4 w-24" />
            </td>

            {/* Price */}
            <td className="px-4 py-3 min-w-[150px]">
                <SkeletonBlock className="h-4 w-28" />
            </td>

            {/* Floor Plan */}
            <td className="px-4 py-3 min-w-[150px]">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-22" />
                </div>
            </td>
        </tr>
    );
}

export default function UnitTableSkeleton({ rows = 3 }) {
    return (
        <div className="overflow-x-auto animate-pulse">
            <div className="relative">

                <table className="w-full text-left text-gray-600">

                    {/* HEADER */}
                    <thead className="bg-[#002B5B]">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-4 min-w-[150px] py-3 first:rounded-l last:rounded-r"
                                >
                                    <SkeletonBlock className="h-4 w-24 bg-white/30" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {Array.from({ length: rows }).map((_, index) => (
                            <TableRowSkeleton key={index} />
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}