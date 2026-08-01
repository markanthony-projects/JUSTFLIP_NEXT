"use client";

import { useState } from "react";
import StarRating from "../atoms/StarRating";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  if (!review) return null;

  const reviewerName =
    review?.reviewer?.name || review?.userName || review?.name || "Anonymous";
  const comment = (
    review?.comment ||
    review?.description ||
    review?.text ||
    ""
  ).trim();
  const rating = review?.rating ?? review?.stars ?? 0;

  if (!comment) return null;

  const shouldTruncate = comment.length > 80;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  // Extract first letter for Avatar
  const initial = reviewerName.charAt(0).toUpperCase();

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs w-full h-full flex flex-col justify-between hover:border-gray-200 transition-all">
      <div>
        {/* User Info Header */}
        <div className="flex items-center gap-3">
          {/* Custom Stylized Avatar matching design */}
          <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#15803d] font-bold text-sm flex items-center justify-center flex-shrink-0">
            {initial}
          </div>

          <div>
            <p className="font-bold text-[14px] text-gray-900 leading-snug">
              {reviewerName}
            </p>
            <div className="mt-0.5">
              <StarRating value={rating} readOnly={true} />
            </div>
          </div>
        </div>

        {/* Comment Text */}
        <div className="pt-2.5 text-[13px] text-gray-600 leading-relaxed">
          <p
            className={
              !expanded && shouldTruncate
                ? "line-clamp-2 break-words overflow-hidden"
                : "break-words"
            }
          >
            {comment}
          </p>
        </div>
      </div>

      {/* Read More Button */}
      {shouldTruncate && (
        <button
          type="button"
          onClick={toggleExpanded}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-2 text-left focus:outline-hidden w-fit"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}