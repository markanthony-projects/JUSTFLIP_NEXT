'use client';
import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { useSearchQuery } from '@/src/hooks/useSearchQuery';
import { PortalSearchAdapter } from '@/src/services/search/adapters/PortalSearchAdapter';

import SearchBarEnhanced from './SearchBar/SearchBarEnhanced';
import SearchResultsList from './Results/SearchResultsList';
import ResultsHeader from './Results/ResultsHeader';
import FilterPanel from './Filters/FilterPanel';
import MobileFilterSheet from './Filters/MobileFilterSheet';
import FilterChips from './Filters/FilterChips';
import SearchBreadcrumb from './SEO/SearchBreadcrumb';

const adapter = new PortalSearchAdapter();

export default function SearchPageClient({ initialSearchParams, initialSeoFilters }) {
  // Sync URL to Store (Hook handles this)
  useSearchQuery(initialSeoFilters); // Pass seoFilters to hook if needed

  const { 
    query, filters, sort, page, limit, 
    setResults, setLoading, setError, setFilter, setQuery
  } = useSearchStore();

  const isFirstRender = useRef(true);

  // Inject SEO filters on mount
  useEffect(() => {
    if (initialSeoFilters) {
      console.log('[SearchPageClient] SEO Filters Detected:', initialSeoFilters);
      if (initialSeoFilters.search) setQuery(initialSeoFilters.search);
      if (initialSeoFilters.propertyType) setFilter('propertyType', initialSeoFilters.propertyType);
      if (initialSeoFilters.bhk) setFilter('bhk', initialSeoFilters.bhk);
    } else {
      console.log('[SearchPageClient] No initial SEO filters present.');
    }
  }, [initialSeoFilters]);

  // Trigger search on state changes
  useEffect(() => {
    // Skip first render if we wanted to rely on server data, 
    // but for now let's just fetch client-side on mount
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adapter.search({ query, filters, sort, page, limit });
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results. Please try again.');
      }
    };

    fetchResults();

    return () => {
      adapter.abort();
    };
  }, [query, JSON.stringify(filters), sort, page, limit]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Sticky Search Bar Area */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <SearchBarEnhanced />
          <div className="mt-4">
            <FilterChips />
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-6 flex-1 flex gap-6">
        
        {/* Left Sidebar (Desktop Filters) */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-[140px]">
            <FilterPanel />
          </div>
        </aside>

        {/* Right Content Area (Results) */}
        <main className="flex-1 min-w-0 flex flex-col">
          <SearchBreadcrumb query={query} />
          <ResultsHeader />
          
          <div className="mt-4 flex-1">
            <SearchResultsList />
          </div>
        </main>
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet />
    </div>
  );
}
