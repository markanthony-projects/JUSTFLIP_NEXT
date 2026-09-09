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
  

  const builderName =typeof details?.builder === 'string' ? details?.builder : details?.builder?.name || (details as any)?.builder?.name || ''
  const configurations = details?.configurations || project?.summary || ''
  const bookingLabel = daysToBooking === null ? 'Booking details soon' : daysToBooking === 0 ? 'Booking opens today' : daysToBooking < 0 ? `opened ${Math.abs(daysToBooking)}d ago` : `Booking opens in ${daysToBooking}d`;
  const minPrice = convertToCurrency(details?.units?.[0].minPrice) || "requested"

  return (
    <>
      <article className="group relative flex w-87.5 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition-all duration-300  hover:shadow-[0_5px_20px_rgb(0,0,0,0.05)] hover:border-gray-300">
        
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
            <div className='absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-primary/50 via-transparent to-primary/10 pointer-events-none'/>

            {/* BADGES + FAVOURITE */}
            {details?.rera !== null ? (
              <span className="absolute left-0 top-4 flex gap-0.5 rounded-r-lg bg-primary/40 pl-3 pr-4 py-1.5 text-xs font-medium text-white uppercase backdrop-blur-sm shadow-sm shadow-gray-800">
                RERA 
                <MdVerified className="size={15} ml-1" fill='currentColor'/>
              </span>
            ) : (
              <span />
            )}

            {/* LOCATION */}
            <div className="absolute bottom-3 left-0 bg-white/95 backdrop-blur-sm shadow-md text-primary flex items-center rounded-r-lg shadow-gray-800 h-7 px-2.5" >
              <MdOutlineLocationOn size={17} className="shrink-0 text-[#d51717e8]"/>
              <span className="truncate text-xs font-semibold text-primary" >
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

            {/* BOOKING COUNTDOWN */}
            <div className="absolute bottom-3 right-0 flex items-center gap-1 rounded-l-lg bg-primary h-7 px-2.5 text-white">
              <MdOutlineTimer size={14} />
              <span className="whitespace-nowrap text-[11px] font-medium">
                {bookingLabel}
              </span>
            </div>
          </div>
        </Link>

        {/* CONTENT SECTION */}
        <div className="px-5 py-3 border border-gray-200 border-t-0">
          <div className="flex items-start justify-between gap-4">
            <Link href={projectUrl}>
              <h3 className="line-clamp-1 text-[16px] font-extrabold leading-tight tracking-tight text-primary transition-colors hover:text-[#00437A]">
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
            <p className="line-clamp-1 text-[12px] text-gray-500">
              {builderName && `by ${builderName}`}
            </p>
            <p className="line-clamp-1 text-[10px] text-gray-500">
              {configurations}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3" >
            <div className="flex items-end justify-between gap-4" >

              {/* PRICE */}
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-500 ">
                Launch Price From
                </p>
                <p className="mt-0.5 truncate text-md font-extrabold leading-none text-primary " >
                  { minPrice || '₹ 1.25 CR'}
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
          closeModal={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};

export default NewLaunhesProperty