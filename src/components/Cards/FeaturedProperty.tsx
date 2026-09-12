'use client'
import React, { memo, useEffect, useState } from 'react'

import { Project } from '@/src/types';
import { createProjectUrl } from '@/src/utils/url';
import Image from 'next/image';
import Link from "next/link";

//icons import 
import { MdDomain, MdEvent, MdOutlineApartment, MdOutlineArrowForward, MdOutlineHomeWork, MdOutlineLayers, MdOutlineLocationOn, MdPool, MdVerified } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";

import FavouriteButton from '../atoms/FavouriteButton';
import LoginModal from '../organisms/LoginModal';
import * as ProjectService from "@/src/services/ProjectService";

interface FeaturedPropertyProps {
  project: Project
  priority?: boolean;
}

const getPossessionSpec = (possessionDate?: string | Date, possessionStatus?: string) => {
  if (!possessionDate) {
    return {
      label: "possession",
      value: possessionStatus || ""
    }
  }

  const givenDate = new Date(possessionDate)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  givenDate.setHours(0, 0, 0, 0)

  if (givenDate > today) {
    return {
      label: "Possession",
      value: givenDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    }
  }

  return {
    label: "possession",
    value: possessionStatus || "Ready to Move",
  };

}

const FeaturedProperty = ({ project, priority }: FeaturedPropertyProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [details, setDetails] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)


  const locationName = project?.location?.name || "";
  const projectName = project?.name || ""
  const projectId = project.id

  const projectUrl = createProjectUrl(
    project.city?.name || "",
    project.location?.zone?.name || "",
    project.location?.name || "",
    project.name || "",
    project.id || ""
  );

  const bannerImage = project?.banner || (project?.medias?.find((m: any) => m.title === 'banner') || project?.medias?.[0]);

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

    return () => { mounted = false }
  }, [projectId])

  const amenities = details?.amenities?.length || 0
  const floors = details?.floors || "";
  const totalUnits = details?.totalUnits || ""
  const possessionDate = details?.possessionDate?.slice(0, 10) || ""
  const possessionStatus = details?.possessionStatus || ""
  const towers = details?.towers || ""
  const type = details?.type || ""
  const possessionInfo = getPossessionSpec(possessionDate, possessionStatus);

  const propertySpecData = [
    {
      key: "type",
      label: "Type",
      value: type,
      icon: <MdOutlineApartment className='size-3.5 sm:size-4' />,
    },
    {
      key: "floors",
      icon: <MdOutlineLayers className='size-3.5 sm:size-4' />,
      value: floors || 0,
      label: "Floors",
    },
    {
      key: "totalUnits",
      icon: <MdOutlineHomeWork className='size-3.5 sm:size-4' />,
      value: totalUnits || "—",
      label: "Total Units",
    },
    {
      key: "towers",
      icon: <MdDomain className='size-3.5 sm:size-4' />,
      value: towers || "—",
      label: "Towers",
    },
    {
      key: "possession",
      icon: <MdEvent className='size-3.5 sm:size-4' />,
      value: possessionInfo.value || "—",
      label: possessionInfo.label
    },
    {
      key: "amenities",
      icon: <MdPool className='size-3.5 sm:size-4'/>,
      value: `${amenities}+` || "—",
      label: "Amenities",
    },
  ];

  return (
    <>
      <article className='group relative sm:w-87.5 w-[calc(100vw-100px)] overflow-hidden rounded-lg bg-white border border-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-gray-300'>

        {/* for image */}
        <Link href={projectUrl} className="block">

          <div className='relative sm:h-54 h-48 w-full overflow-hidden bg-gray-100'>

            <Image
              src={bannerImage?.url || '/assets/project-banner.webp'}
              alt={bannerImage?.alt || projectName}
              fill={true}
              className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
              priority={priority}
              sizes='(max-width:768px) 100vw, 400px'
            />

            { /* image overlay */}
            <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#001B3B]/75 via-primary/10 to-transparent pointer-events-none' />

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
              <MdOutlineLocationOn className="shrink-0 text-[#d51717e8] sm:size-4.5 size-3.5"/>
              <span className=" truncate sm:text-xs text-[10px] font-semibold text-primary" >
                {locationName}
              </span>
            </div>

            {/* FAVOURITE */}
            <div className="absolute right-2.5 sm:right-4 top-2.5 sm:top-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <FavouriteButton
                project={project}
                onAuthRequired={() => setShowLoginPrompt(true)}
                className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-primary hover:bg-red-50 transition-colors border border-white/60`}
              />
            </div>

          </div>
        </Link>

        {/* content- description about the project */}
        <div className='sm:px-5 py-3 px-4 border  border-gray-200'>

          <div className="flex items-start justify-between">
            <Link href={projectUrl}>
              <h2 className="line-clamp-1 text-[15px] sm:text-[16px] font-extrabold leading-none sm:leading-tight tracking-tight text-primary transition-colors hover:text-[#00437A]" >
                {projectName}
              </h2>
            </Link>

            <Link
              href={`${projectUrl}${'?openMap=true'}`}
              type="button"
              className="hidden sm:flex shrink-0 text-[12px] font-semibold text-primary hover:underline text-center"
            >
              <ImLocation2 className="text-[14px] text-[#d51717e8]" />
              <span className="sm:inline">See on map</span>
            </Link>

            <Link
              href={`${projectUrl}${'?openMap=true'}`}
              type="button"
              className="text-[16px] font-semibold text-center sm:hidden px-2"
            >
              <Image
                src='/icons/MapLocation.svg'
                height={20}
                width={40}
                alt="See in map"
                className=''
              />
            </Link>
          </div>

          {/* DESCRIPTION */}
          <p className="line-clamp-2 text-[11px] leading-tight sm:text-[12px] text-primary/70 max-w-3/4 truncate mb-2 sm:mb-4 overflow-hidden">
            {project.summary}
          </p>

          {/* property specs */}
          <div className='grid divide-primary-200 overflow-hidden rounded-lg border border-primary/10 bg-primary/3 grid-cols-3'>
            {propertySpecData.map((spec) => (
              <PropertySpec
                key={spec.key}
                icon={spec.icon}
                value={spec.value}
                label={spec.label}
              />
            ))}
          </div>

          {/* Price */}
          <div className="border-t border-gray-200 sm:pt-3 sm:mt-3 pt-2 mt-2" >
            <div className="flex items-end justify-between gap-4" >

              {/* PRICE */}
              <div className="min-w-0">
                <p className="sm:text-[11px] text-[9px] leading-none sm:leading-tight font-medium text-primary/70 ">
                  Price ranges
                </p>
                <p className="sm:mt-0.5 truncate sm:text-md text-[14px] mt-1 font-extrabold leading-none sm:leading-tight text-primary " >
                  {project.priceRange || "Price on Request"}
                </p>


                <p className="sm:mt-0.5 sm:text-[10px] text-[9px] leading-none sm:leading-tight mt-1  text-slate-400">
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
          closeModal={() =>
            setShowLoginPrompt(false)
          }
        />
      )}
    </>
  )
}

function PropertySpec({
  key,
  icon,
  value,
  label,
}: {
  key?: string;
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div key={key} className="flex min-w-0 flex-col items-center justify-center px-1.5 sm:py-4 py-3 text-center border-t border-r border-slate-100 gap-0.5 sm:gap-1 " >
      <div className="text-primary/70 flex gap-0.5 font-medium">
        {icon}
        <p className="mt-0.5 sm:text-[10px] text-[9px] leading-none text-primary/70">
          {label}
        </p>
      </div>
      <p className="max-w-4/5 truncate text-[11px] sm:text-[12px] leading-none font-semibold text-primary ">
        {value}
      </p>


    </div>
  );
}


export default memo(FeaturedProperty);

