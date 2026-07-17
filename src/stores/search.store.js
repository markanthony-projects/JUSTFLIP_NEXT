import { create } from 'zustand';
import { SEARCH_CONFIG } from '@/src/services/search/searchConfig';

export const useSearchStore = create((set, get) => ({
  // ── Query State ──
  query: '',
  filters: {},           // { propertyType: 'apartment', minPrice: 1000000, ... }
  sort: 'relevance',
  page: 1,
  limit: SEARCH_CONFIG.defaultLimit,

  // ── Results State ──
  results: [],
  total: 0,
  totalPages: 0,
  hasMore: false,
  facets: null,

  // ── UI State ──
  isLoading: false,
  isLoadingMore: false,
  error: null,
  isFilterOpen: false,   // Mobile filter sheet

  // ── Actions ──
  setQuery: (query) => set({ query, page: 1 }),
  
  setFilter: (key, value) => set(state => ({
    filters: { ...state.filters, [key]: value },
    page: 1,  // Reset to page 1 when filter changes
  })),
  
  removeFilter: (key) => set(state => {
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
    facets: data.facets,
    isLoading: false,
    error: null,
  }),
  
  appendResults: (data) => set(state => ({
    results: [...state.results, ...data.results],
    hasMore: data.hasMore,
    totalPages: data.totalPages,
    isLoadingMore: false,
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
  setError: (error) => set({ error, isLoading: false }),
  toggleFilterSheet: () => set(state => ({ isFilterOpen: !state.isFilterOpen })),

  // Hydrate from URL params
  hydrateFromUrl: (searchParams, initialSeoFilters = null) => {
    let query = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    const filters = {};
    const filterKeys = Object.keys(SEARCH_CONFIG.filters);
    filterKeys.forEach(key => {
      const config = SEARCH_CONFIG.filters[key];
      if (config.type === 'range') {
        const min = searchParams.get(config.apiParamMin);
        const max = searchParams.get(config.apiParamMax);
        if (min) filters.minPrice = Number(min);
        if (max) filters.maxPrice = Number(max);
      } else {
        const val = searchParams.get(config.apiParam);
        if (val) filters[key] = val;
      }
    });

    if (initialSeoFilters) {
      if (!query && initialSeoFilters.search) query = initialSeoFilters.search;
      if (!filters.propertyType && initialSeoFilters.propertyType) filters.propertyType = initialSeoFilters.propertyType;
      if (!filters.bhk && initialSeoFilters.bhk) filters.bhk = initialSeoFilters.bhk;
    }

    set({ query, filters, sort, page });
  },

  // Generate URL search params from state
  toSearchParams: () => {
    const { query, filters, sort, page } = get();
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (sort !== 'relevance') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const config = SEARCH_CONFIG.filters[key];
        if (config) {
          params.set(config.apiParam || key, value);
        } else {
          // For minPrice, maxPrice which are derived from priceRange
          params.set(key, value);
        }
      }
    });
    
    return params;
  },
}));
