import { useEffect, useRef, MutableRefObject } from "react";

export interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: UseInfiniteScrollOptions): MutableRefObject<any> => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { root, rootMargin, threshold }
    );

    const currentEl = sentinelRef.current;

    if (currentEl) {
      observerRef.current.observe(currentEl);
    }

    return () => {
      if (currentEl) observerRef.current?.unobserve(currentEl);
    };
  }, [hasMore, loading, onLoadMore, root, rootMargin, threshold]);

  return sentinelRef;
};