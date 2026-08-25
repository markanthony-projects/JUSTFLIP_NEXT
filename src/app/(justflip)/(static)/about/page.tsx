import React from 'react';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import About from './components/About';

export const metadata = {
  title: "About Us | Just Flip",
  description: "Learn more about Just Flip and our mission to help you explore, review, and make informed decisions about localities, societies, and real estate.",
};

const AboutPage = () => {
  const breadcrumbItems = [
    { label: "About Us" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <About />
      </div>
    </div>
  );
};

export default AboutPage;