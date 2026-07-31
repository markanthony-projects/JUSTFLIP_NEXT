'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiMenuAlt4 } from 'react-icons/hi';
import { useCityStore } from '@/src/stores/city.store';
import { useSearchStore } from '@/src/stores/search.store';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';

export default function HorizontalFilterBar() {
  const { activeCity, setActiveCity } = useCityStore();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      // const maxScroll = 300;
      // const current = Math.min(window.scrollY, maxScroll);

      // const newScale = 1 + current / maxScroll * 0.2; // 1 → 1.2
      console.log(window.scrollY);
      setExpanded(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  
  // Close dropdown when clicking outside
  const barRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setActiveDropdown(prev => prev === key ? null : key);
  };

  return (
    <div style={{ transform: `scale(${expanded})` }}
      ref={barRef} 
      className={`border-t border-gray-400  w-screen left-1/2 -translate-x-1/2 
      bg-[#002B5B] py-3 px-4 hidden lg:flex items-center gap-3 flex-wrap z-50 
      relative transition-all duration-300 origin-top top-0  ${
      expanded ? "py-6" : "py-2"}`}
    >
      
      {/* Location / Search Box */}
      <div className="flex items-center bg-white rounded-full px-4 py-1.5 h-10 shadow-sm min-w-75">
        <button className="flex items-center gap-2 text-gray-800 text-sm font-medium hover:text-[#002B5B] transition-colors">
          Buy <HiChevronDown className="text-[#002B5B]" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-3"></div>
        <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-0.5 mr-2">
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
        configKey="bhk" 
        label="BHK" 
        isOpen={activeDropdown === 'bhk'} 
        onToggle={() => toggleDropdown('bhk')} 
      />
      <FilterPill 
        configKey="uploader" 
        label="Posted By" 
        isOpen={activeDropdown === 'uploader'} 
        onToggle={() => toggleDropdown('uploader')} 
      />
      
      {/* More Filters */}
      <div className="relative ml-auto">
        <button 
          onClick={() => toggleDropdown('furnishing')}
          className="flex items-center gap-2 bg-white rounded-full px-4 h-10 text-sm font-medium text-gray-800 hover:shadow-md transition-shadow border border-white"
        >
          <HiMenuAlt4 className="text-gray-600" />
          More Filters
          <HiChevronDown className={`text-[#002B5B] transition-transform ${activeDropdown === 'furnishing' ? 'rotate-180' : ''}`} />
        </button>
        {activeDropdown === 'furnishing' && (
          <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 min-w-[320px] z-[60]">
            {/* Tooltip Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
            
            <div className="relative z-10 bg-white rounded-xl overflow-hidden max-h-[400px] overflow-y-auto p-5">
              <FilterFactory config={SEARCH_CONFIG.filters['furnishing']} onClose={() => toggleDropdown('furnishing')} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function FilterPill({ configKey, label, isOpen, onToggle }) {
  const { filters } = useSearchStore();
  const config = SEARCH_CONFIG.filters[configKey];
  
  // Check if this filter is active
  const isActive = !!filters[configKey] || (configKey === 'priceRange' && (!!filters.minPrice || !!filters.maxPrice));

  return (
    <div className="relative">
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
        <div className="absolute top-[calc(100%+12px)] left-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 min-w-[320px] z-[60]">
          {/* Tooltip Arrow */}
          <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
          
          <div className="relative z-10 bg-white rounded-xl overflow-hidden max-h-[400px] overflow-y-auto p-5">
            <FilterFactory config={config} onClose={onToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
