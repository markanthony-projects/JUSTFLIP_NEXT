import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import AffordabilityCalculator from './components/AffordabilityCalculator';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const dynamic = "force-static";

export const metadata: Metadata = constructMetadata({
  title: "Home Loan Affordability Calculator - Check Purchasing Power | Justflip",
  description: "Calculate your home loan affordability, maximum borrowing capacity, and estimated property budget based on your monthly income and existing EMIs.",
  canonical: "/affordability-calculator",
});

const AffordabilityCalculatorPage = () => {
  const breadcrumbItems = [
    { label: "Affordability Calculator" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <AffordabilityCalculator />
      </div>
    </div>
  );
};

export default AffordabilityCalculatorPage;