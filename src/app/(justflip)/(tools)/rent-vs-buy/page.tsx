import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import RentVsBuyCalculator from './components/RentVsBuyCalculator';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const metadata: Metadata = constructMetadata({
  title: "Rent vs Buy Calculator - Compare Long-term Wealth & Costs | Justflip",
  description: "Compare the financial impact of renting versus buying a home over 5 to 30 years with detailed net worth projections and inflation modeling.",
  canonical: "/rent-vs-buy",
});

const RentBuyPage = () => {
  const breadcrumbItems = [
    { label: "Rent Vs Buy" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ScrollToTop />
        <Breadcrumb items={breadcrumbItems} />
        <RentVsBuyCalculator />
      </div>
    </div>
  );
};

export default RentBuyPage;