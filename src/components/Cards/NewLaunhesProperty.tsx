  'use client';

  import React, { memo, useEffect, useState, useMemo } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';

  import { Project } from '@/src/types';
  import { createProjectUrl } from '@/src/utils/url';
  import * as ProjectService from '@/src/services/ProjectService';

  // Icons import
  import {
    MdLocationOn,
    MdOutlineArrowForward,
    MdOutlineLocationOn,
    MdOutlineTimer,
    MdVerified,
  } from 'react-icons/md';

  import FavouriteButton from '../atoms/FavouriteButton';
  import LoginModal from '../organisms/LoginModal';
  import { convertToCurrency } from '@/src/utils/RenderFunction';

  interface NewLaunchPropertyProps {
    project: Project;
    priority?: boolean;
  }


  function calculateDaysUntil(dateString?: string): number | null {
    if (!dateString) return null;

    const targetDate = new Date(dateString);
    if (Number.isNaN(targetDate.getTime())) return null;

    const today = new Date();

    // Normalize hours to midnight for accurate calendar day count
    const targetMidnight = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );

    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }


  const NewLaunhesProperty = ({ project, priority }: NewLaunchPropertyProps) => {
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [details, setDetails] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [daysToBooking, setDaysToBooking] = useState<number | null>(null);

    const locationName = project?.location?.name || '';
    const projectName = project?.name || '';
    const projectId = project?.id;

    const bannerImage = project?.banner || project?.medias?.find((m: any) => m.title === 'banner') || project?.medias?.[0];

    const projectUrl = useMemo(
      () =>
        createProjectUrl(
          project?.city?.name || '',
          project?.location?.zone?.name || '',
          project?.location?.name || '',
          project?.name || '',
          project?.id || ''
        ),
      [project]
    );

    useEffect(() => {
      if (!projectId) return;
      let mounted = true;

      const fetchDetails = async () => {
        try {
          const response = await ProjectService.fetchProjectById(projectId);
          if (mounted) {
            setDetails(response);
          }
        } catch (error) {
          console.error('Failed to fetch project details:', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      fetchDetails();

      return () => {
        mounted = false;
      };
    }, [projectId]);


    useEffect(() => {
      setDaysToBooking(calculateDaysUntil(details?.possessionDate));
    }, [details?.possessionDate]);


    const builderName = typeof details?.builder === 'string' ? details?.builder : details?.builder?.name || (details as any)?.builder?.name || ''
    const configurations = details?.configurations || project?.summary || ''
    const bookingLabel = daysToBooking === null ? 'Booking details soon' : daysToBooking === 0 ? 'Booking opens today' : daysToBooking < 0 ? `opened ${Math.abs(daysToBooking)}d ago` : `Booking opens in ${daysToBooking}d`;
    const minPrice = convertToCurrency(details?.units?.[0].minPrice) || "requested"

    return (
      <>
        <article className="group relative flex sm:w-87.5 w-[calc(100vw-100px)] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-gray-300">

          {/* IMAGE SECTION */}
          <Link href={projectUrl} className="block relative">
            <div className="relative h-44 sm:h-48 md:h-54 w-full overflow-hidden bg-gray-100">
              <Image
                src={bannerImage?.url || '/assets/project-banner.webp'}
                alt={bannerImage?.alt || projectName}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority={priority}
                sizes="(max-width:768px) 100vw, 400px"
              />

              {/* Overlay Gradient */}
              <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-primary/50 via-transparent to-primary/10 pointer-events-none' />

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
              <MdOutlineLocationOn className="shrink-0 text-[#d51717e8] sm:size-4.5 size-3.5"/>
              <span className=" truncate sm:text-xs text-[10px] font-semibold text-primary" >
                {locationName}
              </span>
            </div>

              {/* FAVOURITE */}
              <div className=" absolute right-4 top-4 z-20 "
                onClick={(e) => e.stopPropagation()}
              >
                <FavouriteButton
                  project={project}
                  onAuthRequired={() => setShowLoginPrompt(true)}
                  className={`p-2 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm shadow-gray-800 hover:bg-red-50 transition-colors`}
                />
              </div>

              {/* BOOKING COUNTDOWN */}
              <div className="absolute bottom-2 sm:bottom-3 right-0 flex items-center gap-1 rounded-l-lg bg-primary h-6 sm:h-7 px-2 sm:px-2.5 text-white">
                <MdOutlineTimer className='size-3.5 sm:size-4' />
                <span className="whitespace-nowrap text-[9px] sm:text-[11px] font-medium">
                  {bookingLabel}
                </span>
              </div>
            </div>
          </Link>

          {/* CONTENT SECTION */}
          <div className="sm:px-5 sm:py-3 px-4 py-2.5 border border-gray-200 border-t-0">
            <div className="flex items-start justify-between gap-4">
              <Link href={projectUrl}>
                <h3 className="line-clamp-1 sm:text-[16px] text-[14px] mb-0.5 font-extrabold leading-tight tracking-tight text-primary transition-colors hover:text-[#00437A]">
                  {projectName}
                </h3>
              </Link>

              <Link
                href={`${projectUrl}?openMap=true`}
                className="hidden sm:flex shrink-0 text-[12px] font-semibold text-primary hover:underline text-center items-center gap-0.5"
              >
                <MdLocationOn className="text-[14px] text-[#d51717e8]" />
                <span>See in map</span>
              </Link>

              <Link
                href={`${projectUrl}?openMap=true`}
                className="text-[12px] font-semibold text-center sm:hidden"
              >
                <Image
                  src="/icons/MapLocation.svg"
                  height={20}
                  width={40}
                  alt="See in map"
                />
              </Link>
            </div>

            <div>
              <p className="line-clamp-1 sm:text-[12px] text-[11px] sm:leading-tight leading-none mb-1 text-primary/70">
                {builderName && `by ${builderName}`}
              </p>
              <p className="line-clamp-1 sm:text-[10px] text-[9px] leading-none sm:leading-tight text-primary/70">
                {configurations}
              </p>
            </div>

            <div className="border-t border-gray-200 sm:pt-3 sm:mt-3 pt-2 mt-2" >
              <div className="flex items-end justify-between gap-4" >

                {/* PRICE */}
                <div className="min-w-0">
                <p className="sm:text-[11px] text-[9px] leading-none sm:leading-tight font-medium text-primary/70">
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
    );
  };

  export default NewLaunhesProperty