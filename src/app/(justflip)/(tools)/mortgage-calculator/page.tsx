import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import MortgageCalculator from './components/MortgageCalculator';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

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
    <Suspense>
      <div className="w-full">
        <ScrollToTop />
        <Breadcrumb items={breadcrumbItems} />
        <MortgageCalculator />
      </div>
    </Suspense>
  );
};

export default MortgageCalculatorPage;
