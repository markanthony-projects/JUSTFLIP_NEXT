import React, { useEffect } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';

export default function MobileFilterSheet() {
  const { isFilterOpen, toggleFilterSheet, clearFilters, filters, total } = useSearchStore();
  const hasFilters = Object.keys(filters).length > 0;

  // Prevent background scrolling when sheet is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isFilterOpen]);

  if (!isFilterOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity"
        onClick={toggleFilterSheet}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-2xl lg:hidden flex flex-col max-h-[90vh] shadow-2xl animate-slide-up">
        
        {/* Drag handle */}
        <div className="w-full flex justify-center py-3" onClick={toggleFilterSheet}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button 
            onClick={toggleFilterSheet}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-thin">
          {Object.values(SEARCH_CONFIG.filters).map((config) => (
            <FilterFactory key={config.key} config={config} />
          ))}
        </div>

        {/* Sticky Footer Actions */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-white border-t border-gray-200 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={clearFilters}
            disabled={!hasFilters}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-colors ${
              hasFilters 
                ? 'border-[#002B5B] text-[#002B5B] hover:bg-blue-50' 
                : 'border-gray-200 text-gray-400 bg-gray-50'
            }`}
          >
            Clear All
          </button>
          
          <button 
            onClick={toggleFilterSheet}
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-[#002B5B] text-white hover:bg-[#001f42] shadow-lg shadow-blue-900/20"
          >
            Show {total} Results
          </button>
        </div>
      </div>
    </>
  );
}
