    'use client'
    import React, { memo, useEffect, useState } from 'react'

    import { Project } from '@/src/types';
    import { createProjectUrl } from '@/src/utils/url';
    import Image from 'next/image';
    import Link from "next/link";

    //icons import 
    import { MdOutlineApartment, MdOutlineArrowForward, MdOutlineCalendarMonth, MdOutlineLayers, MdOutlineLocationOn, MdOutlineSquareFoot, MdOutlineStarBorder } from "react-icons/md";

    import FavouriteButton from '../atoms/FavouriteButton';
    import LoginModal from '../organisms/LoginModal';
    import * as ProjectService from "@/src/services/ProjectService";

    interface FeaturedPropertyProps{
      project: Project
      priority?: boolean;
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
       
    
        const amenities = details?.amenities || []

        /*
        * These are optional. Once i find the API/type it has to be replaced for proper fields and values.
        */
        const propertyData = project as Project & {
            bhk?: string;
            area?: string;
            size?: string;
            floors?: string;
            possession?: string;
            amenities?: string[];
            pricePerSqft?: string;
        };

        const bhk =
            // details?.summary
            propertyData.bhk ||
            propertyData.residenceType ||
            "Apartment";

        const area =
            propertyData.area ||
            propertyData.size ||
            "";

        const floors =
            propertyData.floors ||
            "";

        const possession =
            propertyData.possession ||
            "";

        const pricePerSqft =
            propertyData.pricePerSqft ||
            ""; 

      return (
        <>
        <article className='group relative w-full min-w-[350px] overflow-hidden rounded-xl bg-white border border-gray-200 transition-all duration-300  hover:shadow-[0_5px_20px_rgba(0,40,80,0.18)]'>

          {/* for image */}
          <Link href={projectUrl} className="block">

            <div className='relative h-54 w-full overflow-hidden bg-gray-100'>
              
              <Image 
                src={bannerImage?.url || '/assets/project-banner.webp'}
                alt={bannerImage?.alt || projectName}
                fill={true}
                className='object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                priority={priority}
                sizes='(max-width:768px) 100vw, 400px'
              />

              { /* image overlay */ }
              <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#002B5B]/50 via-transparent to-[#002B5B]/10 pointer-events-none'/>

              { /* featured */ }
              {/* { project.tags === 'Featured Properties' && (
                <div className='absolute left-4 top-3 flex items-center gap-2 rounded-md bg-[#002B5B] px-3 py-1 text-xs font-medium text-white shadow-lg uppercase'>
                  <MdOutlineStarBorder size={15} fill='currentColor'/>
                  Featured
                </div>
              )} */}

              {/* LOCATION */}
              <div className="absolute bottom-3 left-0 bg-white/95 backdrop-blur-sm shadow-md text-[#002B5B] flex items-center rounded-r-lg shadow-gray-800 h-7 px-2.5" >
                  <MdOutlineLocationOn
                      size={17}
                      className="shrink-0 text-[#d51717e8]"
                  />
                  <span className=" truncate text-xs font-semibold text-[#002B5B]" >
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
                      className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors`}
                  />
              </div>

            </div>
          </Link>

          {/* content- description about the project */}
          <div className='px-5 py-3'>

            {/* STATUS */}
            {/* <div className="mb-3">
                <span className={`inline-flex rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider
                    ${ project.status === "active"
                      ? "bg-green-100 text-green-700"
                      : project.status === "pending" ||
                        project.approval === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                    }
                `}
                >
                    {project.approval === "pending" ? "Pending" : project.status || "For Sale"}
                </span>
            </div> */}

            {/* TITLE */}
            <Link href={projectUrl}>
                <h2 className="line-clamp-1 text-[16px] font-extrabold leading-tight tracking-tight text-[#002B5B] transition-colors hover:text-[#00437A]" >
                    {projectName}
                </h2>
            </Link>

            {/* LOCATION */}

            {/* <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-600 ">
                <MdOutlineLocationOn
                    size={19}
                    className="shrink-0 text-[#002B5B]"
                />

                <span className="truncate">
                    {locationName}
                </span>
            </div> */}
              
            {/* DESCRIPTION */}
            <p className="line-clamp-2 text-[12px] text-gray-500">
              {project.summary || project.address ||
                `${project.residenceType || "Property"} • ${
                    project.transactionTag || "For Sale"
                }`}
            </p>

            {/* property specs */}
            <div className='mt-3 grid divide-x divide-gray-200 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 grid-cols-4 divide-y-0'>
              <PropertySpec
                  icon={<MdOutlineApartment size={18} />}
                  value={bhk}
                  label="Type"
              />

              <PropertySpec
                  icon={<MdOutlineSquareFoot size={18} />}
                  value={area || "—"}
                  label="Area"
              />

              <PropertySpec
                  icon={<MdOutlineLayers size={18} />}
                  value={floors || "—"}
                  label="Floors"
              />

              <PropertySpec
                  icon={ <MdOutlineCalendarMonth size={18} />}
                  value={possession || "—"}
                  label="Possession"
              />
            </div>

            {/* amenities */}
            {amenities.length > 0 && (
              <div className="mt-3 rounded-lg bg-[#F4F7FA] p-2">
                <div className="flex flex-wrap gap-1">
                  {amenities.slice(0, 4).map( (amenity,index) => (
                    <AmenitySpec key={ amenity?.id ?? index  }
                      icon={amenity.image}
                      value=""
                      label={amenity?.name} 
                      // className="rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-[#002B5B] shadow-sm"
                    >
                    </AmenitySpec> )
                  )}

                  {amenities.length > 4 && (
                    <div className='flex flex-col items-center justify-center bg-white rounded-md'>
                      <span className="text-center rounded-full w-6 h-6 px-1 py-1 text-[11px] text-[#002B5B] font-semibold border border-dotted border-[#002B5B] " >
                        +{amenities.length - 4} 
                      </span>
                      <span className='mt-0.5 text-[8px] font-medium text-gray-500 w-12 text-center truncate  '>
                        More
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price */}
            <div className=" mt-3 border-t border-gray-200 pt-5 " >
              <div className=" flex items-end justify-between gap-4" >

                {/* PRICE */}
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-gray-500 ">
                    Price ranges
                  </p>
                  <p className="mt-1 truncate text-md font-extrabold leading-none text-[#002B5B] " >
                    {project.priceRange || "Price on Request"}
                  </p>

                  
                  <p className="mt-2 text-[10px] text-slate-400">
                    {project?.pricePerSqft || "₹10,400 / sq.ft"}
                  </p>
                

                </div>

                  <Link href={projectUrl}
                    className="flex shrink-0 items-end gap-1 rounded-xl bg-[#002B5B] px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#003D7A] hover:shadow-lg ">
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

    function PropertySpec({ icon, value, label,
    }: { icon: React.ReactNode; value: string; label: string;}) {
      return (
        <div className="flex min-w-0 flex-col items-center justify-center px-2 py-2 text-center " >
          <div className="mb-1 text-[#002B5B]">
              {icon}
          </div>
          <p className="max-w-full truncate text-[12px] font-bold text-[#002B5B] ">
              {value}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-gray-500">
              {label}
          </p>
        </div>
      );
    }

    function AmenitySpec({ icon, value, label,
    }: {icon?: string; value: string; label: string;}) {
      return (
        <div className="flex min-w-0 w-14 truncate flex-col items-center justify-center px-2 py-2 text-center bg-white rounded-md" >
          {icon && <Image
            src={icon}
            alt={label || "icon"}
            width={16}
            height={16}
            className="mb-1 text-[#002B5B] object-contain">
            </Image>     
          }

          <p className="mt-0.5 text-[8px] font-medium text-gray-500 w-12 text-center truncate">
              {label}
          </p>
        </div>
      );
    }

    export default memo(FeaturedProperty);

