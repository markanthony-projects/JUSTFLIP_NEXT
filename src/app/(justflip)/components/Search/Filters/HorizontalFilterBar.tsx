'use client';

import React, { useState, useEffect } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { useCityStore } from '@/src/stores/city.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { FiSearch, FiCheck } from 'react-icons/fi';
import { BiMicrophone } from 'react-icons/bi';
import { LuSlidersHorizontal, LuArrowUpDown } from 'react-icons/lu';
import { HiOutlineX } from 'react-icons/hi';

export default function HorizontalFilterBar() {
  const { query, setQuery, toggleSearchModal, toggleFilterSheet, sort, setSort, filters } = useSearchStore();
  const { activeCity } = useCityStore();
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Determine display label for the yellow badge
  const chipLabel = query
    ? (query.length > 15 ? `${query.slice(0, 15)}..` : query)
    : activeCity?.name
    ? activeCity.name
    : 'All Localities';

  // Prevent background scroll when Sort sheet is open
  useEffect(() => {
    if (isSortSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSortSheetOpen]);

  // Voice Search Handler
  const handleVoiceSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toggleSearchModal();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        toggleSearchModal();
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          setQuery(transcript.trim());
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
      toggleSearchModal();
    }
  };

  const hasActiveFilters = Object.values(filters || {}).some(
    (v) => v !== undefined && v !== null && v !== ''
  );

  return (
    <>
      {/* Mobile Top Search Bar Header */}
      <div className="w-full bg-primary px-3 py-2.5 flex items-center gap-2 shadow-sm">
        {/* 1. Search Box Container */}
        <div
          onClick={toggleSearchModal}
          role="button"
          tabIndex={0}
          aria-label="Search properties or localities"
          className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg px-2.5 h-10 min-w-0 cursor-pointer hover:border-gray-400 active:scale-[0.99] transition-all"
        >
          {/* Magnifying Glass Search Icon */}
          <FiSearch className="w-4 h-4 text-gray-400 shrink-0 mr-1.5" />

          {/* Primary Theme Locality/City Chip */}
          <div className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 truncate max-w-[125px] xs:max-w-[145px]">
            {chipLabel}
          </div>

          {/* Add More Placeholder Text */}
          <span className="text-xs text-gray-400 ml-2 truncate select-none">
            Add More
          </span>

          {/* Microphone Icon on Right */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            aria-label="Voice Search"
            className={`ml-auto p-1 rounded-full text-gray-700 hover:text-primary transition-colors shrink-0 ${
              isListening ? 'text-rose-500 animate-pulse bg-rose-50' : ''
            }`}
          >
            <BiMicrophone className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* 2. Filters Button */}
        <button
          type="button"
          onClick={toggleFilterSheet}
          aria-label="Open Filters"
          className="relative flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg w-11 h-10 shrink-0 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all shadow-2xs"
        >
          <div className="relative">
            <LuSlidersHorizontal className="w-3.5 h-3.5 text-gray-800" />
            {/* Dot on top-right in primary theme */}
            <span
              className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-1 ring-white"
            />
          </div>
          <span className="text-[9px] font-medium text-gray-700 leading-none mt-1">
            Filters
          </span>
        </button>

        {/* 3. Sort By Button */}
        <button
          type="button"
          onClick={() => setIsSortSheetOpen(true)}
          aria-label="Open Sort Options"
          className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg w-11 h-10 shrink-0 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all shadow-2xs"
        >
          <LuArrowUpDown className="w-3.5 h-3.5 text-gray-800" />
          <span className="text-[9px] font-medium text-gray-700 leading-none mt-1">
            Sort By
          </span>
        </button>
      </div>

      {/* Mobile Sort By Bottom Sheet */}
      {isSortSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[110] transition-opacity"
            onClick={() => setIsSortSheetOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-2xl shadow-2xl p-4 animate-slide-up">
            <div
              className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 cursor-pointer"
              onClick={() => setIsSortSheetOpen(false)}
            />
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Sort Properties By</h3>
              <button
                type="button"
                onClick={() => setIsSortSheetOpen(false)}
                className="p-1.5 -mr-1 text-gray-500 hover:text-gray-800"
                aria-label="Close sort sheet"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 space-y-1">
              {SEARCH_CONFIG.sortOptions.map((opt) => {
                const isSelected = sort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSort(opt.value);
                      setIsSortSheetOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                        : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <FiCheck className="w-4 h-4 text-primary font-bold" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
