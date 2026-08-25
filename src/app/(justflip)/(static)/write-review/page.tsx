import React from 'react';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import Review from './components/Review';

export const metadata = {
  title: "Write a Review | Just Flip",
  description: "Share your experience about your locality, city, or society to help home buyers and tenants.",
};

const ReviewPage = () => {
  const breadcrumbItems = [
    { label: "Review" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <Review />
      </div>
    </div>
  );
};

export default ReviewPage;
