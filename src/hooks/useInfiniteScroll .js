import { useEffect, useRef } from "react";

export const useInfiniteScroll= ({
  hasMore,
  loading,
  onLoadMore,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

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
  }, [hasMore, loading, onLoadMore]);

  return sentinelRef;
};