"use client";

import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  { label: "Last 3 Years", value: 3 },
  { label: "Last 5 Years", value: 5 },
  { label: "Last 10 Years", value: 10 },
];

export default function CustomDropdown({
  selectedRange = 5,
  setSelectedRange,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    OPTIONS.find((opt) => opt.value === selectedRange) || OPTIONS[1];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-between  px-3 py-2 text-xs md:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {selectedOption.label}

        <svg
          className={`ml-1 md:ml-2 h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg">
          {OPTIONS.map((option) => {
            const isActive = option.value === selectedRange;

            return (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedRange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}