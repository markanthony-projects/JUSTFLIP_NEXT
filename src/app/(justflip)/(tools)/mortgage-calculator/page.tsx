import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import MortgageCalculator from './components/MortgageCalculator';
import { constructMetadata } from '@/src/utils/seo';

export const metadata: Metadata = constructMetadata({
  title: "Mortgage & Home Loan EMI Calculator | JustFlip",
  description: "Calculate your monthly home loan EMI, total interest payable, and amortization schedule with our easy-to-use mortgage calculator.",
  canonical: "/mortgage-calculator",
});

const MortgageCalculatorPage = () => {
  const breadcrumbItems = [
    { label: "Mortgage Calculator" }
  ];

  return (
    <div className="w-full">
      <Breadcrumb items={breadcrumbItems} />
      <Suspense fallback={<div className="w-full h-96 bg-gray-50 animate-pulse rounded-2xl" />}>
        <MortgageCalculator />
      </Suspense>
    </div>
  );
};

export default MortgageCalculatorPage;
