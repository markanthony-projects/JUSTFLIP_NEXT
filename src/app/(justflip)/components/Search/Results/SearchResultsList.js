import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SearchResultCard from './SearchResultCard';
import InfiniteScrollLoader from './InfiniteScrollLoader';

export default function SearchResultsList() {
  const { results, isLoading, hasMore, setPage, page, appendResults } = useSearchStore();

  if (isLoading && results.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-[250px] w-full"></div>
        ))}
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-500 max-w-md">Try adjusting your filters, searching for a different location, or removing some criteria to see more results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {results.map((project, index) => (
          <SearchResultCard 
            key={`${project.id}-${index}`} 
            project={project} 
            priority={index < 4} // Preload first 4 images
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8">
          <InfiniteScrollLoader 
            onLoadMore={() => setPage(page + 1)}
            loading={isLoading}
          />
        </div>
      )}
    </>
  );
}
