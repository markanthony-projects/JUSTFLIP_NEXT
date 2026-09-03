'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/src/stores/search.store';

export function useSearchQuery(initialSeoFilters: Record<string, any> | null = null) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHydrating = useRef(false);
  const isInitial = useRef(true);
  
  const { hydrateFromUrl, toSearchParams, query, filters, sort, page } = useSearchStore();

  const searchParamsString = searchParams ? searchParams.toString() : '';

  // URL → Store (on mount and when searchParams change in URL)
  useEffect(() => {
    isHydrating.current = true;
    hydrateFromUrl(searchParams, initialSeoFilters);
    isInitial.current = false;
    
    // Reset hydrating flag so store-to-URL doesn't overwrite
    const timer = setTimeout(() => {
      isHydrating.current = false;
    }, 50);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  // Store → URL (when state changes from user interaction inside search UI)
  useEffect(() => {
    if (isInitial.current || isHydrating.current) return;
    
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
    if (queryString !== searchParamsString) {
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(filters), sort, page, pathname, router]);
}