import React, { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';

export default function SortDropdown() {
  const { sort, setSort } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = SEARCH_CONFIG.sortOptions;
  const currentOption = options.find(o => o.value === sort) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 min-w-[160px] justify-between"
      >
        <span className="truncate">Sort by: {currentOption.label}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-40 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSort(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                sort === option.value ? 'text-[#002B5B] font-semibold bg-blue-50/50' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
