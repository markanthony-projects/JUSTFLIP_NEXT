import React, { Suspense } from 'react'
import SafetyGuideClient from './SafetyGuideClient';

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