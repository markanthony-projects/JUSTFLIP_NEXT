import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import FavouriteButton from '../atoms/FavouriteButton';
import LoginModal from '../organisms/LoginModal';
import { Project } from '@/src/types';
import { createProjectUrl } from '@/src/utils/url';
import * as ProjectService from "@/src/services/ProjectService";

import {
  MdApartment,
  MdCalendarMonth,
  MdOutlineArrowForward,
  MdOutlineLocationOn,
  MdVerified
} from 'react-icons/md'
import { ImLocation2 } from 'react-icons/im'
import { convertToCurrency } from '@/src/utils/RenderFunction';
interface UpcomingPropertyProps {
  project: Project
  priority?: boolean
}

const UpcomingProperty = ({ project, priority }: UpcomingPropertyProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [details, setDetails] = useState<Project | null>()
  const [loading, setLoading] = useState(true)

  const locationName = project?.location?.name || ''
  const projectName = project?.name || ''
  const projectId = project.id

  const projectUrl = createProjectUrl(
    project.city?.name || '',
    project.location?.zone?.name || '',
    project.location?.name || '',
    project.name || '',
    project.id || ''
  )

  const bannerImage =
    project?.banner ||
    project?.medias?.find((m: any) => m.title === 'banner') ||
    project?.medias?.[0]

  useEffect(() => {
    let mounted = true

    const fetchDetails = async () => {
      try {
        const response = await ProjectService.fetchProjectById(projectId)

        if (mounted) {
          setDetails(response)
        }
      } catch (error) {
        console.log('failed to fetch project details:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchDetails()

    return () => {
      mounted = false
    }
  }, [projectId])
  console.log(details, "upcoming")

  const minPrice = convertToCurrency(details?.units?.[0].minPrice) || "requested"

  return (
    <>
      <article className='group relative flex sm:w-87.5 w-[calc(100vw-100px)] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-gray-300'>
        <Link href={projectUrl}>
          {/* IMAGE */}
          <div className='relative sm:h-54 h-48 w-full overflow-hidden bg-gray-100'>
            <Image
              src={bannerImage?.url || '/assets/project-banner.webp'}
              alt={bannerImage?.alt || projectName}
              fill={true}
              className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 400px'
            />

            {/* Image overlay */}
            <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#001B3B]/75 via-primary/10 to-transparent pointer-events-none' />

            {/* BADGES + FAVOURITE */}
            {details?.rera !== null ? (
              <span className="absolute left-0 top-3 sm:top-4 flex items-center gap-0.5 rounded-r-lg bg-primary/40 pl-2.5 sm:pl-3 pr-3 sm:pr-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white uppercase backdrop-blur-sm shadow-sm shadow-gray-800">
                RERA
                <MdVerified className="size-3 sm:size-4 sm:ml-1 ml-0.5" fill='currentColor' />
              </span>
            ) : (
              <span />
            )}

            {/* LOCATION */}
            <div className="absolute bottom-2 sm:bottom-3 left-0 max-w-[130px] sm:max-w-none bg-white/95 backdrop-blur-sm shadow-md text-primary flex items-center rounded-r-lg shadow-gray-800 h-6 sm:h-7 px-2 sm:px-2.5 border border-white/60" >
              <MdOutlineLocationOn className="shrink-0 text-[#d51717e8] sm:size-4.5 size-3.5" />
              <span className=" truncate sm:text-xs text-[10px] font-semibold text-primary" >
                {locationName}
              </span>
            </div>
            {/* FAVOURITE */}
            <div
              className=' absolute right-4 top-4 z-20 '
              onClick={e => e.stopPropagation()}
            >
              <FavouriteButton
                project={project}
                onAuthRequired={() => setShowLoginPrompt(true)}
                className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors`}
              />
            </div>
          </div>
        </Link>

        {/* CONTENT */}
        <div className='flex flex-1 flex-col gap-3 sm:px-5 px-4 py-3 border border-gray-200'>
          {/* HEADER */}
          <div className='flex flex-col'>
            <div className='flex items-start justify-between gap-4'>
              <Link href={projectUrl}>
                <h2 className='sm:line-clamp-1 sm:text-[16px] text-[15px] leading-none font-extrabold sm:leading-tight sm:tracking-tight text-primary transition-colors hover:text-[#00437A]'>
                  {projectName}
                </h2>
              </Link>

              <Link
                href={`${projectUrl}${'?openMap=true'}`}
                type='button'
                className='hidden sm:flex shrink-0 text-[12px] font-semibold text-primary hover:underline text-center'
              >
                <ImLocation2 className='text-[14px] text-[#d51717e8]' />
                <span className='sm:inline'>See on map</span>
              </Link>
              <Link
                href={`${projectUrl}${'?openMap=true'}`}
                type='button'
                className='text-[16px] font-semibold text-center sm:hidden'
              >
                <Image
                  src='/icons/MapLocation.svg'
                  height={20}
                  width={40}
                  alt='See in map'
                  className=''
                />
              </Link>
            </div>

            <p className='sm:text-[12px] text-[11px] text-primary/70 mt-0.5'>
              By {details?.builder.name}
            </p>
          </div>

          {/* DETAILS */}
          <div className='flex flex-col gap-1 border-t border-slate-200 pt-3'>
            {/* Configuration */}
            <div className='flex items-center gap-1'>
              <MdApartment className='sm:text-[15px] text-[14px] text-primary' />

              <span className='sm:text-[14px] text-[12px] font-medium text-primary max-w-full truncate'>
                {project?.summary}
              </span>
            </div>

            {/* Possession */}
            <div className='flex items-center gap-1 text-sm text-primary'>
              <MdCalendarMonth className='sm:text-[15px] text-[14px]' />

              <span className='sm:text-[14px] text-[12px] font-medium text-primary/70 max-w-full truncate'>
                Possession starts : {details?.possessionDate?.slice(0, 10)}
              </span>
            </div>

            {/* Stats */}
            <div className='flex flex-wrap items-center gap-1 sm:pt-2 pt-1.5'>
              <span className='rounded-lg bg-primary/3 px-2 sm:py-1 py-0.5 text-[10px] sm:text-xs font-medium text-primary/70'>
                {'8.5 Acres'}
              </span>

              <span className='h-1 w-1 rounded-full bg-primary/3' />

              <span className='rounded-lg bg-primary/3 px-2 sm:py-1 py-0.5 text-[10px] sm:text-xs font-medium text-primary/70'>
                {details?.towers} towers
              </span>

              <span className='h-1 w-1 rounded-full bg-primary/3' />

              <span className='rounded-lg bg-primary/3 px-2 sm:py-1 py-0.5 text-[10px] sm:text-xs font-medium text-primary/70'>
                {details?.totalUnits} units
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 sm:mt-3 mt-2" >
            <div className="flex items-end justify-between gap-4" >

              {/* PRICE */}
              <div className="min-w-0">
                <p className="sm:text-[11px] text-[9px] leading-none sm:leading-tight font-medium text-primary/70 ">
                  Price ranges
                </p>
                <p className="sm:mt-0.5 truncate sm:text-md text-[14px] mt-1 font-extrabold leading-none sm:leading-tight text-primary " >
                  {project.priceRange || "Price on Request"}
                </p>


                <p className="sm:mt-0.5 sm:text-[10px] text-[9px] leading-none sm:leading-tight mt-1  text-primary/60">
                  {project?.pricePerSqft || "₹10,400 / sq.ft"}
                </p>
              </div>

              <Link href={projectUrl}
                className="flex shrink-0 items-end gap-1 rounded-lg bg-primary px-4 sm:py-2 py-1.5 sm:text-xs text-[11px] font-bold text-white transition-all duration-200 hover:bg-[#003D7A] hover:shadow-lg ">
                View Details<MdOutlineArrowForward size={18} className="font-bold text-xs" />
              </Link>

            </div>
          </div>

        </div>
      </article>
      {showLoginPrompt && (
        <LoginModal
          isOpen={showLoginPrompt}
          closeModal={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  )
}

export default UpcomingProperty
