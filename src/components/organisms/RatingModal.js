"use client";

import Modal from "./Modal";
import { useState } from "react";
import StarRating from "../atoms/StarRating";
import { useReviewStore } from "@/src/stores/review.store";

export default function RatingModal({ typeId, typeName, type, isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { submitReview, isSubmitting } = useReviewStore();
  const [aspects, setAspects] = useState({
    Lifestyle: 0,
    Environment: 0,
    Transport: 0
  });
  const MAX_CHARS = 300;

  const handleCommentChange = (e) => {
    let value = e.target.value;

    if (value.length <= MAX_CHARS) {
      setComment(value);
    }
  };



  const handleSubmit = async () => {
    if (!rating) return;
    type = type?.toLowerCase()
    const result = await submitReview({ type, typeId, rating, review: comment.trim(), aspects });
    if (result.success) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  const disabled = !rating || isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Rate {type?.charAt(0).toUpperCase() + type?.slice(1)} {typeName}
          </h2>
        </div>

        <div className="flex justify-center mb-6">
          <StarRating value={rating} onChange={setRating} height={8} width={8} disableHoverAnimation={false} />
        </div>

        <div className="space-y-2">
          <textarea
            placeholder={`Share your experience about ${typeName}...`}
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            className="w-full border scrollbar-modern border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
          />

          <div className="flex justify-between text-xs text-gray-400">
            <span>Optional feedback</span>
            <span>{comment.length}/{MAX_CHARS}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={disabled}
            onClick={handleSubmit}
            className={`px-4 py-2 text-sm rounded-lg text-white transition
          ${disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#002B5B] hover:bg-[#001f44]"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

    </Modal>
  );
}