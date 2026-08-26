import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import EligibilityCalculator from './components/EligibilityCalculator';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const metadata: Metadata = constructMetadata({
  title: "Home Loan Eligibility Calculator - Check Max Loan Limit | Justflip",
  description: "Check your home loan eligibility, maximum loan amount, and FOIR breakdown in seconds with Justflip's Home Loan Eligibility Calculator.",
  canonical: "/loan-eligibility",
});

const LoanEligibilityPage = () => {
  const breadcrumbItems = [
    { label: "Loan Eligibility" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ScrollToTop />
        <Breadcrumb items={breadcrumbItems} />
        <EligibilityCalculator />
      </div>
    </div>
  );
};

export default LoanEligibilityPage;