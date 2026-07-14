"use client";
import React, { memo } from "react";


export const SkeletonBlock = memo(({ className = "" }) => {
  return (
    <div
      className={`bg-gray-200/70 animate-pulse bg-linear-to-r from-gray-200 via-red-50 to-gray-80  ${className}`}
    />
  );
});












