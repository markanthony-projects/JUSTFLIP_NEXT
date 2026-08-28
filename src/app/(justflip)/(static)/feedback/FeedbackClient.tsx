"use client";

import React, { useState } from "react";
import Breadcrumb from "@/src/components/organisms/breadCrumb";
import {
  FiCheck,
  FiMail,
  FiMonitor,
  FiHome,
  FiSearch,
  FiActivity,
  FiMoreHorizontal,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { VscFeedback } from "react-icons/vsc";
import { SiPrivateinternetaccess } from "react-icons/si";

type FeedbackCategory =
  | "Website"
  | "Property Listings"
  | "Search"
  | "Performance"
  | "Others"
  | "";

const FeedbackClient = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [category, setCategory] = useState<FeedbackCategory>("");
  const [feedback, setFeedback] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const breadcrumbItems = [
    {
      label: "Feedback",
      href: "/feedback",
    },
  ];

  const categories = [
    {
      label: "Website",
      icon: FiMonitor,
    },
    {
      label: "Property Listings",
      icon: FiHome,
    },
    {
      label: "Search",
      icon: FiSearch,
    },
    {
      label: "Performance",
      icon: FiActivity,
    },
    {
      label: "Others",
      icon: FiMoreHorizontal,
    },
  ] as const;

  
  const handleStarRating = (
    event: React.MouseEvent<HTMLButtonElement>,
    star: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const isHalf = x < rect.width / 2;

    const value = isHalf ? star - 0.5 : star;

    setRating(value);
  };

  const handleStarHover = (
    event: React.MouseEvent<HTMLButtonElement>,
    star: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const isHalf = x < rect.width / 2;

    const value = isHalf ? star - 0.5 : star;

    setHoveredRating(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rating || !feedback.trim()) {
      return;
    }

    const feedbackData = {
      rating,
      category,
      feedback: feedback.trim(),
      email: email.trim() || null,
    };

    console.log("Feedback:", feedbackData);

    // API call
    setSubmitted(true);
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setCategory("");
    setFeedback("");
    setEmail("");
    setSubmitted(false);
  };

  
  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[#D8E4EE] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3FA]">
              <FiCheck aria-hidden="true" size={30} className="text-[#002B5B]" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#002B5B]">
              Thank you for your feedback!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-700">
              Your feedback helps us improve JustFlip and provide a better
              experience for everyone.
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="mt-6 text-sm font-semibold text-[#002B5B] hover:underline"
            >
              Submit another response
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero */}
        <header className="mt-6 rounded-2xl bg-[#EAF3FA] px-6 py-6 text-center sm:px-10 sm:py-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <VscFeedback aria-hidden="true" size={28} className="text-[#002B5B]" />
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#002B5B] sm:text-3xl">
            We&apos;d love to hear from you!
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-gray-700 sm:text-sm">
            Your feedback helps us improve JustFlip and provide you with a
            better experience.
          </p>
        </header>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-10"
        >

          {/* 1. Rating */}
          <section>
            <h2 className="text-md font-bold text-[#002B5B] sm:text-lg">
              1. How was your experience?
            </h2>

            <p className="mt-2 text-xs text-gray-700">
              Please rate your overall experience with JustFlip.
            </p>

            {/* Stars */}
            <div className="mt-3 flex justify-center gap-5 sm:gap-10">
              {Array.from({ length: 5 }, (_, index) => {
                const star = index + 1;
                const currentRating = hoveredRating || rating;

                const isFull = currentRating >= star;
                const isHalf = currentRating === star - 0.5;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={ (event) => handleStarRating(event, star) }
                    onMouseMove={ (event) => handleStarHover(event, star) }
                    onMouseLeave={ () => setHoveredRating(0) }
                    aria-label={`Rate ${star} out of 5`}
                    className="relative text-3xl transition-transform duration-150 hover:scale-110 sm:text-4xl"
                  >
                    {/* Empty star */}
                    <span aria-hidden="true" className="text-gray-300">
                      ★
                    </span>

                    {/* Filled star */}
                    {(isFull || isHalf) && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 overflow-hidden text-amber-500"
                        style={{
                          width: isFull ? "100%" : "50%",
                        }}
                      >
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Rating labels */}
            <div className="mt-3 flex justify-between px-1 text-xs text-gray-600">
              <span>Very Poor</span>
              <span>Excellent</span>
            </div>
            
          </section>

          <div className="my-6 border-t border-gray-100" />

          {/* 2. Category */}
          <section>
            <h2 className="text-md font-bold text-[#002B5B] sm:text-lg">
              2. What is your feedback about?
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCategory(item.label)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-[#002B5B] bg-[#002B5B] text-white"
                        : "border-[#D8E4EE] bg-white text-[#002B5B] hover:border-[#002B5B] hover:bg-[#EAF3FA]"
                    }`}
                  >
                    <Icon aria-hidden="true" size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="my-6 border-t border-gray-100" />

          {/* 3. Feedback */}
          <section>
            <h2 className="text-md font-bold text-[#002B5B] sm:text-lg">
              3. Tell us more
            </h2>

            <p className="mt-2 text-xs text-gray-700">
              Please share your thoughts, suggestions, or any issues you
              faced.
            </p>

            <textarea
              id="feedback"
              name="feedback"
              value={feedback}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setFeedback(e.target.value);
                }
              }}
              placeholder="Write your feedback here..."
              rows={7}
              required
              className="mt-4 w-full resize-none rounded-xl border border-[#D8E4EE] px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-500 focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
            />

            <div className="mt-1 text-right text-xs text-gray-600">
              {feedback.length}/1000
            </div>
          </section>

          <div className="my-8 border-t border-gray-100" />

          {/* 4. Email */}
          <section>
            <h2 className="text-md font-bold text-[#002B5B] sm:text-lg">
              4. Your email{" "}
              <span className="font-normal text-gray-600 text-sm">
                (optional)
              </span>
            </h2>

            <p className="mt-2 text-xs text-gray-700">
              We may reach out to you for more details if needed.
            </p>

            <div className="relative mt-4">
              <FiMail
                aria-hidden="true"
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#002B5B]"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D8E4EE] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none placeholder:text-gray-500 focus:border-[#002B5B] focus:ring-2 focus:ring-[#002B5B]/10"
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={!rating || !feedback.trim()}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#002B5B] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#001F42] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSend aria-hidden="true" size={17} />
            Send Feedback
          </button>
        </form>

        {/* Privacy Notice */}
        <section className="mt-5 rounded-2xl border border-[#D8E4EE] bg-[#EAF3FA] p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
              <SiPrivateinternetaccess
                aria-hidden="true"
                size={24}
                className="text-[#002B5B]"
              />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#002B5B] sm:text-lg">
                Your privacy matters
              </h2>

              <p className="text-xs leading-6 text-gray-700">
                We value your privacy. Your feedback and personal information
                will be kept confidential and used only to improve our
                services.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} JustFlip. All rights reserved.
        </footer>
      </div>
    </main>
  );
};

export default FeedbackClient;