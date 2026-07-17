import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';

export default function FilterPanel() {
  const { clearFilters, filters } = useSearchStore();
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-[0px_0px_10px_1px_#dad6d6] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </h2>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs font-semibold text-[#002B5B] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
        {Object.values(SEARCH_CONFIG.filters).map((config) => (
          <FilterFactory key={config.key} config={config} />
        ))}
      </div>
    </div>
  );
}
