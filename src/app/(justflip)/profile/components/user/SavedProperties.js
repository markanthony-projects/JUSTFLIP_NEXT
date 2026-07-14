'use client'
//this component is responsible for displaying the properties that have been saved by the user as a wishlisted proprties.
// Data source: useFavouritesStore — fetchFavouriteData() fills dataList with full property objects.
// Reuses: ProjectCard from components/Cards.
// Layout: horizontal scroll on mobile.
// wrapping grid on desktop.

import React, { useEffect } from 'react'

import { useFavouritesStore } from '@/src/stores/favourites.store'
import Link from 'next/link';

import { FaHeart } from 'react-icons/fa6'
import { MdKeyboardDoubleArrowRight, MdReadMore } from "react-icons/md";
import ProjectCard from '@/src/components/Cards/ProjectCard';

const SavedProperties = () => {
  const { dataList, loading, error, fetchFavouriteData } = useFavouritesStore();
  // console.log("datalist :", dataList); //the data list conatians an array of properties wishisted by the user
  // console.log("favourite Data", fetchFavouriteData); //this is a function guards against double-fetching internally.

  useEffect(()=>{
    fetchFavouriteData()
  }, [])

  return (
    <div className='bg-white/70 backdrop-blur-xl rounded-2xl p-5 md:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden'>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-20 -translate-y-20"></div>

      {/* section header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold text-gray-900 tracking-tight'>Favourite Properties</h2>
        {dataList.length > 0 && 
        ( //update the route in which the actual wishlisted properties go
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-all">
            View all <MdKeyboardDoubleArrowRight className='text-lg '/>
          </Link>
        )}
      </div>

      {/* while the favourite properties load */}
      {loading && (
        <div>
          {[1,2,3].map((i) =>{
            <div key={i} className='w-72 h-52 rounded-lg bg-gray-100 animate-pulse shrink-0'></div>
          })}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/**if there are no saved properties then, and also there is no error */}
      {!loading && !error && dataList.length === 0 && (
        <div>
          <span className='text-4xl'><FaHeart className='text-red-500'/></span>
          <p className='text-sm'>No favourite properties yet!</p>
          <p className='text-xs'>your favourite properties will appear here.</p>
        </div>
      )}

       {/* Property cards — horizontal scroll on BOTH mobile and desktop.
          ProjectCard has a fixed w-72 width, designed for scroll/carousel use.
          Never wraps — always a single scrollable row regardless of screen size.
          shrink-0 on the wrapper prevents cards from squishing inside the flex container. */}
      {!loading && !error && dataList.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {dataList.map((project, index) => (
            <div key={project?.id || index} className="shrink-0">
              {/* ProjectCard handles its own LoginModal and FavouriteButton internally */}
              <ProjectCard project={project} priority={index === 0} />
            </div>
          ))}
        </div>
      )}
        
    </div>
  )
}

export default SavedProperties