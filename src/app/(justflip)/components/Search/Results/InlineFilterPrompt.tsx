'use client';

import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { FiHome, FiDollarSign, FiGrid } from 'react-icons/fi';

export type PromptType = 'propertyType' | 'unitType' | 'priceRange';

interface InlineFilterPromptProps {
  type: PromptType;
}

const PROMPT_CONTENT = {
  propertyType: {
    title: "Looking for a specific property type?",
    description: "Filter by apartments, villas, plots, or penthouses.",
    icon: <FiHome className="w-5 h-5 text-[#002B5B]" />,
  },
  unitType: {
    title: "How many bedrooms do you need?",
    description: "Select your preferred BHK configuration.",
    icon: <FiGrid className="w-5 h-5 text-[#002B5B]" />,
  },
  priceRange: {
    title: "Set a budget range",
    description: "View properties tailored to your price preference.",
    icon: <FiDollarSign className="w-5 h-5 text-[#002B5B]" />,
  },
};

export default function InlineFilterPrompt({ type }: InlineFilterPromptProps) {
  const { setFilter } = useSearchStore();
  const config = SEARCH_CONFIG.filters[type];
  const content = PROMPT_CONTENT[type];

  if (!config) return null;

  const handleOptionClick = (value: any) => {
    if (type === 'priceRange') {
      setFilter('minPrice', value.min);
      setFilter('maxPrice', value.max);
    } else {
      setFilter(type, value);
    }
  };

  const displayOptions =
    type === 'priceRange'
      ? (config.presets || []).slice(0, 4)
      : (config.options || []).slice(0, 4);

  return (
    <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl shadow-2xs flex items-center justify-center shrink-0 border border-slate-200">
          {content.icon}
        </div>

        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5">{content.title}</h3>
          <p className="text-xs text-slate-500 mb-3">{content.description}</p>

          <div className="flex flex-wrap gap-2">
            {displayOptions.map((opt: any, idx: number) => {
              const value = type === 'priceRange' ? opt : opt.value;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(value)}
                  className="px-3 py-1.5 bg-white text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 hover:border-[#002B5B] hover:text-[#002B5B] hover:bg-blue-50/50 transition-colors cursor-pointer shadow-2xs"
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
