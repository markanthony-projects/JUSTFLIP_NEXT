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
      <div className="w-full relative">
        <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden">
          <Breadcrumb items={breadcrumbItems} zTop={true} color="white" />
          <Image
            src={banner?.url}
            alt={`${builder?.name || "Developer"} banner`}
            className="h-full w-full object-cover"
          />
          {/* Subtle Top & Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/40"></div>
        </div>

        {/* Info Card */}
        <div className="relative z-10 w-full px-2 md:px-8 lg:px-24 mx-auto -mt-14 sm:-mt-16 md:-mt-20">
          <div className="bg-white border border-gray-200/80 rounded-2xl md:rounded-3xl shadow-lg p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8">
            {/* Logo Container */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-200 shadow-md overflow-hidden flex items-center justify-center">
              <Image
                src={logo?.url}
                alt={builder?.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Builder Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:mb-3 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002B5B] tracking-tight">
                  {builder?.name}
                </h1>
                {builder?.startedAt && (
                  <span className="inline-flex items-center px-3 mx-auto md:mx-0 py-0.5 rounded-full bg-[#002B5B]/5 border border-[#002B5B]/15 text-[#002B5B] text-xs sm:text-sm font-medium">
                    <FiCheckCircle className="mr-1.5 text-[#002B5B]" />
                    Est. {builder?.startedAt}
                  </span>
                )}
              </div>

              <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                {/* Mobile text block */}
                <span className="block md:hidden">
                  {shortTextMobile}
                  {isLongMobile && (
                    <button
                      onClick={() => setIsOpen(true)}
                      className="ml-2 inline-flex items-center text-[#002B5B] underline hover:text-[#001f42] font-semibold transition-colors group"
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
                      className="ml-2 inline-flex items-center text-[#002B5B] underline hover:text-[#001f42] font-semibold transition-colors group"
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
      <Modal isOpen={isOpen} maxWidth="md:max-w-3xl" className='bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100' onClose={() => setIsOpen(false)}>
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
      <div className="w-full mx-auto px-2 md:px-8 lg:px-24 pt-8 md:pt-12 space-y-8 md:space-y-12">
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
          <div className="md:mb-4 mb-3 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#002B5B] tracking-tight">Our Projects</h2>
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