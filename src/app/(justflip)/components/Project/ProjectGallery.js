"use client";
import Image from "@/src/components/atoms/Image";
import React, { useEffect, useMemo, useState } from "react";

const LocationImageGallery = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const images = useMemo(() => {
        if (!data?.medias) return [];
        return data.medias.filter((o) => o?.type === "image" && ["other", "others"].includes(o?.title?.toLowerCase()));
    }, [data]);

    useEffect(() => {
        if (images.length > 0) {
            setActiveIndex(0);
        }
    }, [images]);

    const activeImage = images[activeIndex]?.url;

    return (
        <div className="">
            <h2 className="text-[16px] font-semibold pb-2"> {data?.name} - At a Glance </h2>

            <div className="w-full">
                <div className="bg-white rounded-lg ">
                    <div className="grid lg:grid-cols-6 grid-cols-1 lg:gap-2 ">

                        <div className="col-span-4">
                            <div className="relative w-full h-40 md:h-72 lg:h-96 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={activeImage}
                                    alt="location gallery"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    className={`         object-cover object-center          transition-opacity duration-500 `}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 w-full py-1 md:py-2 lg:py-0">
                            <div className="lg:overflow-y-auto overflow-x-auto w-full scrollbar-modern ">
                                <div className="grid grid-flow-col auto-cols-max gap-1  lg:grid-cols-2 lg:grid-rows-3 lg:grid-flow-row ">
                                    {images.length > 0 ? (
                                        images.map((img, index) => {
                                            if (!img?.url) return null;

                                            const isActive = index === activeIndex;

                                            return (
                                                <button key={img.url} onClick={() => { setActiveIndex(index); }} aria-label={`View image ${index + 1}`} className={`relative cursor-pointer rounded-lg p-0.5 overflow-hidden w-24 md:w-28 h-18 lg:w-full lg:h-24 transition-all duration-200 ${isActive ? "border-2 border-gray-500 scale-100" : "opacity-60 scale-95 hover:scale-100 hover:opacity-100"}`}    >
                                                    <Image src={img.url} alt={img.alt || `thumbnail-${index}`} className="object-cover rounded-lg" />
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No images available
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationImageGallery;