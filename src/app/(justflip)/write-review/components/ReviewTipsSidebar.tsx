"use client";

import React from "react";
import { FaStar, FaTree, FaSmile, FaBus } from "react-icons/fa";

export default function ReviewTipsSidebar() {
  return (
    <aside className="h-fit bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-17">
      {/* Header Section */}
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-lg p-1.5 bg-amber-100/80 rounded-lg text-amber-700">💡</span>
        <h4 className="font-extrabold text-[#002B5B] text-base sm:text-lg">
          Tips for a Great Review
        </h4>
      </div>
      <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
        Your honest contribution helps home seekers make the right choice!
      </p>

      <div className="space-y-5">
        {/* Project Section */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5">
            <FaStar className="text-amber-500 text-xs shrink-0" />
            <h5 className="font-bold text-[#002B5B] text-xs uppercase tracking-wide">
              For Projects
            </h5>
          </div>
          <p className="text-xs text-slate-600 leading-normal pl-5">
            Give honest overall ratings on construction quality, amenities, and society management.
          </p>
        </div>

        {/* Location Section Header */}
        <div className="pt-1">
          <h5 className="font-bold text-[#002B5B] text-xs uppercase tracking-wider mb-3 px-1">
            For Locations
          </h5>

          <ul className="space-y-3.5 text-xs text-slate-600">
            {/* Environment */}
            <li className="flex gap-2.5 items-start">
              <div className="mt-0.5 p-1 bg-emerald-50 text-emerald-600 rounded-md shrink-0">
                <FaTree className="text-xs" />
              </div>
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">
                  Environment
                </strong>
                <span className="text-slate-500 leading-snug block">
                  Comment on noise levels, greenery, air quality, and cleanliness.
                </span>
              </div>
            </li>

            {/* Lifestyle */}
            <li className="flex gap-2.5 items-start">
              <div className="mt-0.5 p-1 bg-indigo-50 text-indigo-600 rounded-md shrink-0">
                <FaSmile className="text-xs" />
              </div>
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">
                  Lifestyle
                </strong>
                <span className="text-slate-500 leading-snug block">
                  Mention safety, local markets, food options, and neighborhood vibes.
                </span>
              </div>
            </li>

            {/* Transport */}
            <li className="flex gap-2.5 items-start">
              <div className="mt-0.5 p-1 bg-blue-50 text-blue-600 rounded-md shrink-0">
                <FaBus className="text-xs" />
              </div>
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">
                  Transport
                </strong>
                <span className="text-slate-500 leading-snug block">
                  Highlight connectivity, metro access, traffic conditions, and daily commutes.
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}