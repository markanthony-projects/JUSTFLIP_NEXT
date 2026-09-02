'use client';

import React, { useMemo } from 'react';
import { useSearchStore } from '@/src/stores/search.store';
import SearchResultCard from './SearchResultCard';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import InlineFilterPrompt, { PromptType } from './InlineFilterPrompt';
import { FiSearch } from 'react-icons/fi';

function SearchCardSkeleton() {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl overflow-hidden mb-4 flex flex-col md:flex-row">
      <div className="w-full md:w-[35%] lg:w-[32%] h-[210px] sm:h-[230px] md:h-auto min-h-[220px] bg-slate-100 animate-pulse shrink-0" />
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-slate-200 rounded-md w-3/5 mb-2 animate-pulse" />
          <div className="h-3.5 bg-slate-100 rounded-md w-2/5 mb-3 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2 mb-4 animate-pulse" />
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 my-2">
            <div className="h-7 bg-slate-200/70 rounded-md animate-pulse" />
            <div className="h-7 bg-slate-200/70 rounded-md animate-pulse" />
            <div className="h-7 bg-slate-200/70 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex gap-1.5">
            <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
            <div className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="w-28 h-9 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsList() {
  const { results, isLoading, isLoadingMore, isInitialized, hasMore, setPage, filters } = useSearchStore();

  const unappliedPrompts = useMemo(() => {
    const queue: PromptType[] = [];
    if (!filters.propertyType) queue.push('propertyType');
    if (!filters.minPrice && !filters.maxPrice) queue.push('priceRange');
    if (!filters.unitType && !filters.bhk) queue.push('unitType');
    return queue;
  }, [filters]);

  // Show skeletons on initial load OR when loading new filters
  if (!isInitialized || (isLoading && results.length === 0)) {
    return (
      <div className="flex flex-col gap-1">
        {[1, 2, 3, 4].map((i) => (
          <SearchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty State
  if (isInitialized && !isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4 bg-white rounded-2xl border border-slate-200/80 mt-2">
        <div className="w-16 h-16 mb-4 bg-blue-50/80 rounded-2xl flex items-center justify-center text-[#002B5B]">
          <FiSearch className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties match your criteria</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          Try removing some filters, expanding your budget, or searching in nearby locations.
        </p>
        <button
          onClick={useSearchStore.getState().clearFilters}
          className="px-6 py-2.5 bg-[#002B5B] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-[#001f42] transition-colors cursor-pointer"
        >
          Reset all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
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
                priority={index < 3}
              />
              {promptComponent}
            </React.Fragment>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-6 mb-8">
          <InfiniteScrollLoader
            onLoadMore={() => setPage(useSearchStore.getState().page + 1)}
            loading={isLoadingMore || isLoading}
          />
        </div>
      )}
    </>
  );
}
