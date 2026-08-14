import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';

export type PromptType = 'propertyType' | 'unitType' | 'priceRange';

interface InlineFilterPromptProps {
  type: PromptType;
}

const PROMPT_CONTENT = {
  propertyType: {
    title: "Looking for a specific property type?",
    description: "Narrow down your search to find exactly what you want.",
    icon: (
      <svg className="w-8 h-8 text-[#002B5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  unitType: {
    title: "How many bedrooms do you need?",
    description: "Select the BHK size that perfectly fits your family.",
    icon: (
      <svg className="w-8 h-8 text-[#002B5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  priceRange: {
    title: "Set a budget for your next home",
    description: "Only see properties that fall within your comfort zone.",
    icon: (
      <svg className="w-8 h-8 text-[#002B5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
};

export default function InlineFilterPrompt({ type }: InlineFilterPromptProps) {
  const { setFilter } = useSearchStore();
  const config = SEARCH_CONFIG.filters[type];
  const content = PROMPT_CONTENT[type];

  if (!config) return null;

  const handleOptionClick = (value: any) => {
    if (type === 'priceRange') {
       // value is a PresetOption {min, max}
       setFilter('minPrice', value.min);
       setFilter('maxPrice', value.max);
    } else {
       setFilter(type, value);
    }
  };

  // Extract options (limit to 4 for the card layout)
  const displayOptions = type === 'priceRange' 
    ? (config.presets || []).slice(0, 4)
    : (config.options || []).slice(0, 4);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300 mb-4 p-6 relative group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#002B5B]/[0.03] rounded-full blur-3xl group-hover:bg-[#002B5B]/[0.06] transition-colors"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-white">
          {content.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#002B5B] mb-1">{content.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{content.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {displayOptions.map((opt: any, idx: number) => {
               const value = type === 'priceRange' ? opt : opt.value;
               return (
                 <button
                   key={idx}
                   onClick={() => handleOptionClick(value)}
                   className="px-4 py-2 bg-white text-sm font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-[#002B5B] hover:text-[#002B5B] hover:bg-blue-50/50 transition-all shadow-sm"
                 >
                   {opt.label}
                 </button>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
