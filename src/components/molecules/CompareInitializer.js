"use client";

import { useEffect } from "react";
import { useCompareStore } from "@/src/stores/useCompare.store";

export default function CompareInitializer() {
  const init = useCompareStore((state) => state.init);

  useEffect(() => {
    init(); 
  }, []);

  return null;
}