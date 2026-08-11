"use client";
import React, { memo } from "react";


export const SkeletonBlock = memo(function SkeletonBlock({ 
  className = "" 
}: { 
  className?: string 
}) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-sm ${className}`}
    />
  );
});












