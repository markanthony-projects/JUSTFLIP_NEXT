import React from 'react';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import AffordabilityCalculator from './components/AffordabilityCalculator';


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