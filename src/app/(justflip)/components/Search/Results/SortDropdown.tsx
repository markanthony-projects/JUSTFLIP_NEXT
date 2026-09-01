'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export default function SortDropdown() {
  const { sort, setSort } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = SEARCH_CONFIG.sortOptions;
  const currentOption = options.find((o) => o.value === sort) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors justify-between min-w-[150px] cursor-pointer shadow-2xs"
      >
        <span className="truncate">Sort: {currentOption.label}</span>
        <FiChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-1 overflow-hidden"
        >
          {options.map((option) => {
            const isSelected = sort === option.value;
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setSort(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#002B5B] font-bold bg-blue-50/60'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <FiCheck className="w-3.5 h-3.5 text-[#002B5B]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
