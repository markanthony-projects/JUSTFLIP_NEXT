"use client";

import { useEffect } from "react";
import { useCompareStore } from "@/src/stores/useCompare.store";

export default function CompareInitializer() {
  useEffect(() => {
    useCompareStore.persist.rehydrate();
  }, []);

  return null;
}