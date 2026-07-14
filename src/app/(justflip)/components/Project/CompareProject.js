"use client";

import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import Carousel from "@/src/components/Carousel";
import Link from "next/link";
import Image from "@/src/components/atoms/Image";
import { createProjectUrl } from "@/src/utils/url";
import { useCompareStore } from "@/src/stores/useCompare.store";
import { ClientPageRoot } from "next/dist/client/components/client-page";

const CompareCarousel = ({ data, isDefault = true }) => {
    const { items, add, remove } = useCompareStore();

    if (data?.length === 0) {
        return <p className="text-center text-gray-500 h-[180px] flex items-center justify-center">No similar properties</p>;
    }

    
    const renderCard = (item, index, isMobileGrid = false) => {
        const bannerFromMedias = item?.medias?.find((m) => m.type?.toLowerCase() === "image" && m.title?.toLowerCase() === "banner");
        const imageUrl = item?.banner?.url || bannerFromMedias?.url;
        const city = item?.city?.name;
        const zone = item?.location?.zone?.name;
        const location = item?.location?.name;
        const name = item?.name;
        const id = item?.id;

        const isAdded = items.some((t) => t.id === item?.id);

        const handleCompare = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isAdded) {
                remove(item.id);
            } else {
                add(item);
            }
        }

        const projectUrl = createProjectUrl(city, zone, location, name, id);

        return (
            <div key={item?.id || index} className={`flex justify-center ${isMobileGrid ? 'w-full' : (!isDefault ? 'w-[260px]' : 'w-[320px]')}`}>
                <div className="w-full rounded-2xl border border-gray-300 overflow-hidden hover:-translate-y-2 transition-all duration-500 ">
                    <div className={`${isMobileGrid ? 'h-[180px]' : (!isDefault ? 'h-[200px]' : 'h-[260px]')} w-full relative `}>
                        <Link href={projectUrl}>
                            <Image src={imageUrl} alt={item?.banner?.name || name} className="w-full h-full object-cover transition-transform duration-700 " />
                            <div className={`absolute bottom-0 inset-0 flex flex-col justify-end ${isMobileGrid ? 'p-3' : 'p-4'} bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-90 `}>
                                <h3 className={`${isMobileGrid ? 'text-sm max-w-[150px]' : 'text-base max-w-[250px]'} font-semibold text-white truncate`}>
                                    {name}
                                </h3>

                                <p className={`${isMobileGrid ? 'text-xs' : 'text-xs'} text-white/70 truncate mb-1`}>
                                    {location}
                                </p>

                                {!isMobileGrid && (
                                    <p className="text-sm font-semibold text-white">
                                        {item?.priceRange}
                                    </p>
                                )}

                                <button
                                    onClick={handleCompare}
                                    className={`cursor-pointer ${isMobileGrid ? 'mt-1 py-1.5 rounded-lg text-xs gap-1' : 'mt-3 py-2.5 rounded-xl text-sm gap-2'} flex items-center justify-center font-medium text-white backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 ${isAdded ? "bg-red-500/30 hover:bg-red-500/40" : "bg-white/30 hover:bg-white/40"}`}
                                >
                                    {isAdded ? (<>
                                        <IoRemoveSharp className={isMobileGrid ? '' : 'ml-2'} /> <span>Compare</span>
                                    </>) : (<>
                                        <IoAddSharp className={isMobileGrid ? '' : 'ml-2'} /> <span>Compare</span>
                                    </>)}
                                </button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (!isDefault) {
        return (
            <div className="w-full">
                {/* Mobile view: 2-column grid */}
                <div className="md:hidden grid grid-cols-2 gap-2 overflow-y-auto max-h-[350px] p-1 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {data.map((item, index) => renderCard(item, index, true))}
                </div>
                {/* Desktop view: Carousel */}
                <div className="hidden md:block w-full">
                    <Carousel
                        items={data}
                        showDots={false}
                        itemWidth={260}
                        gap={16}
                        aspect="h-fit"
                        renderItem={(item, index) => renderCard(item, index, false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={` ${isDefault && "py-8 rounded-xl  shadow-[0px_0px_10px_1px_#dad6d6]"}`}>
            <div className={`w-full ${isDefault && "max-w-[320px] mx-auto"}`}>
                <Carousel
                    items={data}
                    showDots={false}
                    itemWidth={320}
                    gap={16}
                    aspect="h-fit"
                    renderItem={(item, index) => renderCard(item, index, false)}
                />
            </div>
        </div>
    );
};

export default CompareCarousel;