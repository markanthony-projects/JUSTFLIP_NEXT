"use client";

import { memo } from "react";


const HighlightItem = memo(function HighlightItem({ title, description }) {
    return (
        <div className="flex items-start gap-3">

            <div className="flex items-center justify-center mt-1">
                <span className="border border-gray-400 rounded-full w-7 h-7 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 bg-[#002B5B] rounded-full" />
                </span>
            </div>

            <div className="flex flex-col">
                {title && (
                    <p className="text-sm font-medium text-[#002B5B] leading-snug">
                        {title}
                    </p>
                )}

                {description && (
                    <p className="text-xs text-gray-700 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
});

function HighlightsProject({ project = {} }) {
    const { name, advantages = [], } = project;

    if (!advantages.length) return null;

    return (
        <section className="pt-4 md:pt-0">
            <h2 className="text-sm md:text-lg font-semibold pb-4">
                Highlights of {name}
            </h2>

            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">

                <div className="bg-[#002B5B] text-white px-5 py-4 relative">
                    <p className="text-sm md:text-lg font-medium">
                        Why Choose {name}?
                    </p>

                    <div className="absolute bottom-0 left-0 w-full h-2 bg-white rounded-t-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6 px-2 md:px-4">
                    {advantages.map((advantage, index) => (
                        <HighlightItem key={advantage?.title || index} title={advantage?.title} description={advantage?.description} />
                    ))}
                </div>
            </div>
        </section>
    );
}




export default memo(HighlightsProject);