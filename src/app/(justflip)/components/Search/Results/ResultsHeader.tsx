import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SortDropdown from './SortDropdown';

import { BsList, BsMap } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa';
import SaveSearchModal from './SaveSearchModal';

export default function ResultsHeader() {
  const { total, query, toggleFilterSheet, viewMode, setViewMode } = useSearchStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 mb-4">
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
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-[#002B5B] rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <FaRegBell className="w-3.5 h-3.5" />
          Save Search
        </button>

        <button 
          onClick={toggleFilterSheet}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </button>

        <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BsList className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BsMap className="w-4 h-4" />
            Map
          </button>
        </div>

        <SortDropdown />
      </div>

      <SaveSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
