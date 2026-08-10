'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiMenuAlt4 } from 'react-icons/hi';
import { LuSlidersHorizontal } from 'react-icons/lu';
import { useCityStore } from '@/src/stores/city.store';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';
import DesktopMoreFiltersModal from './DesktopMoreFiltersModal';

export default function HorizontalFilterBar() {
  const { activeCity, setActiveCity } = useCityStore();
  const { toggleFilterSheet, toggleSearchModal } = useSearchStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = (e: Event) => {
      setExpanded(window.scrollY > 70);
      
      // If the actual window scroll position changes, the user is scrolling the main page
      if (Math.abs(window.scrollY - lastScrollY) > 5) {
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

  return (
    <div ref={barRef} 
      className={`border-t border-gray-400 w-screen left-1/2 -translate-x-1/2 
      bg-[#002B5B] h-15 z-50 relative transition-all duration-300 origin-top top-0`}
    >
      <div 
        onScroll={() => setActiveDropdown(null)}
        className="px-4 flex items-center gap-2 sm:gap-3 flex-nowrap lg:flex-wrap overflow-x-auto lg:overflow-visible no-scrollbar h-full w-full relative"
      >
      
      {/* Mobile Sticky Filter Button */}
      <div className="sticky -left-4 z-20 bg-[#002B5B] pr-2 -ml-4 flex items-center shrink-0 md:hidden h-full">
        <button 
          onClick={toggleSearchModal}
          className="flex items-center justify-center ml-2 w-10 h-10 bg-gray-100 rounded-[10px] border border-gray-200 text-gray-800 hover:shadow-md transition-shadow"
        >
          <LuSlidersHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* City & Search Box Pill */}
      <div className="flex shrink-0 items-center bg-white rounded-full px-2 py-1.5 h-10 shadow-sm min-w-40 md:min-w-75">
        <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-0.5 mr-2 ml-1">
          <span className="text-sm text-gray-700">{activeCity ? activeCity.name : 'Select City'}</span>
          {activeCity && (
            <button onClick={() => setActiveCity(null)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
          )}
        </div>
        <input 
          type="text" 
          placeholder="Add More" 
          className="flex-1 bg-transparent border-none text-sm focus:outline-none text-gray-600 placeholder-gray-400 w-24"
        />
      </div>

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
      
      {/* More Filters */}
      <div className="relative ml-auto shrink-0 hidden md:block">
        <button 
          onClick={() => toggleDropdown('moreFilters')}
          className="flex items-center gap-2 bg-white rounded-full px-4 h-10 text-sm font-medium text-gray-800 hover:shadow-md transition-shadow border border-white"
        >
          <HiMenuAlt4 className="text-gray-600" />
          More Filters
          <HiChevronDown className={`text-[#002B5B] transition-transform ${activeDropdown === 'moreFilters' ? 'rotate-180' : ''}`} />
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
  
  // Check if this filter is active
  const isActive = !!filters[configKey] || (configKey === 'priceRange' && (!!filters.minPrice || !!filters.maxPrice));

  return (
    <div className="relative shrink-0">
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium transition-all border ${
          isActive 
            ? 'bg-blue-50 text-[#002B5B] border-blue-200 shadow-inner' 
            : 'bg-white text-gray-800 hover:shadow-md border-white'
        }`}
      >
        {label}
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-[#002B5B] ml-1"></div>
        )}
        <HiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#002B5B]' : 'text-gray-400'}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="fixed top-[64px] left-4 right-4 w-auto lg:absolute lg:top-[calc(100%+12px)] lg:left-0 lg:right-auto lg:min-w-[320px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 z-[60]">
          {/* Tooltip Arrow */}
          <div className="hidden lg:block absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
          
          <div className="relative z-10 bg-white rounded-xl overflow-hidden max-h-[400px] overflow-y-auto p-5">
            <FilterFactory config={config} onClose={onToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
