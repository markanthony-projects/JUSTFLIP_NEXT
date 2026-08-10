import React, { useState, useEffect, useRef } from 'react';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import FilterFactory from './FilterFactory';
import { useSearchStore } from '@/src/stores/search.store';

interface DesktopMoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DesktopMoreFiltersModal({ isOpen, onClose }: DesktopMoreFiltersModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { clearFilters } = useSearchStore();

  const filterList = Object.values(SEARCH_CONFIG.filters).filter(
    (config) => config.type !== 'hidden'
  );

  useEffect(() => {
    if (isOpen && filterList.length > 0 && !activeSection) {
      setActiveSection(filterList[0].key);
    }
  }, [isOpen, filterList, activeSection]);

  // Scrollspy logic
  useEffect(() => {
    const pane = rightPaneRef.current;
    if (!pane || !isOpen) return;

    const handleScroll = () => {
      let currentSection = filterList[0]?.key;
      for (const filter of filterList) {
        const el = sectionRefs.current[filter.key];
        if (el) {
          const rect = el.getBoundingClientRect();
          const paneRect = pane.getBoundingClientRect();
          // If the top of the section is near the top of the pane
          if (rect.top - paneRect.top <= 100) {
            currentSection = filter.key;
          }
        }
      }
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    pane.addEventListener('scroll', handleScroll);
    return () => pane.removeEventListener('scroll', handleScroll);
  }, [isOpen, filterList, activeSection]);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el && rightPaneRef.current) {
      rightPaneRef.current.scrollTo({
        top: el.offsetTop - rightPaneRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)] border border-gray-200 w-[750px] z-[60] flex flex-col text-left">
      {/* Tooltip Arrow */}
      <div className="absolute -top-2 right-12 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

      <div className="flex h-[450px] overflow-hidden rounded-t-xl relative z-10">
        {/* Left Sidebar */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50 overflow-y-auto">
          <ul className="py-2">
            {filterList.map((filter) => (
              <li key={filter.key}>
                <button
                  onClick={() => scrollToSection(filter.key)}
                  className={`w-full text-left px-5 py-3 text-sm transition-colors border-l-4 ${
                    activeSection === filter.key
                      ? 'border-[#002B5B] bg-white font-semibold text-[#002B5B]'
                      : 'border-transparent font-medium text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content Area */}
        <div
          ref={rightPaneRef}
          className="w-2/3 overflow-y-auto p-6 scroll-smooth bg-white"
        >
          {filterList.map((filter) => (
            <div
              key={filter.key}
              ref={(el) => { sectionRefs.current[filter.key] = el; }}
              className="mb-0 last:mb-0"
            >
              {/* <h3 className="text-[15px] font-bold text-gray-800 mb-4">
                {filter.label}
              </h3> */}
              <div className="px-1">
                <FilterFactory config={filter} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-white rounded-b-xl relative z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={clearFilters}
          className="text-[#002B5B] font-medium text-sm hover:underline px-2 py-1"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="bg-[#002B5B] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-blue-900 transition-colors shadow-md"
        >
          View Properties
        </button>
      </div>
    </div>
  );
}
