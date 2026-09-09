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

  interface FeaturedPropertyProps{
    project: Project
    priority?: boolean;
  }

  const getPossessionSpec = (possessionDate?: string | Date, possessionStatus?: string) =>{
    if(!possessionDate){
      return {
        label: "possession",
        value: possessionStatus || ""
      }
    }

    const givenDate = new Date(possessionDate)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    givenDate.setHours(0, 0, 0, 0)

    if(givenDate > today){
      return{
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

  const FeaturedProperty = ( {project, priority}: FeaturedPropertyProps) => {
      const [ showLoginPrompt, setShowLoginPrompt ] = useState(false)
      const [ details, setDetails ] = useState<Project | null>(null)
      const [ loading, setLoading ] = useState(true)


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
        
      const amenities = details?.amenities?.length || 0
      const floors = details?.floors || "";
      const totalUnits = details?.totalUnits || ""
      const possessionDate = details?.possessionDate?.slice(0,10) || ""
      const possessionStatus = details?.possessionStatus || ""
      const towers = details?.towers || ""
      const type = details?.type || ""
      const possessionInfo = getPossessionSpec(possessionDate, possessionStatus);

      const propertySpecData = [
        {
          id: "type",
          label: "Type",
          value: type,
          icon: <MdOutlineApartment size={16} />,
        },
        {
          key: "floors",
          icon: <MdOutlineLayers size={16} />,
          value: floors || 0,
          label: "Floors",
        },
        {
          key: "totalUnits",
          icon: <MdOutlineHomeWork size={16} />,
          value: totalUnits || "—",
          label: "Total Units",
        },
        {
          key: "towers",
          icon: <MdDomain size={16} />,
          value: towers || "—",
          label: "Towers",
        },
        {
          key: "possession",
          icon: <MdEvent size={16} />,
          value: possessionInfo.value || "—",
          label: possessionInfo.label
        },
        {
          key: "amenities",
          icon: <MdPool size={16} />,
          value: `${amenities}+`|| "—",
          label: "Amenities",
        },
      ];

    return (
      <>
      <article className='group relative sm:w-87.5 w-[calc(100vw-100px)] overflow-hidden rounded-lg bg-white border border-gray-200 transition-all duration-300 hover:shadow-[0_5px_20px_rgb(0,0,0,0.05)] hover:border-gray-300'>

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

            { /* image overlay */ }
            <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#001B3B]/75 via-primary/10 to-transparent pointer-events-none'/>
            
            {details?.rera !== null ? (
              <span className="absolute left-0 top-4 flex gap-0.5 rounded-r-lg bg-primary/40 pl-3 pr-4 py-1.5 text-xs font-medium text-white uppercase backdrop-blur-sm shadow-sm shadow-gray-800">
                RERA 
                <MdVerified className="size={15} ml-1" fill='currentColor'/>
              </span>
            ) : (
              <span />
            )}

            {/* LOCATION */}
            <div className="absolute bottom-3 left-0 bg-white/95 backdrop-blur-sm shadow-md text-primary flex items-center rounded-r-lg shadow-gray-800 h-7 pr-3 pl-1.5 border border-white/60" >
                <MdOutlineLocationOn
                    size={17}
                    className="shrink-0 text-[#d51717e8]"
                />
                <span className=" truncate text-xs font-semibold text-primary" >
                    {locationName}
                </span>
            </div>

            {/* FAVOURITE */}
            <div className=" absolute right-4 top-3 z-20 "
                onClick={(e) => e.stopPropagation() }
            >
                <FavouriteButton
                    project={project}
                    onAuthRequired={ () => setShowLoginPrompt(true) }
                    className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors border border-white/60`}
                />
            </div>

          </div>
        </Link>

        {/* content- description about the project */}
        <div className='px-5 py-3 border  border-gray-200'>

          <div className="flex items-start justify-between">
            <Link href={projectUrl}>
              <h2 className="line-clamp-1 text-[16px] font-extrabold leading-tight tracking-tight text-primary transition-colors hover:text-[#00437A]" >
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
          <p className="line-clamp-2 text-[12px] text-gray-500 max-w-3/4 truncate h-[30px] overflow-hidden">
            { project.summary }
          </p>

          {/* property specs */}
          <div className='grid divide-gray-200 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 grid-cols-3'>
              {propertySpecData.map((spec) =>(
                <PropertySpec
                  key={spec.key}
                  icon={spec.icon}
                  value={spec.value}
                  label={spec.label}
                />
              ))}
          </div>

          {/* Price */}
          <div className="border-t border-gray-200 pt-3 mt-3" >
            <div className="flex items-end justify-between gap-4" >

              {/* PRICE */}
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-500 ">
                  Price ranges
                </p>
                <p className="mt-0.5 truncate text-md font-extrabold leading-none text-primary " >
                  {project.priceRange || "Price on Request"}
                </p>

                
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {project?.pricePerSqft || "₹10,400 / sq.ft"}
                </p>
              </div>

              <Link href={projectUrl}
                className="flex shrink-0 items-end gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#003D7A] hover:shadow-lg ">
                    View Details<MdOutlineArrowForward size={18} className="font-bold text-xs"/>
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

  function PropertySpec({key, icon, value, label,
  }: {key:string, icon: React.ReactNode; value: string; label: string;}) {
    return (
      <div key={key} className="flex min-w-0 flex-col items-center justify-center px-1.5 py-4 text-center border-t border-r border-slate-100 gap-1 " >
        <div className="text-primary flex gap-0.5">
            {icon}
             <p className="mt-0.5 text-[10px] font-medium text-primary">
            {label}
        </p>
        </div>
        <p className="max-w-4/5 truncate text-[12px] font-medium text-gray-500 ">
            {value}
        </p>

       
      </div>
    );
  }

  
  export default memo(FeaturedProperty);

