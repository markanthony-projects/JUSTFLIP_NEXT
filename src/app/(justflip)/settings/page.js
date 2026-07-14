import React from 'react';
import SettingsMain from './components/SettingsMain';
import Breadcrumb from '@/src/components/organisms/breadCrumb';

export const metadata = {
  title: 'Settings | JustFlip',
  description: 'Manage your JustFlip system preferences and account settings.',
};

const SettingsPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <SettingsMain />
      </div>
    </div>
  );
};

export default SettingsPage;
