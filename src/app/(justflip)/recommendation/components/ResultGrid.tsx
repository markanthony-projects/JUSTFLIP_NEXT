"use client";

import React from "react";
import Image from "next/image";
import { SlLocationPin } from "react-icons/sl";
import { createProjectUrl } from "@/src/utils/url"; 

export interface PropertyMatch {
  id: string | number;
  name: string;
  cityName: string;
  zoneName: string;
  locationName: string;
  priceRange: string;
  areaRange: string;
  bhkTypes: string;
  image: string;
  reasons: string[];
}

interface Step3Props {
  results: PropertyMatch[];
  isSearching: boolean;
  onModify: () => void;
  onSelectProperty?: (url: string) => void;
}

export default function ResultGrid({
  results,
  isSearching,
  onModify,
  onSelectProperty,
}: Step3Props) {
  const handleCardClick = (item: PropertyMatch) => {
    const projectUrl = createProjectUrl(
      item.cityName,
      item.zoneName,
      item.locationName,
      item.name,
      item.id
    );

    if (onSelectProperty) {
      onSelectProperty(projectUrl);
    } else {
      window.location.href = projectUrl;
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-100 shadow-xl w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 bg-sky-50 text-[#002B5B] text-xs font-extrabold tracking-wider uppercase rounded-md border border-sky-100">
              Results Found
            </span>
            <span className="text-xs font-semibold text-gray-400">
              {results.length} {results.length === 1 ? "Property" : "Properties"} Available
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B5B] tracking-tight">
            Best Matches for You
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            Properties curated specifically based on your selected criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={onModify}
          className="px-5 py-3 border-2 border-gray-200 text-[#002B5B] hover:border-[#002B5B] font-bold text-sm rounded-2xl transition-all cursor-pointer bg-white self-start md:self-auto shadow-2xs"
        >
          &larr; Modify Criteria
        </button>
      </div>

      {isSearching ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#002B5B] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#002B5B] text-base font-bold">
            Finding optimal recommendations...
          </p>
          <p className="text-xs text-gray-400 mt-1">Filtering through top developments</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-800 text-lg font-bold">No exact matches found</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Try expanding your budget or trying a nearby locality.</p>
          <button
            type="button"
            onClick={onModify}
            className="px-5 py-2.5 bg-[#002B5B] text-white text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Adjust Criteria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="bg-white border-2 border-gray-100 hover:border-[#002B5B]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-2xs font-extrabold text-[#002B5B] uppercase tracking-wider shadow-xs">
                  {item.bhkTypes}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-[#002B5B] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-1">
                    <SlLocationPin className="text-gray-400 text-sm shrink-0" />
                    <span className="truncate">{item.locationName}, {item.cityName}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-[#002B5B]">{item.priceRange}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                      {item.areaRange}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-3 border border-gray-100/80">
                  <span className="text-2xs text-gray-400 font-bold uppercase tracking-wider block mb-1.5">
                    Why it matches you
                  </span>
                  <ul className="space-y-1">
                    {item.reasons.map((reason, idx) => (
                      <li key={idx} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xs font-bold shrink-0">
                          ✓
                        </span>
                        <span className="truncate">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#002B5B] group-hover:translate-x-1 transition-transform">
                  <span>View Details & Floor Plans</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}