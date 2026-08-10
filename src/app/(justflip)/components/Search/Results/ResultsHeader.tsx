import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SortDropdown from './SortDropdown';

export default function ResultsHeader() {
  const { total, query, toggleFilterSheet } = useSearchStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100 mb-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {total > 0 ? `${total} Results` : 'Search Results'}
        </h1>
        {query && (
          <p className="text-sm text-gray-500 mt-1">
            for "{query}"
          </p>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <button 
          onClick={toggleFilterSheet}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </button>

        <SortDropdown />
      </div>
    </div>
  );
}
