"use client";
import React, { useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { TbBuildingBank } from "react-icons/tb";
import dynamic from "next/dynamic";
import { convertToCurrency, getCurrencySymbol } from "@/src/utils/RenderFunction";
import { getQueryParam } from "@/src/utils/getQueryParam";
import LazyHydrate from "@/src/components/LazyHydrate";
import { RatingCardSkeleton } from "./Skelton/RatingCardSkeleton";
import { useReviewStore } from "@/src/stores/review.store"; // Path to your review store

const Carousel = dynamic(() => import("@/src/components/Carousel"), { ssr: false });

const RATING_COLORS = { 
  Transport: "#0C5209", 
  Lifestyle: "#FCB539", 
  Environment: "#B80E10" 
};
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

const CircularRating = memo(({ rating = 0, label = "", color = DEFAULT_COLOR }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const safeRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
  const progress = (safeRating / 5) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-1">
        <svg width="60" height="60" viewBox="0 0 60 60" className="transform -rotate-90 drop-shadow-sm">
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="3.5"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[13px] font-bold text-gray-800">
          {safeRating.toFixed(2)}
        </span>
      </div>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
});

CircularRating.displayName = "CircularRating";

const DEFAULT_LABELS = ["Lifestyle", "Environment", "Transport"];

const CircularRatingSkeleton = ({ index = 0 }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="relative flex items-center justify-center mb-1">
      <svg width="60" height="60" viewBox="0 0 60 60" className="transform -rotate-90 drop-shadow-xs">
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke="#F3F4F6"
          strokeWidth="3.5"
        />
      </svg>
      <span className="absolute text-[13px] font-bold text-gray-800">
        0.00
      </span>
    </div>
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-1">
      {DEFAULT_LABELS[index] || "Rating"}
    </p>
  </div>
);

const RatingCardClient = ({ data: initialData = {}, trendData = [], type, typeId }) => {
  const router = useRouter();

  // Read live state directly from Zustand review store
  const storeReviews = useReviewStore((state) => state.reviews);

  // Fallback to initialData prop if store state is empty
  const activeData = storeReviews?.aspects?.length ? storeReviews : initialData;

  const reviews = useMemo(() => {
    return Array.isArray(activeData?.aspects) ? [...activeData.aspects] : [];
  }, [activeData?.aspects]);

  const averageRating = useMemo(() => {
    const avg = activeData?.global?.average ?? activeData?.average ?? 0;
    return Number(avg).toFixed(2);
  }, [activeData?.global?.average, activeData?.average]);

  const hasTrendData = trendData?.length > 0;
  const queryParam = useMemo(() => getQueryParam(type, typeId), [type, typeId]);

  const handleUnitTypeClick = useCallback(
    (item) => {
      if (!queryParam) return;

      const [paramKey, paramValue] = Object.entries(queryParam)[0] || [];
      if (!paramKey) return;

      const params = new URLSearchParams();
      params.set(paramKey, paramValue);
      if (item?.minPrice !== undefined) params.set("minPrice", item.minPrice);
      if (item?.maxPrice !== undefined) params.set("maxPrice", item.maxPrice);
      if (item?.unitType) params.set("unitType", item.unitType);

      router.push(`/search?${params.toString()}`);
    },
    [queryParam, router]
  );

  return (
    <LazyHydrate placeholder={<RatingCardSkeleton />}>
      <div className="lg:px-5 lg:rounded-2xl lg:shadow-sm bg-white w-full p-2 md:p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        
        {/* Global Average Rating Display */}
        <div className="flex items-center space-x-2 border-gray-100 border-b pb-1 mb-1">
          <div className="bg-amber-50 p-2 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#c7a51c" className="w-6 h-5.5 mb-1">
              <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-baseline space-x-1.5">
              <p className="text-xl font-extrabold text-gray-900 tracking-tight">{averageRating}</p>
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Rating</p>
            </div>
          </div>
        </div>

        {/* Circular Ratings Breakdown */}
        <div className="flex gap-8 lg:justify-between">
          {reviews.length > 0 ? (
            reviews.map((item, index) => (
              <CircularRating 
                key={`${item?.title}-${item?.average}-${index}`} 
                rating={item?.average || 0} 
                label={item?.title} 
                color={RATING_COLORS[item?.title] || DEFAULT_COLOR} 
              />
            ))
          ) : (
            Array.from({ length: 3 }).map((_, i) => <CircularRatingSkeleton key={i} index={i}/>)
          )}
        </div>

        {/* Price Trends Carousel */}
        <div className="mt-3 md:mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-gray-800">Price Trends</h3>
          </div>
          <div className="flex items-center justify-center h-[108px] mx-auto w-full lg:w-[260px]">
            {!hasTrendData ? (
              <div className="flex items-center justify-center w-full h-[106px] bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-sm font-medium">No matching data found.</p>
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
                      className="w-full bg-linear-to-r from-blue-50 from-10% via-transparent-500 via-30% to-blue-50 to-90% lg:w-[260px] flex justify-between items-center p-3 border border-gray-300 rounded-2xl cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#3752A6]">{item?.unitType}</p>
                        <span className="text-lg font-bold text-gray-900">{price}</span>
                        <button
                          className="text-xs font-medium text-[#002B5B] flex items-center gap-1.5 pt-1 hover:scale-101"
                          aria-label={`View ${item?.count} properties`}
                        >
                          Total {item?.count} Properties
                          <MdKeyboardDoubleArrowRight className="w-3 h-3 hover:scale-101" />
                        </button>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:scale-101">
                        <TbBuildingBank className="text-[#002B5B] text-2xl" />
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