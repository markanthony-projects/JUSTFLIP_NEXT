"use client"
import Image from '@/src/components/atoms/Image'
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import Modal from '@/src/components/organisms/Modal';
import React, { useEffect, useRef, useState } from 'react'
import Map from './Map';
import KeyEmployees from './KeyEmployees';
import DeveloperHistory from './DeveloperHistory';

function DeveloperDetailsClient(initialData) {
  // console.log("initialData", initialData?.initialData) //the data about the builder 
  const [ builder ] = useState(initialData?.initialData)
  // console.log(builder, "builder");
  const [isOpen, setIsOpen] = useState(false)
  const breadcrumbItems = [{ label: "Developers", href: "/developers" }, { label: builder?.name },];
  const logo = builder?.medias?.find((item) => item.title === "logo");
  const banner = builder?.medias?.find((item) => item.title === "banner");

  const maxLength = 500
  const isLong = builder?.description?.length > maxLength
  const shortText = isLong 
                    ? builder.description.slice(0, maxLength) + "..."
                    : builder?.description

  return (
    <div className=''>
      <div className="w-full h-screen relative" >
        <Breadcrumb items={breadcrumbItems} zTop={true} color="white" />

        <Image
          src={banner?.url}
          alt={`${builder?.name || "Developer"} banner`}
          className="h-full w-full object-cover brightness-60"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent opacity-70"></div>
        <div className="w-full absolute bottom-30 md:bottom-20  ">
          <figure className="flex-1 px-2 md:px-4 py-1  w-full  mx-auto md:max-w-[1440px]">
            <div className='w-16  md:w-20 h-20 '>
              <Image
                src={logo?.url}
                alt={builder?.name}
                className="w-full h-full rounded shadow"
              />
            </div>


            <figcaption className="mt-4 text-white">

              <h1 className="text-xl md:text-3xl font-bold">
                {builder?.name}
                {builder?.startedAt && <span className="text-white text-[12px] ml-2">Since {builder?.startedAt} </span>}
              </h1>

              <div>
                <p className="mt-3 text-[12px] md:text-base text-justify line-clamp-12">
                  {shortText}
                  {isLong && <span
                    onClick={() => setIsOpen(true)}
                    className="text-white underline font-semibold ml-1 hover:cursor-pointer"
                    >
                    Read more
                  </span>}
                </p>
              </div>
              
            </figcaption>
          </figure>
        </div>

        <Modal isOpen={isOpen} maxWidth="md:max-w-2xl" className='bg-white/40 backdrop-blur-2xl p-4 md:p-5' onClose={() => setIsOpen(false)}>
          <div className="">
            <div className="flex justify-between items-center">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-[#002B5B]"
              >
                {builder?.name}
              </h2>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-modern mt-3 text-justify text-sm pr-2">
              {builder?.description}
            </div>
          </div>

        </Modal>
      </div>

      { builder?.employees?.length > 0 && 
        (<div className='flex-1 px-2 md:px-4 py-4  w-full  mx-auto md:max-w-360'>
          <KeyEmployees employees={builder?.employees} />
      </div>)}

      {builder?.histories?.length > 0 && 
        (<div className="px-4 py-4 md:px-10 mb-2 w-full  mx-auto md:max-w-360">
        <DeveloperHistory history={builder?.histories}/>
      </div>)}

      <div className='flex-1 px-2 md:px-4 py-4  w-full  mx-auto md:max-w-[1440px]'>
        <section className="">
          <Map builder={builder} />
        </section>
      </div>
    </div>
  )
}

export default DeveloperDetailsClient