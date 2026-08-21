import React from 'react';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import StampDutyCalculator from './components/StampDutyCalculator';
import { Suspense } from 'react';

const StampDutyPage = () => {
  const breadcrumbItems = [
    { label: "Stamp Duty Calculator" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumb items={breadcrumbItems} />
        <StampDutyCalculator />
        </Suspense>
      </div>
    </div>
  );
};

export default StampDutyPage;