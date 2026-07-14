"use client";

import { useState } from "react";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  if (!review) return null;

  const reviewerName = review?.reviewer?.name || "Anonymous";
  const comment = review?.comment || "";
  const rating = review?.rating ?? 0;

  const shouldTruncate = comment.length > 100;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white shadow-md p-3 rounded-lg border min-h-33  border-gray-200 w-full">
      <div className="flex items-center gap-2">
        <Avatar name={reviewerName} />
        <div>
          <p className="font-semibold text-sm">{reviewerName}</p>
          <StarRating value={rating} />
        </div>
      </div>

      <div className="pt-2 text-sm text-gray-600">
        <p
          className={!expanded && shouldTruncate ? "line-clamp-2 break-all overflow-hidden" : "break-all"}
        >
          {comment}
        </p>

        {shouldTruncate && (
          <button type="button" onClick={toggleExpanded} className="text-xs text-blue-600 hover:underline mt-1" aria-expanded={expanded}    >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}