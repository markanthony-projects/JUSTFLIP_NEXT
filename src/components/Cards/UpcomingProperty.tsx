import React, { useEffect, useState } from 'react'

import { Project } from '@/src/types';
import { createProjectUrl } from '@/src/utils/url';
import * as ProjectService from "@/src/services/ProjectService";
import Image from 'next/image';
import { MdApartment, MdArrowForward, MdCalendarMonth, MdLocationOn, MdOutlineLocationOn, MdVerified } from 'react-icons/md';
import FavouriteButton from '../atoms/FavouriteButton';
import Link from 'next/link';

const SvgImg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 512" width="40" height="20">
      {/* <!-- Map Folded Base --> */}
      <path fill="#002B5B" d="M184 274.5v172.9l-118 43.3c-11.2 4.1-22-4.2-22-16.1V245.5c0-6.1 3.5-11.6 9-14.2l111.8-51.6c12.3-5.7 19.2 11 19.2 19.8zm28 0v172.9l118-43.3c11.2-4.1 22 4.2 22 16.1V245.5c0-6.1-3.5-11.6-9-14.2l-111.8-51.6c-12.3-5.7-19.2 11-19.2 19.8z"/>
      <path fill="#002B5B" d="M196 230v216.5l120-44.1V185.9l-120 44.1z" />
      
      {/* <!-- Map Outline Shapes --> */}
      <g fill="#002B5B">
        {/* <!-- Left Fold --> */}
        <path d="M52.3 226.7L172 171.5v257.2L52.3 472.9C43.3 476.2 34 469.5 34 459.9V241.6c0-6.6 3.9-12.6 9.9-15.3z"/>
        {/* <!-- Center Fold --> */}
        <path d="M196 238.4v214.1l120-44.1V194.3l-120 44.1z"/>
        {/* <!-- Right Fold --> */}
        <path d="M459.7 226.7L340 171.5v257.2l119.7    44.2c9 3.3 18.3-3.4 18.3-13V241.6c0-6.6-3.9-12.6-9.9-15.3z"/>
      </g>

      {/* <!-- Location Pin (With White Stroke Border to cut out from Map) --> */}
      <g>
        {/* <!-- Red Pin Body --> */}
        <path fill="#d51717e8" stroke="#FFFFFF" strokeWidth="16" strokeLinejoin="round"
          d="M256 32c-57.4 0-104 46.6-104 104 0 72.8 89.6 166.4 97.8 174.8 3.4 3.5 9 3.5 12.4 0 8.2-8.4 97.8-102 97.8-174.8 0-57.4-46.6-104-104-104z" />
        
        {/* <!-- White Center Hole --> */}
        <circle cx="256" cy="136" r="32" fill="#FFFFFF" />
      </g>
    </svg>
  )
}


interface UpcomingPropertyProps{
    project: Project
    priority?: boolean
}

const UpcomingProperty = ({ project, priority } : UpcomingPropertyProps) => {
    const [ showLoginPrompt, setShowLoginPrompt ] = useState(false)
    const [ details, setDetails ] = useState<Project | null>  ()
    const [ loading, setLoading ] = useState(true)

    const locationName = project?.location?.name || "";
    const projectName = project?.name || ""
    const projectId = project.id

    const projectUrl = createProjectUrl(
      project.city?.name || "",
      project.location?.zone?.name || "",
      project.location?.name || "",
      project.name || "",
      project.id || "",
    );

    const bannerImage = project?.banner || (project?.medias?.find((m: any) => m.title === 'banner') || project?.medias?.[0]);

    useEffect(()=>{
        let mounted = true

        const fetchDetails = async () =>{
          try{
            const response = await ProjectService.fetchProjectById(projectId)

            if(mounted){
              setDetails(response)
            }
          }catch(error){
            console.log('failed to fetch project details:',error)
          }finally{
            if(mounted){
              setLoading(false)
            }
          }
        }

        fetchDetails()

        return ()=>{mounted = false}
    },[projectId])
    
  return (
    <article className="group relative flex w-87.5 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300  hover:shadow-[0_5px_20px_rgba(0,40,80,0.18)] ">
      
      <Link href={projectUrl}>
        {/* IMAGE */}
        <div className="relative h-54 w-full overflow-hidden bg-gray-100">
          <Image
            src={bannerImage?.url || '/assets/project-banner.webp'}
            alt={bannerImage?.alt || projectName}
            fill={true}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Image overlay */}
          <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#002B5B]/50 via-transparent to-[#002B5B]/10 pointer-events-none'/>

          {/* BADGES + FAVOURITE */}
          {details?.rera !== null ? (
            <span className="absolute left-0 top-4 flex gap-0.5 rounded-r-md bg-[#002B5B] pl-1 pr-3 py-1 text-xs font-medium text-white uppercase backdrop-blur-sm shadow-sm shadow-gray-800">
              <MdVerified className="size={15}" fill='currentColor'/>
              RERA Approved
            </span>
          ) : (
            <span />
          )}

          {/* LOCATION */}
          <div className="absolute bottom-3 left-0 bg-white/95 backdrop-blur-sm shadow-md text-[#002B5B] flex items-center rounded-r-lg shadow-gray-800 h-7 px-2.5" >
            <MdOutlineLocationOn size={17} className="shrink-0 text-[#d51717e8]"/>
            <span className="truncate text-xs font-semibold text-[#002B5B]" >
                {locationName}
            </span>
          </div>

          {/* FAVOURITE */}
          <div className=" absolute right-4 top-4 z-20 "
            onClick={(e) => e.stopPropagation() }
          >
            <FavouriteButton
              project={project}
              onAuthRequired={ () => setShowLoginPrompt(true) }
              className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors`}
            />
          </div>
        
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-3">

        {/* HEADER */}
        <div className="flex flex-col">

          <div className="flex items-start justify-between gap-4">
            <Link href={projectUrl}>
              <h2 className="line-clamp-1 text-[16px] font-extrabold leading-tight tracking-tight text-[#002B5B] transition-colors hover:text-[#00437A]" >
                  {projectName}
              </h2>
            </Link>

            <Link
              href={`${projectUrl}${'?openMap=true'}`}
              type="button"
              className="hidden sm:flex shrink-0 text-[12px] font-semibold text-[#002B5B] hover:underline text-center"
            >
              <MdLocationOn className="text-[14px] text-[#d51717e8]" />
              <span className="sm:inline">See in Map</span>
            </Link>
            <Link
              href={`${projectUrl}${'?openMap=true'}`}
              type="button"
              className="text-[12px] font-semibold text-center sm:hidden"
            >
              <SvgImg/>
            </Link>
          </div>

          <p className="text-[12px] text-slate-500">
            By {details?.builder.name}
          </p>

          {/* <div className="flex items-center gap-1 text-sm text-slate-500">
            <MdLocationOn className="text-base" />
            <span>{details?.address || details?.location?.name}</span>
          </div> */}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-2 border-y border-slate-200 py-4">

          {/* Configuration */}
          <div className="flex items-center gap-2">
            <MdApartment className="text-xl text-[#002B5B]" />

            <span className="text-[14px] font-medium text-slate-900 max-w-full truncate">
              {project?.summary}
            </span>
          </div>

          {/* Possession */}
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <MdCalendarMonth className="text-lg" />

            <span>
              Possession starts : {details?.possessionDate?.slice(0,10)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-1 pt-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {"8.5 Acres"}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {details?.towers} towers
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {details?.totalUnits} units
            </span>
          </div>
        </div>

        {/* PRICE + CTA */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-500">
              Starting from
            </span>

            <span className="text-md font-semibold text-[#002B5B]">
              {project?.minPrice || "₹ 1.25 CR"}
            </span>

            <span className="text-[10px] text-slate-400">
              {project?.pricePerSqft || "₹10,400 / sq.ft"}
            </span>
          </div>

          <Link
            href={projectUrl}
            className="flex shrink-0 items-end gap-1 rounded-xl bg-[#002B5B] px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#003D7A] hover:shadow-lg"
          >
            View Project
            <MdArrowForward size={18} className="font-bold text-xs"/>
          </Link>
        </div>
      </div>
    </article>
  )
}



export default UpcomingProperty