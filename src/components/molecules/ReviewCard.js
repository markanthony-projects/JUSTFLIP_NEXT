"use client";

import { useState } from "react";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  if (!review) return null;

  const reviewerName = review?.reviewer?.name || review?.userName || review?.name || "Anonymous";
  const comment = (review?.comment || review?.description || review?.text || "").trim();
  const rating = review?.rating ?? review?.stars ?? 0;

  if (!comment) return null;

  const shouldTruncate = comment.length > 100;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs w-full h-fit hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-2.5">
        <Avatar name={reviewerName} />
        <div>
          <p className="font-semibold text-sm text-slate-800 leading-tight">
            {reviewerName}
          </p>
          <div className="mt-0.5">
            <StarRating value={rating} readOnly={true} />
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="pt-2 text-sm text-slate-600">
        <p
          className={
            !expanded && shouldTruncate
              ? "line-clamp-2 break-words overflow-hidden leading-relaxed"
              : "break-words leading-relaxed"
          }
        >
          {comment}
        </p>

        {shouldTruncate && (
          <button
            type="button"
            onClick={toggleExpanded}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline mt-1 focus:outline-hidden"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}