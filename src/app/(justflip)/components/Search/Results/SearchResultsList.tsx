import React from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SearchResultCard from './SearchResultCard';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import InlineFilterPrompt, { PromptType } from './InlineFilterPrompt';

export default function SearchResultsList() {
  const { results, isLoading, isLoadingMore, isInitialized, hasMore, setPage, page, filters } = useSearchStore();

  const unappliedPrompts = React.useMemo(() => {
    const queue: PromptType[] = [];
    if (!filters.propertyType) queue.push('propertyType');
    if (!filters.minPrice && !filters.maxPrice) queue.push('priceRange');
    if (!filters.unitType && !filters.bhk) queue.push('unitType');
    return queue;
  }, [filters]);

  // Show skeletons on initial load OR when loading new filters
  if (!isInitialized || (isLoading && results.length === 0)) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-[250px] w-full"></div>
        ))}
      </div>
    );
  }

  if (isInitialized && !isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 lg:py-32 text-center px-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-2">
        <div className="w-24 h-24 mb-6 bg-gray-50 rounded-full flex items-center justify-center relative">
          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="absolute top-2 right-2 w-6 h-6 bg-red-50 border border-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 font-bold text-xs">!</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No properties found</h3>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          We couldn't find any properties matching your exact criteria. Try removing some filters or expanding your search area.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <button 
              onClick={useSearchStore.getState().clearFilters}
              className="px-6 py-3 bg-[#002B5B] text-white font-semibold rounded-xl hover:bg-[#001f42] transition-colors shadow-md shadow-blue-900/20 active:scale-95"
           >
              Clear all filters
           </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {results.map((project, index) => {
          let promptComponent = null;

          // Inject first prompt after 3rd result (index 2)
          if (index === 2 && unappliedPrompts[0]) {
            promptComponent = <InlineFilterPrompt key="prompt-0" type={unappliedPrompts[0]} />;
          }
          // Inject second prompt after 8th result (index 7)
          if (index === 7 && unappliedPrompts[1]) {
            promptComponent = <InlineFilterPrompt key="prompt-1" type={unappliedPrompts[1]} />;
          }

          return (
            <React.Fragment key={`${project.id}-${index}`}>
              <SearchResultCard 
                project={project} 
                priority={index < 4}
              />
              {promptComponent}
            </React.Fragment>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8">
          <InfiniteScrollLoader 
            onLoadMore={() => setPage(useSearchStore.getState().page + 1)}
            loading={isLoadingMore || isLoading}
          />
        </div>
      )}
    </>
  );
}
