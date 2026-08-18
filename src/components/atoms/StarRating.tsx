"use client";

import { useState } from "react";

export interface StarRatingProps {
  value?: number | string;
  onChange?: (value: number) => void;
  width?: number | string;
  height?: number | string;
  max?: number;
  disableHoverAnimation?: boolean;
  readOnly?: boolean;
}

export default function StarRating({
  value = 0,
  onChange,
  width = 3,
  height = 3,
  max = 5,
  disableHoverAnimation = true,
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const numericValue = Number(value) || 0;

  const handleSelect = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  return (
    <div
      className={`flex items-center gap-1 ${readOnly ? "pointer-events-none" : ""}`}
      role="radiogroup"
      aria-label="Star Rating"
    >
      {Array.from({ length: max }, (_, i) => {
        const starNumber = i + 1;

        // Calculate fill percentage for each individual star
        let fillPercent = 0;
        if (hover > 0) {
          fillPercent = starNumber <= hover ? 100 : 0;
        } else {
          if (numericValue >= starNumber) {
            fillPercent = 100; // Full star
          } else if (numericValue > starNumber - 1) {
            fillPercent = (numericValue - (starNumber - 1)) * 100; // Partial star (e.g., 0.5 -> 50%)
          } else {
            fillPercent = 0; // Empty star
          }
        }

        return (
          <button
            key={starNumber}
            type="button"
            role="radio"
            disabled={readOnly}
            aria-checked={Math.round(numericValue) === starNumber}
            onClick={() => handleSelect(starNumber)}
            onMouseEnter={() => !readOnly && !disableHoverAnimation && setHover(starNumber)}
            onMouseLeave={() => !readOnly && !disableHoverAnimation && setHover(0)}
            className={`relative ${disableHoverAnimation || readOnly
                ? ""
                : "transition-transform duration-150 hover:scale-110"
              }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="#E5E7EB"
              className={`h-${height} w-${width}`}
            >
              <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.403L12 19.771l-7.417 4.229L6 15.597 0 9.75l8.332-1.732z" />
            </svg>

            {fillPercent > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#D9A20D"
                  className={`h-${height} w-${width}`}
                >
                  <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.403L12 19.771l-7.417 4.229L6 15.597 0 9.75l8.332-1.732z" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
