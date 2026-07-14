"use client";
import React, { useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { TbBuildingBank } from "react-icons/tb";
import Carousel from "@/src/components/Carousel";
import { convertToCurrency, getCurrencySymbol } from "@/src/utils/RenderFunction";
import { getQueryParam } from "@/src/utils/getQueryParam";
import LazyHydrate from "@/src/components/LazyHydrate";
import { RatingCardSkeleton } from "./Skelton/RatingCardSkeleton";

const RATING_COLORS = { Transport: "#0C5209", Lifestyle: "#FCB539", Environment: "#B80E10", };
const DEFAULT_COLOR = "#6B7280";

const formatPriceRange = (item) => {
    const currency = (item?.currency || "INR").toUpperCase();
    const symbol = getCurrencySymbol(currency);

    const min = item?.minPrice || item?.minPrice === 0 ? convertToCurrency(item.minPrice, currency) : null;
    const max = item?.maxPrice || item?.maxPrice === 0 ? convertToCurrency(item.maxPrice, currency) : null;

    if (!min && !max) return "Available";
    if (min === max || !max) return `${symbol} ${min}`;

    return `${symbol} ${min} - ${symbol} ${max}`;
};

const CircularRating = memo(({ rating = 0, label = "", color }) => {
    const radius = 27;
    const circumference = 2 * Math.PI * radius;
    const progress = (rating / 5) * circumference;

    return (
        <div className="grid place-items-center" aria-label={`${label} rating ${rating}`}>
            <div className="pb-4">
                <svg width="55" height="55" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="2" />
                    <circle cx="30" cy="30" r={radius} fill="none" stroke={color || DEFAULT_COLOR} strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" transform="rotate(-90 30 30)" />
                    <text x="30" y="34" textAnchor="middle" fontSize="14" fontWeight="600">    {rating}</text>
                </svg>
            </div>
            <p className="text-xs font-medium">{label}</p>
        </div>
    );
});

CircularRating.displayName = "CircularRating";


const RatingCardClient = ({ data = {}, trendData = [], type, typeId }) => {
    const router = useRouter();
    const reviews = useMemo(() => data?.aspects || [], [data]);
    const averageRating = useMemo(() => data?.global?.average || 0, [data]);

    const hasTrendData = trendData?.length > 0;


    const queryParam = getQueryParam(type, typeId)

    const handleUnitTypeClick = useCallback(
        (item) => {
            if (!queryParam) return;
            const params = new URLSearchParams();
            params.set(queryParam.key, queryParam.value);
            if (item?.minPrice !== undefined) params.set("minPrice", item.minPrice);
            if (item?.maxPrice !== undefined) params.set("maxPrice", item.maxPrice);
            if (item?.unitType) params.set("unitType", item.unitType);

            router.push(`/listings?${params.toString()}`);
        },
        [queryParam, router]
    );



    return (
        <LazyHydrate placeholder={<RatingCardSkeleton />}>
            <div className="lg:p-4 lg:border border-gray-300 lg:rounded-xl bg-white w-full">
                <div className="flex items-end gap-2 border-b border-gray-300 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c7a51c" className="w-[26px] h-[24.94px] mb-1"   >
                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                    </svg>
                    <p className="text-3xl font-semibold text-[#002B5B]">
                        {averageRating}
                    </p>
                    <span className="text-base text-gray-600">Rating</span>
                </div>

                <div className="flex gap-8 lg:justify-between mt-4">
                    {reviews.length ? (
                        reviews.map((item) => (
                            <CircularRating key={item?.title} rating={item?.average || 0} label={item?.title} color={RATING_COLORS[item?.title]} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 h-22 items-center justify-center flex flex-col text-center w-full">No matching reviews found.</p>

                    )}
                </div>

                <div>
                    <h3 className="text-sm font-medium py-4">Price trends</h3>
                    <div className="flex items-center justify-center h-[108px] mx-auto w-full lg:w-[260px]">
                        {!hasTrendData ? (
                            <div className="flex items-center justify-center  border-gray-300 w-[260px]  h-[106px] rounded-xl">
                                <p className="text-sm text-gray-500 h-22 items-center justify-center flex flex-col text-center w-full">No matching reviews found.</p>

                            </div>
                        ) : (
                            <Carousel
                                items={trendData}
                                itemWidth={260}
                                showDots={false}
                                aspect="h-fit"
                                renderItem={(item) => {
                                    const price = formatPriceRange(item);

                                    return (
                                        <div
                                            key={item?.unitType}
                                            onClick={() => handleUnitTypeClick(item)}
                                            className="w-full  lg:w-[260px] flex justify-between items-start p-3 border border-gray-300 rounded-lg bg-white h-[106px]"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 pb-1">
                                                    {item?.unitType}
                                                </p>

                                                <span className="text-lg font-medium text-black">
                                                    {price}
                                                </span>

                                                <button
                                                    className="text-xs text-[#002B5B] flex items-center gap-1 pt-3"
                                                    aria-label={`View ${item?.count} properties`}
                                                >
                                                    Total {item?.count} Properties
                                                    <MdKeyboardDoubleArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="border rounded-full p-2">
                                                <TbBuildingBank className="text-[#002B5B] text-xl" />
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </LazyHydrate>
    );
};

export default memo(RatingCardClient);