import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSearchStore } from '@/src/stores/search.store';
import { useRecentSearchesStore } from '@/src/stores/recentSearches.store';
import { useDebounce } from '@/src/hooks/useDebounce';
import AutocompletePanel from './AutocompletePanel';

export default function SearchBarEnhanced() {
  const { query, setQuery } = useSearchStore();
  const { addSearch } = useRecentSearchesStore();
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Sync local state when store query changes (e.g. from URL)
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setQuery(localQuery.trim());
      addSearch(localQuery.trim());
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-4xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full h-12 lg:h-14 bg-white rounded-lg border-2 transition-colors duration-200 ${
          isFocused ? 'border-[#002B5B] shadow-lg' : 'border-gray-300 hover:border-gray-400 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-center w-12 text-gray-400">
          <FaSearch className="text-lg" />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search projects, builders, or locations..."
          className="flex-1 h-full bg-transparent border-none focus:ring-0 text-gray-900 text-sm md:text-base outline-none pr-4"
        />

        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className="h-full px-6 md:px-8 bg-[#002B5B] hover:bg-[#001f42] text-white font-medium rounded-r-[6px] transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </form>

      {/* Dropdown panel for suggestions & recent searches */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <AutocompletePanel 
            currentInput={localQuery} 
            onSelect={(selectedQuery) => {
              setLocalQuery(selectedQuery);
              setQuery(selectedQuery);
              addSearch(selectedQuery);
              setIsFocused(false);
            }} 
          />
        </div>
      )}
    </div>
  );
}
