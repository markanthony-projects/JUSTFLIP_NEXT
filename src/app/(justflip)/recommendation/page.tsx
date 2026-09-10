import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import PropertyMatchmaker from './components/PropertyMatchmaker';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const metadata: Metadata = {
  title: 'Property Recommendations | JustFlip',
  description: 'Discover curated real estate properties, apartments, and villas tailored to your budget, preferred location, and BHK requirements with JustFlip.',
};

const RecommendationPropertyPage = () => {
  const breadcrumbItems = [
    { label: "Property Recommendation" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <Suspense fallback={<div>Loading...</div>}>
          <ScrollToTop />
          <PropertyMatchmaker />
        </Suspense>
      </div>
    </div>
  );
};

export default RecommendationPropertyPage;