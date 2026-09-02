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
    setResults, setLoading, setError, setFilter, setQuery, appendResults, setLoadingMore
  } = useSearchStore();

  const isMapMode = viewMode === 'map';

  const { activeCity } = useCityStore();

  const isFirstRender = useRef(true);

  // Inject SEO filters on mount
  useEffect(() => {
    if (!isFirstRender.current) return;
    isFirstRender.current = false;

    if (initialSeoFilters) {
      console.log('[SearchPageClient] SEO Filters Detected:', initialSeoFilters);
      if (initialSeoFilters.search) setQuery(initialSeoFilters.search);
      if (initialSeoFilters.propertyType) setFilter('propertyType', initialSeoFilters.propertyType);
      if (initialSeoFilters.bhk) setFilter('bhk', initialSeoFilters.bhk);
    } else {
      console.log('[SearchPageClient] No initial SEO filters present.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger search on state changes
  useEffect(() => {
    // Skip first render if we wanted to rely on server data, 
    // but for now let's just fetch client-side on mount
    const fetchResults = async () => {
      const isInitialOrEmpty = page === 1 || useSearchStore.getState().results.length === 0;
      if (isInitialOrEmpty) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        const data = await adapter.search({ query, filters, sort, page, limit });
        if (isInitialOrEmpty) {
          setResults(data);
        } else {
          appendResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results. Please try again.');
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchResults();

    return () => {
      adapter.abort();
    };
  }, [query, JSON.stringify(filters), sort, page, limit, activeCity?.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className={
        isMapMode 
          ? "w-full max-w-[1920px] mx-auto px-0 py-0 flex-1 flex flex-col lg:flex-row relative" 
          : "container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl pt-2 pb-6 flex-1 flex gap-6"
      }>
        
        {/* Left Sidebar (Desktop Filters & Breadcrumb) - Only in List Mode */}
        {!isMapMode && (
          <aside className="hidden lg:block w-[340px] shrink-0">
            <div className="sticky top-[68px] space-y-2">
              <SearchBreadcrumb query={query} />
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
          {/* Mobile-only breadcrumb above results */}
          {!isMapMode && (
            <div className="lg:hidden mb-2">
              <SearchBreadcrumb query={query} />
            </div>
          )}

          
          <div className="mt-2 flex-1">
            <ResultsHeader />
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
