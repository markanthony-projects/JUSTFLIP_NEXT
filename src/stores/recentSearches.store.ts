import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount: number;
}

export interface RecentSearchesState {
  searches: RecentSearch[];
  maxSearches: number;
}

export interface RecentSearchesActions {
  addSearch: (query: string, resultCount?: number) => void;
  removeSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesState & RecentSearchesActions>()(
  persist(
    (set, get) => ({
      searches: [],
      maxSearches: 10,
      
      addSearch: (query: string, resultCount: number = 0) => set(state => {
        const filtered = state.searches.filter(s => s.query !== query);
        return {
          searches: [
            { query, timestamp: Date.now(), resultCount },
            ...filtered,
          ].slice(0, state.maxSearches),
        };
      }),
      
      removeSearch: (query: string) => set(state => ({
        searches: state.searches.filter(s => s.query !== query),
      })),
      
      clearSearches: () => set({ searches: [] }),
    }),
    { name: 'justflip-recent-searches' }
  )
);
