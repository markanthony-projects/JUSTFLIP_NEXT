'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiMenuAlt4 } from 'react-icons/hi';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { useCityStore } from '@/src/stores/city.store';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';
import DesktopMoreFiltersModal from './DesktopMoreFiltersModal';
import { FiSearch, FiX } from 'react-icons/fi';

export default function HorizontalFilterBar() {
  const { activeCity, setActiveCity } = useCityStore();
  const { query, setQuery, toggleSearchModal } = useSearchStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState(query || '');

  useEffect(() => {
    setLocalQuery(query || '');
  }, [query]);

  // Close dropdown when scrolling
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 10) {
        setActiveDropdown(null);
        lastScrollY = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Close dropdown when clicking outside
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => prev === key ? null : key);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(localQuery.trim());
  };

  return (
    <div
      ref={barRef}
      className="w-full bg-[#002B5B] h-14 z-40 relative shadow-xs"
    >
      <div
        onScroll={() => setActiveDropdown(null)}
        className="pl-0 pr-2.5 sm:px-6 flex items-center gap-1.5 sm:gap-3 flex-nowrap overflow-x-auto lg:overflow-visible no-scrollbar h-full w-full max-w-7xl mx-auto"
      >
        {/* Mobile Header Filter Button (Pinned at Most Left Part) */}
        <div className="sticky left-0 z-30 bg-[#002B5B] pl-1.5 pr-1.5 flex items-center shrink-0 lg:hidden h-full">
          <button
            onClick={toggleSearchModal}
            aria-label="Open search filters"
            className="flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer border border-white/20 shrink-0"
          >
            <LuSlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* City & Search Box Pill */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex shrink-0 items-center bg-white rounded-xl px-2.5 py-1 h-9.5 shadow-2xs w-[170px] xs:w-[195px] sm:w-auto sm:min-w-[240px] md:min-w-[280px]"
        >
          {activeCity ? (
            <div
              className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-0.5 mr-1.5 shrink-0 text-slate-800 text-xs font-semibold"
              title={activeCity.name}
            >
              <span>
                {activeCity.name.length > 5 ? `${activeCity.name.slice(0, 5)}...` : activeCity.name}
              </span>
              <button
                type="button"
                onClick={() => setActiveCity(null)}
                className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
                title="Clear City"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={activeCity ? "Locality / Project" : "Search..."}
            className="flex-1 bg-transparent border-none text-xs focus:outline-none text-slate-700 placeholder-slate-400 min-w-0"
          />

          <button
            type="submit"
            aria-label="Search"
            className="text-slate-400 hover:text-[#002B5B] transition-colors p-1 cursor-pointer"
          >
            <FiSearch className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Filter Pills */}
        <FilterPill
          configKey="priceRange"
          label="Budget"
          isOpen={activeDropdown === 'priceRange'}
          onToggle={() => toggleDropdown('priceRange')}
        />
        <FilterPill
          configKey="propertyType"
          label="Property Type"
          isOpen={activeDropdown === 'propertyType'}
          onToggle={() => toggleDropdown('propertyType')}
        />
        <FilterPill
          configKey="unitType"
          label="BHK"
          isOpen={activeDropdown === 'unitType'}
          onToggle={() => toggleDropdown('unitType')}
        />
        <FilterPill
          configKey="uploader"
          label="Posted By"
          isOpen={activeDropdown === 'uploader'}
          onToggle={() => toggleDropdown('uploader')}
        />

        {/* More Filters Modal */}
        <div className="relative ml-auto shrink-0 hidden md:block">
          <button
            onClick={() => toggleDropdown('moreFilters')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-3.5 h-9.5 text-xs font-semibold transition-colors cursor-pointer"
          >
            <HiMenuAlt4 className="text-white/80 w-4 h-4" />
            <span>More Filters</span>
            <HiChevronDown
              className={`w-3.5 h-3.5 text-white/80 transition-transform ${
                activeDropdown === 'moreFilters' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <DesktopMoreFiltersModal
            isOpen={activeDropdown === 'moreFilters'}
            onClose={() => toggleDropdown('moreFilters')}
          />
        </div>
      </div>
    </div>
  );
}

interface FilterPillProps {
  configKey: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FilterPill({ configKey, label, isOpen, onToggle }: FilterPillProps) {
  const { filters } = useSearchStore();
  const config = SEARCH_CONFIG.filters[configKey];

  const isActive =
    !!filters[configKey] ||
    (configKey === 'priceRange' && (!!filters.minPrice || !!filters.maxPrice));

  return (
    <div className="relative shrink-0">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 h-9.5 text-xs font-semibold transition-colors cursor-pointer border ${
          isActive
            ? 'bg-white text-[#002B5B] border-white shadow-2xs font-bold'
            : 'bg-white/10 text-white hover:bg-white/20 border-white/15'
        }`}
      >
        <span>{label}</span>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></div>}
        <HiChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isActive ? 'text-[#002B5B]' : 'text-white/70'
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="fixed top-[60px] left-4 right-4 w-auto lg:absolute lg:top-[calc(100%+8px)] lg:left-0 lg:right-auto lg:min-w-[300px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="relative z-10 max-h-[380px] overflow-y-auto p-4">
            <FilterFactory config={config} onClose={onToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
