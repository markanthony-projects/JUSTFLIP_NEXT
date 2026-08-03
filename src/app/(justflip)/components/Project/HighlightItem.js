"use client";

import { memo } from "react";

function HighlightItem({ title, description, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-none md:border-none pb-3 md:pb-0">
      <div 
        onClick={onToggle}
        className="flex items-start gap-3 cursor-pointer md:cursor-default justify-between md:justify-start"
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center mt-0.5 shrink-0">
            <span className="border border-gray-400 rounded-full w-7 h-7 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-[#002B5B] rounded-full" />
            </span>
          </div>

          {title && (
            <p className="text-sm font-medium text-[#002B5B] leading-snug pt-1">
              {title}
            </p>
          )}
        </div>

        <div className="md:hidden text-[#002B5B] pt-1 shrink-0">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {description && (
        <div 
          className={`pl-10 transition-all duration-200 overflow-hidden ${
            isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 md:max-h-none md:opacity-100 md:mt-1"
          }`}
        >
          <p className="text-xs text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(HighlightItem)