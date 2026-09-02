import { create } from 'zustand';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';
import { Project } from '@/src/types';
import { useCityStore } from './city.store';

export interface SearchState {
  // ── Query State ──
  query: string;
  filters: Record<string, any>;
  sort: string;
  page: number;
  limit: number;

  // ── Results State ──
  results: Project[];
  total: number;
  totalPages: number;
  hasMore: boolean;
  facets: any | null;

  // ── UI State ──
  isLoading: boolean;
  isLoadingMore: boolean;
  isInitialized: boolean;
  error: string | null;
  isFilterOpen: boolean;
  isSearchModalOpen: boolean;
  viewMode: 'list' | 'map';
}

export interface SearchActions {
  setQuery: (query: string) => void;
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  
  setResults: (data: { results: Project[]; total: number; totalPages: number; hasMore: boolean; facets?: any }) => void;
  appendResults: (data: { results: Project[]; hasMore: boolean; totalPages: number; total?: number }) => void;

  setLoading: (isLoading: boolean) => void;
  setLoadingMore: (isLoadingMore: boolean) => void;
  setError: (error: string | null) => void;
  toggleFilterSheet: () => void;
  toggleSearchModal: () => void;
  closeSearchModal: () => void;
  setViewMode: (mode: 'list' | 'map') => void;

  hydrateFromUrl: (searchParams: URLSearchParams | any, initialSeoFilters?: Record<string, any> | null) => void;
  toSearchParams: () => URLSearchParams;
}

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  // ── Query State ──
  query: '',
  filters: {},           // { propertyType: 'apartment', minPrice: 1000000, ... }
  sort: 'relevance',
  page: 1,
  limit: SEARCH_CONFIG.defaultLimit || 10,

  // ── Results State ──
  results: [],
  total: 0,
  totalPages: 0,
  hasMore: false,
  facets: null,

  // ── UI State ──
  isLoading: false,
  isLoadingMore: false,
  isInitialized: false,
  error: null,
  isFilterOpen: false,   // Mobile filter sheet
  isSearchModalOpen: false, // Mobile full-screen search modal
  viewMode: 'list',

  // ── Actions ──
  setQuery: (query) => set({ query, page: 1 }),
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    page: 1,  // Reset to page 1 when filter changes
  })),
  
  removeFilter: (key) => set((state) => {
    const { [key]: _, ...rest } = state.filters;
    return { filters: rest, page: 1 };
  }),
  
  clearFilters: () => set({ filters: {}, page: 1 }),
  
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  
  setResults: (data) => set({
    results: data.results,
    total: data.total,
    totalPages: data.totalPages,
    hasMore: data.hasMore,
    facets: data.facets || null,
    isLoading: false,
    isInitialized: true,
    error: null,
  }),
  
  appendResults: (data) => set((state) => ({
    results: [...state.results, ...data.results],
    hasMore: data.hasMore,
    totalPages: data.totalPages,
    total: data.total !== undefined ? data.total : state.total,
    isLoading: false,
    isLoadingMore: false,
    isInitialized: true,
    error: null,
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
  setError: (error) => set({ error, isLoading: false, isLoadingMore: false }),
  toggleFilterSheet: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  setViewMode: (mode) => set({ viewMode: mode }),

  // Hydrate from URL params
  hydrateFromUrl: (searchParams, initialSeoFilters = null) => {
    let query = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'relevance';
    const page = 1; // Infinite scroll feeds always start from page 1 on fresh load/reload
    
    const filters: Record<string, any> = {};
    const filterKeys = Object.keys(SEARCH_CONFIG.filters);
    filterKeys.forEach((key) => {
      const config = SEARCH_CONFIG.filters[key];
      if (config.type === 'range') {
        const min = searchParams.get(config.apiParamMin || '');
        const max = searchParams.get(config.apiParamMax || '');
        if (min) filters.minPrice = Number(min);
        if (max) filters.maxPrice = Number(max);
      } else {
        const val = searchParams.get(config.apiParam || key);
        if (val) filters[key] = val;
      }
    });

    const cityId = searchParams.get('cityId');
    const zoneId = searchParams.get('zoneId');
    const locationId = searchParams.get('locationId');
    if (cityId) filters.cityId = cityId;
    if (zoneId) filters.zoneId = zoneId;
    if (locationId) filters.locationId = locationId;

    if (cityId) {
      const cityStore = useCityStore.getState();
      if (cityStore.activeCity?.id !== cityId) {
        const matchingCity = cityStore.cityList.find((c) => c.id === cityId);
        if (matchingCity) {
          cityStore.setActiveCity(matchingCity);
        } else {
          cityStore.setActiveCity({ id: cityId, name: '' } as any);
        }
      }
    }

    if (initialSeoFilters) {
      if (!query && initialSeoFilters.search) query = initialSeoFilters.search;
      if (!filters.propertyType && initialSeoFilters.propertyType) filters.propertyType = initialSeoFilters.propertyType;
      if (!filters.bhk && initialSeoFilters.bhk) filters.bhk = initialSeoFilters.bhk;
    }

    set({ query, filters, sort, page });
  },

  // Generate URL search params from state
  toSearchParams: () => {
    const { query, filters, sort } = get();
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (sort !== 'relevance') params.set('sort', sort);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const config = SEARCH_CONFIG.filters[key];
        if (config) {
          params.set(config.apiParam || key, String(value));
        } else {
          // For minPrice, maxPrice which are derived from priceRange
          params.set(key, String(value));
        }
      }
    });
    
    return params;
  },
}));
