'use client';
import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import { useCityStore } from '@/src/stores/city.store';
import { useSearchQuery } from '@/src/hooks/useSearchQuery';
import { PortalSearchAdapter } from '@/src/services/search/adapters/PortalSearchAdapter';


import SearchResultsList from './Results/SearchResultsList';
import ResultsHeader from './Results/ResultsHeader';
import SearchMapView from './Results/SearchMapView';
import FilterPanel from './Filters/FilterPanel';
import MobileFilterSheet from './Filters/MobileFilterSheet';
import FilterChips from './Filters/FilterChips';
import HorizontalFilterBar from './Filters/HorizontalFilterBar';
import SearchBreadcrumb from './SEO/SearchBreadcrumb';

const adapter = new PortalSearchAdapter();

interface SearchPageClientProps {
  initialSearchParams?: Record<string, string | string[] | undefined>;
  initialSeoFilters?: {
    search?: string;
    propertyType?: string;
    bhk?: string;
    [key: string]: any;
  };
}

export default function SearchPageClient({ initialSearchParams, initialSeoFilters }: SearchPageClientProps) {
  // Sync URL to Store (Hook handles this)
  useSearchQuery(initialSeoFilters); // Pass seoFilters to hook if needed

  const { 
    query, filters, sort, page, limit, viewMode,
    setResults, setLoading, setError, setFilter, setQuery
  } = useSearchStore();

  const isMapMode = viewMode === 'map';

  const { activeCity } = useCityStore();

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
  }, [query, JSON.stringify(filters), sort, page, limit, activeCity?.id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className={
        isMapMode 
          ? "w-full max-w-[1920px] mx-auto px-0 py-0 flex-1 flex flex-col lg:flex-row relative" 
          : "container mx-auto px-4 lg:px-8 max-w-7xl py-6 flex-1 flex gap-6"
      }>
        
        {/* Left Sidebar (Desktop Filters) - Only in List Mode */}
        {!isMapMode && (
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[140px]">
              <FilterPanel />
            </div>
          </aside>
        )}

        {/* Right Content Area (Results) */}
        <main className={
          isMapMode 
            ? "flex-1 min-w-0 flex flex-col lg:w-1/2 lg:max-w-[700px] xl:max-w-[850px] px-4 lg:px-6 py-6" 
            : "flex-1 min-w-0 flex flex-col"
        }>
          <SearchBreadcrumb query={query} />
          <ResultsHeader />
          
          <div className="mt-4 flex-1">
            <SearchResultsList />
          </div>
        </main>

        {/* Map Area */}
        {isMapMode && (
          <div className="hidden lg:block flex-1 bg-gray-100 relative">
            <SearchMapView />
          </div>
        )}
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet />
    </div>
  );
}
