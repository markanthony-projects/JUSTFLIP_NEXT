import React, { useState, useEffect } from 'react';
import { useRecentSearchesStore } from '@/src/stores/recentSearches.store';
import { useDebounce } from '@/src/hooks/useDebounce';
import { PortalSearchAdapter } from '@/src/services/search/adapters/PortalSearchAdapter';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import { BsBuildingFillGear } from "react-icons/bs";
import { FaClock, FaFire } from 'react-icons/fa';

const adapter = new PortalSearchAdapter();

export default function AutocompletePanel({ currentInput, onSelect }) {
  const debouncedInput = useDebounce(currentInput, SEARCH_CONFIG.autocompleteDebounceMs);
  const { searches, removeSearch, clearSearches } = useRecentSearchesStore();
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!debouncedInput || debouncedInput.trim().length < 2) {
      setSuggestions(null);
      return;
    }

    let isMounted = true;
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const data = await adapter.suggest(debouncedInput.trim());
        if (isMounted) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
      adapter.abort();
    };
  }, [debouncedInput]);

  // View: Recent Searches (when no input)
  if (!currentInput.trim() || currentInput.trim().length < 2) {
    if (searches.length === 0) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              clearSearches();
            }}
            className="text-xs text-[#002B5B] hover:underline"
          >
            Clear All
          </button>
        </div>
        <ul className="py-2">
          {searches.map((item) => (
            <li key={item.timestamp} className="group flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div 
                className="flex items-center gap-3 flex-1"
                onMouseDown={() => onSelect(item.query)}
              >
                <FaClock className="text-gray-300" />
                <span className="text-sm text-gray-700">{item.query}</span>
              </div>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeSearch(item.query);
                }}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // View: Loading State
  if (isLoading && !suggestions) {
    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4 text-center">
        <div className="animate-pulse flex space-x-4 justify-center items-center">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // View: Suggestions
  if (suggestions) {
    const hasResults = suggestions.projects.length > 0 || suggestions.locations.length > 0 || suggestions.builders.length > 0;
    
    if (!hasResults) {
      return (
        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-500">No matching results found for "{currentInput}"</p>
          <p className="text-xs text-gray-400 mt-1">Try searching for a different location or project name</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden max-h-[400px] overflow-y-auto">
        {/* Projects */}
        {suggestions.projects.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 first:border-t-0">
              <span className="text-xs font-semibold text-gray-500 uppercase">Projects</span>
            </div>
            <ul>
              {suggestions.projects.map(p => (
                <li key={p.id} className="hover:bg-blue-50 cursor-pointer">
                  <div 
                    className="flex items-center gap-3 px-4 py-2.5"
                    onMouseDown={() => onSelect(p.name)}
                  >
                    <div className="bg-blue-100 p-2 rounded-full text-[#002B5B]">
                      <PiBuildingApartment />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.location?.name}, {p.city?.name}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Locations */}
        {suggestions.locations.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 first:border-t-0">
              <span className="text-xs font-semibold text-gray-500 uppercase">Locations</span>
            </div>
            <ul>
              {suggestions.locations.map(l => (
                <li key={l.id} className="hover:bg-blue-50 cursor-pointer">
                  <div 
                    className="flex items-center gap-3 px-4 py-2.5"
                    onMouseDown={() => onSelect(l.name)}
                  >
                    <div className="bg-red-100 p-2 rounded-full text-red-500">
                      <SlLocationPin />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{l.name}</p>
                      <p className="text-xs text-gray-500">{l.city?.name}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Builders */}
        {suggestions.builders.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 first:border-t-0">
              <span className="text-xs font-semibold text-gray-500 uppercase">Developers</span>
            </div>
            <ul>
              {suggestions.builders.map(b => (
                <li key={b.id} className="hover:bg-blue-50 cursor-pointer">
                  <div 
                    className="flex items-center gap-3 px-4 py-2.5"
                    onMouseDown={() => onSelect(b.name)}
                  >
                    <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                      <BsBuildingFillGear />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
}
