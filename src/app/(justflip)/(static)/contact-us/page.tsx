import React from 'react';
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import Contact from './components/Contact';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';

export const metadata = {
  title: "Contact Us | JustFlip",
  description: "Have questions, feedback, or need help? Get in touch with the JustFlip team for assistance and inquiries.",
};

const ContactPage = () => {
  const breadcrumbItems = [
    { label: "Contact Us" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
        <ScrollToTop />
        <Breadcrumb items={breadcrumbItems} />
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;