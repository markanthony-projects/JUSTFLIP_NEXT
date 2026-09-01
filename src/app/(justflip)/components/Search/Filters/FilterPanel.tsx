'use client';

import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';
import FilterChips from './FilterChips';
import { LuSlidersHorizontal } from 'react-icons/lu';

export default function FilterPanel() {
  const { clearFilters, filters } = useSearchStore();
  const activeCount = Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
        <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <LuSlidersHorizontal className="w-4 h-4 text-[#002B5B]" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#002B5B] text-white text-[11px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters inside sidebar on top of filters */}
      <FilterChips />

      <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
        {Object.values(SEARCH_CONFIG.filters).map((config) => (
          <FilterFactory key={config.key} config={config} />
        ))}
      </div>
    </div>
  );
}
