"use client";
import { JUSTFLIP } from "../lib/axios/api";
import { useState, useEffect, useCallback, useRef } from "react";

const useFetchData = (url, params = {}, { enabled = true, append = false } = {}, dataKey = "project",) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const requestId = ++requestIdRef.current;

    if (append) {
      setIsFetching(true);
    } else {
      setLoading(true);
      setData([]);
    }

    setError(null);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const api = apiType ? JUSTFLIP : AUTH;

      const response = await api.get(url, {
        params,
        signal: abortRef.current.signal,
      });

      if (requestId !== requestIdRef.current) return;

      const newData = response?.data ?? {};

      setData((prev) => {
        if (!append) return newData;

        return {
          ...newData,
          [dataKey]: [
            ...(prev?.[dataKey] || []),
            ...(newData?.[dataKey] || []),
          ],
        };
      });
    } catch (err) {
      if (err.code !== "ERR_CANCELED") {
        console.error("Fetch error:", err);
        setError(err);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setIsFetching(false);
      }
    }
  }, [url, params, append, enabled, apiType, dataKey]);

  useEffect(() => {
    fetchData();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    isFetching,
    error,
    refetch,
    setData,
  };
};

export default useFetchData;