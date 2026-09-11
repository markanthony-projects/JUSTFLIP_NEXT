'use client';

import React, { useState } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SortDropdown from './SortDropdown';
import { BsList, BsMap } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa';
import { LuSlidersHorizontal } from 'react-icons/lu';
import SaveSearchModal from './SaveSearchModal';

export default function ResultsHeader() {
  const { total, query, toggleFilterSheet, viewMode, setViewMode, filters } = useSearchStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Count active filters for mobile badge
  const activeFilterCount = Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '').length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 mb-2">
      <div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {total > 0 ? `${total.toLocaleString()} Properties` : 'Search Results'}
          </h1>
          {query && (
            <span className="text-xs sm:text-sm text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
              in &ldquo;{query}&rdquo;
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
        {/* Save Search Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-primary hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <FaRegBell className="w-3.5 h-3.5" />
          <span>Save Search</span>
        </button>

        {/* List / Map Switcher (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white shadow-xs text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BsList className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white shadow-xs text-slate-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BsMap className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>

        {/* Sort Dropdown (Desktop) */}
        <div className="hidden lg:block">
          <SortDropdown />
        </div>
      </div>

      <SaveSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
