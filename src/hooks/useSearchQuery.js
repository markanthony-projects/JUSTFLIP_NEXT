'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export function useSearchQuery(initialSeoFilters = null) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitial = useRef(true);
  
  const { hydrateFromUrl, toSearchParams, query, filters, sort, page } = useSearchStore();

  // On mount: URL → Store
  useEffect(() => {
    // If it's an SEO route, we skip hydrating from empty URL searchParams for the ones already in seoFilters
    hydrateFromUrl(searchParams, initialSeoFilters);
    isInitial.current = false;
  }, []); // Only on mount

  // On state change: Store → URL (skip initial)
  useEffect(() => {
    if (isInitial.current) return;
    
    const params = toSearchParams();

    // Remove params that are already part of the SEO URL to keep URL clean
    if (initialSeoFilters) {
      if (initialSeoFilters.search && params.get('q') === initialSeoFilters.search) {
        params.delete('q');
      }
      if (initialSeoFilters.propertyType && params.get('propertyType') === initialSeoFilters.propertyType) {
        params.delete('propertyType');
      }
      if (initialSeoFilters.bhk && params.get('bhk') === String(initialSeoFilters.bhk)) {
        params.delete('bhk');
      }
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Only replace if it actually changes the query string, avoid loops
    router.replace(newUrl, { scroll: false });
  }, [query, JSON.stringify(filters), sort, page]);
}