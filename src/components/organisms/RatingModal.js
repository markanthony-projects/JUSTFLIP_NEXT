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
    Transport: 0,
  });

  const MAX_CHARS = 300;
  const isCity = type?.toLowerCase() === "city";

  const handleCommentChange = (e) => {
    let value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setComment(value);
    }
  };

  const handleAspectChange = (key, value) => {
    setAspects((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!rating) return;
    const formattedType = type?.toLowerCase();
    
    // Send aspects only if it's a city review
    const payload = {
      type: formattedType,
      typeId,
      rating,
      review: comment.trim(),
      ...(isCity && { aspects }),
    };

    const result = await submitReview(payload);
    if (result.success) {
      setRating(0);
      setComment("");
      setAspects({ Lifestyle: 0, Environment: 0, Transport: 0 });
      onClose();
    }
  };

  const disabled = !rating || isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative p-2">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-[#002B5B] text-lg font-bold">
            {isCity ? `Rate on ${typeName} city` : `Rate ${type?.charAt(0).toUpperCase() + type?.slice(1)} ${typeName}`}
          </h2>
          <div className="mt-2 flex justify-start">
            <StarRating value={rating} onChange={setRating} height={6} width={6} disableHoverAnimation={false} />
          </div>
        </div>

        {/* Aspect Ratings (Only rendered for City type) */}
        {isCity && (
          <div className="space-y-4 my-4">
            <div>
              <p className="text-[#002B5B] text-sm font-semibold mb-1">Lifestyle</p>
              <StarRating
                value={aspects.Lifestyle}
                onChange={(val) => handleAspectChange("Lifestyle", val)}
                height={5}
                width={5}
                disableHoverAnimation={false}
              />
            </div>

            <div>
              <p className="text-[#002B5B] text-sm font-semibold mb-1">Environment</p>
              <StarRating
                value={aspects.Environment}
                onChange={(val) => handleAspectChange("Environment", val)}
                height={5}
                width={5}
                disableHoverAnimation={false}
              />
            </div>

            <div>
              <p className="text-[#002B5B] text-sm font-semibold mb-1">Transport</p>
              <StarRating
                value={aspects.Transport}
                onChange={(val) => handleAspectChange("Transport", val)}
                height={5}
                width={5}
                disableHoverAnimation={false}
              />
            </div>
          </div>
        )}

        {/* Comment Box Section */}
        <div className="space-y-2 mt-4">
          <p className="text-[#002B5B] text-sm font-semibold">
            {isCity ? `Comment about ${typeName}` : "Review Comments"}
          </p>
          
          <textarea
            placeholder={
              isCity
                ? "Tell us about your personal experience with this Property..."
                : `Share your experience about ${typeName}...`
            }
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-gray-50"
          />

          <div className="flex justify-between text-xs text-gray-400">
            <span>Optional feedback</span>
            <span>{comment.length}/{MAX_CHARS}</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 text-sm font-medium border border-[#002B5B] text-[#002B5B] rounded-full hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            disabled={disabled}
            onClick={handleSubmit}
            className={`w-1/2 py-2.5 text-sm font-medium rounded-full text-white transition ${
              disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#002B5B] hover:bg-[#001f44]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}