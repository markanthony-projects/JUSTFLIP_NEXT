import React from 'react';
import HorizontalFilterBar from '../components/Search/Filters/HorizontalFilterBar';

const SearchPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <link rel="preconnect" href="https://media.justflip.in" />
      {/* Mobile Top Header: Full-width Edge-to-Edge Sticky Filter and Search Bar */}
      <div className="sticky top-0 z-50 lg:hidden shadow-xs -mx-4">
        <HorizontalFilterBar />
      </div>
      {children}
    </div>
  );
};

export default SearchPageLayout;