"use client";

import { useLayoutEffect } from "react";

export default function ScrollToTop() {
  // Try to start scroll immediately on render before component finishes loading
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return null;
}