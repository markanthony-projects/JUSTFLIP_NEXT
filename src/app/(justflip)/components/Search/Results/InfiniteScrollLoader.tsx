import React, { useEffect, useRef } from 'react';

interface InfiniteScrollLoaderProps {
  onLoadMore: () => void;
  loading: boolean;
}

export default function InfiniteScrollLoader({ onLoadMore, loading }: InfiniteScrollLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(loading);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    loadingRef.current = loading;
    onLoadMoreRef.current = onLoadMore;
  }, [loading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current) {
          onLoadMoreRef.current();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loading]);

  return (
    <div ref={loaderRef} className="w-full flex justify-center py-6">
      {loading && (
        <div className="flex space-x-2 justify-center items-center">
          <div className="h-3 w-3 bg-[#002B5B] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 bg-[#002B5B] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 bg-[#002B5B] rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
}
