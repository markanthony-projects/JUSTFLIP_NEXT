"use client";
import React from "react";

export default function ActionButton({ label, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative px-4 py-2 flex items-center justify-center text-[#002B5B] cursor-pointer overflow-visible transition-all duration-300 ease-out active:scale-95"
    >
      {/* Background hover */}
      <span className="absolute inset-0 bg-[#002B5B]/5 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />

      {/* Icon */}
      <span className="relative z-50 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-[2px]">
        {icon}
      </span>

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3 whitespace-nowrap rounded-md bg-black text-white text-[11px] px-2 py-1 shadow-lg opacity-0 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-6 delay-100">
        {label}
      </span>

      {/* Accessibility */}
      <span className="sr-only">{label}</span>
    </button>
  );
}