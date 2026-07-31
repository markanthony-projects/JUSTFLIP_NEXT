"use client";

import { useState } from "react";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  if (!review) return null;

  // Handle potential variations in property names from different API payloads
  const reviewerName = review?.reviewer?.name || review?.userName || review?.name || "Anonymous";
  const comment = (review?.comment || review?.description || review?.text || "").trim();
  const rating = review?.rating ?? review?.stars ?? 0;

  const hasComment = comment.length > 0;
  const shouldTruncate = comment.length > 100;

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white shadow-md p-3 rounded-lg border border-gray-200 w-full h-fit">
      <div className="flex items-center gap-2">
        <Avatar name={reviewerName} />
        <div>
          <p className="font-semibold text-sm">{reviewerName}</p>
          {/* Passed readOnly={true} so submitted stars cannot be modified */}
          <StarRating value={rating} readOnly={true} />
        </div>
      </div>

      {/* Conditionally render the comment section only if a non-empty comment exists */}
      {hasComment && (
        <div className="pt-2 text-sm text-gray-600">
          <p
            className={
              !expanded && shouldTruncate
                ? "line-clamp-2 break-all overflow-hidden"
                : "break-all"
            }
          >
            {comment}
          </p>

          {shouldTruncate && (
            <button
              type="button"
              onClick={toggleExpanded}
              className="text-xs text-blue-600 hover:underline mt-1"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}