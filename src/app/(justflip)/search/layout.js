import React from 'react'
import HorizontalFilterBar from '../components/Search/Filters/HorizontalFilterBar'

const SearchPageLayout = ({children}) => {
    // const [isMobile]
  return (          
    <div>
        {/* <BaseHeaderClient config={HEADER_VARIANTS.incharge}/> */}
        {/* 1. Sticky Search Bar Area */}
        <div className="sticky top-0 z-1050 bg-white shadow-sm py-0 lg:py-0">
            <HorizontalFilterBar />
        </div>
        {children}
    </div>
  )
}

export default SearchPageLayout