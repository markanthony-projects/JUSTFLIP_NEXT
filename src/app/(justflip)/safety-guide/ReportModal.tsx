"use client";

import React, { useState } from "react";
import { FiFlag, FiX } from "react-icons/fi";
import { MdOutlineReportProblem } from "react-icons/md";

interface ReportSuspiciousActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReportCategory =
  | ""
  | "suspicious-listing"
  | "payment-scam"
  | "fake-user"
  | "fake-documents"
  | "harassment"
  | "other";

const ReportModal = ({
  isOpen,
  onClose,
}: ReportSuspiciousActivityProps) => {
  const [category, setCategory] = useState<ReportCategory>("");
  const [listing, setListing] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reportData = {
      category,
      listing,
      description,
      email,
      file,
    };
    console.log("Report:", reportData);
    // API call 

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-black/40 px-4 py-6 app-overlay "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-start justify-between border-b border-[#D8E4EE] p-6 ">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FA]">
              <MdOutlineReportProblem
                size={21}
                className="text-[#b33411]"
              />
            </div>

            <div>
              <h2
                id="report-modal-title"
                className="text-lg font-bold text-[#002B5B]"
              >
                Report Suspicious Activity
              </h2>

              <p className="text-[12px] text-gray-500">
                Help us keep JustFlip safe.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report modal"
            className="rounded-full p-1 text-gray-400 transition hover:bg-red-600 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-6 py-4"
        >
          {/* Category */}
          <div>
            <label
              htmlFor="report-category"
              className="block text-sm font-semibold text-[#002B5B]"
            >
              What are you reporting?
            </label>

            <select
              id="report-category"
              value={category}
              onChange={ (e) => setCategory(e.target.value as ReportCategory) }
              required
              className="mt-2 w-full rounded-lg border border-[#D8E4EE] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
            >
              <option value="" disabled>
                Select a category
              </option>

              <option value="suspicious-listing">
                Suspicious Property Listing
              </option>

              <option value="payment-scam">
                Payment / Financial Scam
              </option>

              <option value="fake-user">
                Fake User / Agent
              </option>

              <option value="fake-documents">
                Fake Documents
              </option>

              <option value="harassment">
                Harassment / Inappropriate Behaviour
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          {/* Listing */}
          <div>
            <label
              htmlFor="listing"
              className="block text-sm font-semibold text-[#002B5B]"
            >
              Property / Listing URL
              <span className="ml-1 text-[12px] font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              id="listing"
              type="text"
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Paste listing URL or property ID"
              className="mt-2 w-full rounded-xl border border-[#D8E4EE] px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="report-description"
              className="block text-sm font-semibold text-[#002B5B]"
            >
              What happened?
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              maxLength={1500}
              placeholder="Please describe what you noticed..."
              className="mt-2 w-full resize-none rounded-xl border border-[#D8E4EE] px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {description.length}/1500
            </div>
          </div>

          {/* Evidence */}
          <div>
            <label
              htmlFor="evidence"
              className="block text-sm font-semibold text-[#002B5B]"
            >
              Evidence
              <span className="ml-1 text-[12px] font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              id="evidence"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => { setFile(e.target.files?.[0] || null) }}
              className="mt-2 w-full rounded-lg border border-[#D8E4EE] px-4 py-1 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF3FA] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#002B5B]"
            />

            <p className="mt-1 text-xs text-gray-400">
              Upload a screenshot or relevant document.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="report-email"
              className="block text-sm font-semibold text-[#002B5B]"
            >
              Your email
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="report-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-[#D8E4EE] px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
            />

            <p className="mt-1 text-xs text-gray-400">
              We may contact you if additional information is required.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D8E4EE] px-5 py-2 text-sm font-semibold text-[#002B5B] transition hover:bg-[#EAF3FA]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#002B5B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#001F42]"
            >
              Report Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;