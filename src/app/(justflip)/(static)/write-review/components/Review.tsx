"use client";

import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import ReviewTipsSidebar from "./ReviewTipsSidebar";
import LoginModal from "@/src/components/organisms/LoginModal"; 
import { StepOneData } from "@/src/types";
import { useAuthStore } from "@/src/stores/auth.store"; 

export default function Review() {
  const [step, setStep] = useState<1 | 2>(1);
  const [stepOneData, setStepOneData] = useState<StepOneData | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isLoggedIn = useAuthStore((state) => !!state.user); 

  const handleStepOneNext = (data: StepOneData) => {
    setStepOneData(data);
    setStep(2);
  };

  const handleSuccess = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setStepOneData(null);
    setStep(1);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-0 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      <div className="lg:col-span-2 w-full">
        {isSubmitted ? (
          <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Thank you for sharing your experience. Your review helps home seekers make informed decisions.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-primary hover:bg-primary text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
            >
              Write Another Review
            </button>
          </div>
        ) : step === 1 ? (
          <StepOne
            initialData={stepOneData}
            onNext={handleStepOneNext}
          />
        ) : (
          stepOneData && (
            <StepTwo
              stepOneData={stepOneData}
              onSuccess={handleSuccess}
              isLoggedIn={isLoggedIn}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          )
        )}
      </div>

      <div className="lg:col-span-1">
        <ReviewTipsSidebar />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        closeModal={() => setIsLoginModalOpen(false)}
        title="Save Your Review"
        subtitle="Enter Your Mobile Number to continue"
        onSuccess={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}
