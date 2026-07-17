import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentSearchesStore = create(
  persist(
    (set, get) => ({
      searches: [],       // [{ query, timestamp, resultCount }]
      maxSearches: 10,
      
      addSearch: (query, resultCount = 0) => set(state => {
        const filtered = state.searches.filter(s => s.query !== query);
        return {
          searches: [
            { query, timestamp: Date.now(), resultCount },
            ...filtered,
          ].slice(0, state.maxSearches),
        };
      }),
      
      removeSearch: (query) => set(state => ({
        searches: state.searches.filter(s => s.query !== query),
      })),
      
      clearSearches: () => set({ searches: [] }),
    }),
    { name: 'justflip-recent-searches' }
  )
);
