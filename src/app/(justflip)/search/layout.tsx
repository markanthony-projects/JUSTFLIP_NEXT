import React from 'react'
import HorizontalFilterBar from '../components/Search/Filters/HorizontalFilterBar'

const SearchPageLayout = ({ children }: { children: React.ReactNode }) => {
  // const [isMobile]
  return (
    <div>
      <link rel="preconnect" href="https://media.justflip.in" />
      {/* <BaseHeaderClient config={HEADER_VARIANTS.incharge}/> */}
      {/* 1. Sticky Search Bar Area */}
      <div className="sticky top-0 z-40 bg-white shadow-sm py-0 lg:py-0 lg:hidden">
        <HorizontalFilterBar />
      </div>
      {children}
    </div>
  )
}

export default SearchPageLayout