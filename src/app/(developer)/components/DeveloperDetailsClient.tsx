"use client"
import Image from '@/src/components/atoms/Image'
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import Modal from '@/src/components/organisms/Modal';
import React, { useState, useEffect } from 'react'
import Map from './Map';
import KeyEmployees from './KeyEmployees';
import DeveloperHistory from './DeveloperHistory';
import { Builder, Media } from '@/src/types';
import { FiCheckCircle } from 'react-icons/fi';

function DeveloperDetailsClient({ initialData }: { initialData?: Builder }) {

  const [builder] = useState<Builder | undefined>(initialData)
  const [isOpen, setIsOpen] = useState(false)
  const breadcrumbItems = [{ label: "Developers", href: "/developers" }, { label: builder?.name || "Developer" }];
  const logo = builder?.medias?.find((item: Media) => item.title === "logo");
  const banner = builder?.medias?.find((item: Media) => item.title === "banner");

  const maxLengthMobile = 200;
  const maxLengthDesktop = 450;

  const isLongMobile = (builder?.description?.length || 0) > maxLengthMobile;
  const shortTextMobile = isLongMobile
    ? builder?.description?.slice(0, maxLengthMobile) + "..."
    : builder?.description;

  const isLongDesktop = (builder?.description?.length || 0) > maxLengthDesktop;
  const shortTextDesktop = isLongDesktop
    ? builder?.description?.slice(0, maxLengthDesktop) + "..."
    : builder?.description;

  return (
    <div className='bg-[#F4F9FA] min-h-screen pb-20'>
      {/* Hero Section */}
      <div className="w-full h-[60vh] md:h-[70vh] relative flex flex-col justify-end">
        <Breadcrumb items={breadcrumbItems} zTop={true} color="white" />

        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={banner?.url}
            alt={`${builder?.name || "Developer"} banner`}
            className="h-full w-full object-cover scale-105 transform transition-transform duration-[20s] hover:scale-110"
          />
          {/* Rich Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#001f42]/90"></div>
        </div>

        {/* Glassmorphism Info Card */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-10 translate-y-18 md:translate-y-24">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-all duration-500 hover:bg-white/15">
            {/* Logo Container */}
            <div className="w-28 h-28 md:w-40 md:h-40 shrink-0 bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transform -translate-y-18 md:-translate-y-16 group">
              <Image
                src={logo?.url}
                alt={builder?.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Builder Details */}
            <div className="flex-1 text-center md:text-left -mt-22 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:mb-4 mb-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {builder?.name}
                </h1>
                {builder?.startedAt && (
                  <span className="inline-flex items-center px-3 mx-auto md:mx-0 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium backdrop-blur-md">
                    <FiCheckCircle className="mr-1.5 text-blue-900" />
                    Est. {builder?.startedAt}
                  </span>
                )}
              </div>

              <div className="text-gray-200 text-sm md:text-base leading-relaxed">
                {/* Mobile text block */}
                <span className="block md:hidden">
                  {shortTextMobile}
                  {isLongMobile && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="ml-2 inline-flex items-center text-blue-900 underline hover:text-blue-800 font-semibold transition-colors group"
                    >
                      Read more
                      <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </button>
                  )}
                </span>
                
                {/* Desktop text block */}
                <span className="hidden md:block">
                  {shortTextDesktop}
                  {isLongDesktop && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="ml-2 inline-flex items-center text-blue-900 underline hover:text-blue-800 font-semibold transition-colors group"
                    >
                      Read more
                      <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Modal */}
      <Modal isOpen={isOpen} maxWidth="md:max-w-3xl" className='bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl' onClose={() => setIsOpen(false)}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002B5B]">
            About {builder?.name}
          </h2>
        </div>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-modern text-gray-700 leading-relaxed pr-4 text-base">
          {builder?.description}
        </div>
      </Modal>

      {/* Content Sections */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 space-y-16 md:space-y-24">
        {(builder?.employees?.length ?? 0) > 0 && (
          <section>
            <KeyEmployees employees={builder?.employees} />
          </section>
        )}

        {(builder?.histories?.length ?? 0) > 0 && (
          <section>
            <DeveloperHistory history={builder?.histories || []} />
          </section>
        )}

        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#002B5B] tracking-tight">Our Projects</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#002B5B] to-blue-800 rounded-full mt-3"></div>
          </div>
          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100">
            <Map builder={builder} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default DeveloperDetailsClient