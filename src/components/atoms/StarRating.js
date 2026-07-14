"use client";

import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  width = 3,
  height = 3,
  max = 5,
  disableHoverAnimation = true,
}) {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(0);

  const handleSelect = (index) => {
    setRating(index);
    onChange?.(index);
  };

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Star Rating"
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const active = hover ? star <= hover : star <= rating;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            onClick={() => handleSelect(star)}
            onMouseEnter={() => !disableHoverAnimation && setHover(star)}
            onMouseLeave={() => !disableHoverAnimation && setHover(0)}
            className={`${
              disableHoverAnimation
                ? ""
                : "transition-transform duration-150 hover:scale-110"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={active ? "#D9A20D" : "#E5E7EB"}
              className={`transition-colors duration-200 h-${height} w-${width}`}
            >
              <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.403L12 19.771l-7.417 4.229L6 15.597 0 9.75l8.332-1.732z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}