import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import StampDutyCalculator from './components/StampDutyCalculator';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const metadata: Metadata = constructMetadata({
  title: "Stamp Duty & Registration Charges Calculator | Justflip",
  description: "Calculate accurate stamp duty and property registration charges across states and cities in India with Justflip's Stamp Duty Calculator.",
  canonical: "/stamp-duty",
});

const StampDutyPage = () => {
  const breadcrumbItems = [
    { label: "Stamp Duty Calculator" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ScrollToTop />
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumb items={breadcrumbItems} />
          <StampDutyCalculator />
        </Suspense>
      </div>
    </div>
  );
};

export default StampDutyPage;