import React, { Suspense } from 'react'
import SafetyGuideClient from './SafetyGuideClient';

export const metadata = {
  title: "Safety Guide | JustFlip",
  description: "Learn essential safety tips and guidelines to protect yourself from scams and make safer property decisions on JustFlip.",
};

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <SafetyGuideClient/>
      </Suspense>
    </div>
  )
}

export default page