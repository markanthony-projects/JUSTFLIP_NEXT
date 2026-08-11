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
import { MdKeyboardDoubleArrowRight, MdArrowForward } from "react-icons/md";
import ProjectCard from '@/src/components/Cards/ProjectCard';

const Max_Items = 3;

const SavedProperties = () => {
  const { dataList, loading, error, fetchFavouriteData } = useFavouritesStore();
  useEffect(()=>{
    fetchFavouriteData()
  }, [])

  const visibleList = dataList.slice(0, Max_Items);

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm'>
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-50 blur-3xl opacity-70"></div>

      {/* section header */}
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Favourite Properties
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Properties you've added to your favourites for quick access.
          </p>
        </div>

        {dataList.length > 0 && (
          <Link
            href="/profile?tab=wishlist"
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50"
          >
            View All ({dataList.length})
            <MdKeyboardDoubleArrowRight className="text-lg" />
          </Link>
        )}
      </div>

      {/* while the favourite properties load */}
      {loading && (
        <div className="flex gap-5 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[340px] w-72 shrink-0 animate-pulse rounded-3xl bg-slate-100"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {/* {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )} */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}
      {!loading && !error && dataList.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-20 text-center">

          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <FaHeart className="text-3xl text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            No Favourite Properties Yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Properties that you mark as favourites will appear here.
          </p>

        </div>
      )}

       {/* Property cards — horizontal scroll on BOTH mobile and desktop.
          ProjectCard has a fixed w-72 width, designed for scroll/carousel use.
          Never wraps — always a single scrollable row regardless of screen size.
          shrink-0 on the wrapper prevents cards from squishing inside the flex container. */}
      {!loading && !error && dataList.length > 0 && (
        <div className="flex gap-5 overflow-x-auto pb-2">
          {visibleList.map((project, index) => (
            <div
              key={project?.id || index}
              className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
            >
              <ProjectCard
                project={project}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
        
    </div>
  )
}

export default SavedProperties