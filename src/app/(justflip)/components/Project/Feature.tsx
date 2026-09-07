// "use client";

// import { useState, useMemo, useCallback } from "react";
// import FeatureItem from "./FeatureItem";
// import ToggleButton from "@/src/components/atoms/ToggleButton";

// import { Project, Amenity } from "@/src/types";

// export default function Features({ project }: { project: Project }) {
//     const [expanded, setExpanded] = useState(false);
//     const amenities = project?.amenities || [];

//     const visibleAmenities = useMemo(() => {
//         return expanded ? amenities : amenities.slice(0, 8);
//     }, [expanded, amenities]);

//     const remainingCount = amenities.length - visibleAmenities.length;

//     const toggle = useCallback(() => {
//         setExpanded((prev) => !prev);
//     }, []);

//     if (!amenities.length) return null;

//     return (
//         <section className="">
//             <h2 className="m-2 text-sm font-semibold md:text-lg">Features</h2>

//             <div className="grid grid-cols-2 my-2 lg:flex lg:flex-wrap lg:m-2 gap-y-2">
//                 {visibleAmenities.map((item: Amenity, index: number) => (
//                     <FeatureItem key={item?.id || index} item={item} />
//                 ))}
//             </div>

//             <div className="ml-4">
//                 <ToggleButton expanded={expanded} remainingCount={remainingCount} onToggle={toggle} />
//             </div>
//         </section>
//     );
// }

"use client";

import { useState } from "react";
import FeatureItem from "./FeatureItem";
import { Project, Amenity } from "@/src/types";

export default function Features({ project }: { project: Project }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const amenities = project?.amenities || [];

    // Show only the top 8 highlights on the main page
    const topAmenities = amenities.slice(0, 8);

    if (!amenities.length) return null;

    return (
        <section className="my-1">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 md:text-lg">
                        Top Amenities & Features
                    </h2>
                </div>
            </div>

            {/* Clean 4-column grid for top highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {topAmenities.map((item: Amenity, index: number) => (
                    <FeatureItem key={item?.id || index} item={item} />
                ))}
            </div>

            {/* Trigger Button to Open Modal if there are more than 8 */}
            {amenities.length > 8 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                        + {amenities.length - 8} more amenities available
                    </span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm font-semibold text-primary hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        Show all {amenities.length} amenities 
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">All Project Amenities ({amenities.length})</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {amenities.map((item: Amenity, index: number) => (
                                <FeatureItem key={item?.id || index} item={item} />
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
}