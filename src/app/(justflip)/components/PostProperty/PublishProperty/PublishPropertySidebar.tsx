'use client'

import React from 'react'
import { IoCallOutline } from 'react-icons/io5'
import { FaWhatsapp } from 'react-icons/fa'

const PublishPropertySidebar = ({ compact }: { compact?: boolean }) => {
  const HandleCall = () => {
    window.location.href = 'tel:+918431362126'
  }

  const handleWhatsApp = () => {
    const message =
      'Hi, I am facing an issue while uploading property. Please help me.'
    const encodedMessage = encodeURIComponent(message)

    window.open(
      `https://wa.me/918431362126?text=${encodedMessage}`,
      '_blank'
    )
  }

  return (
    <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      
      <button
        onClick={HandleCall}
        className="group flex items-center justify-end"
      >
        <span className="mr-2 bg-[#002B5B] text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Call Us
        </span>

        <div className="w-12 h-12 rounded-full bg-[#002B5B] text-white flex items-center justify-center shadow-lg">
          <IoCallOutline size={22} />
        </div>
      </button>

      <button
        onClick={handleWhatsApp}
        className="group flex items-center justify-end"
      >
        <span className="mr-2 bg-[#25D366] text-white px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          WhatsApp
        </span>

        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg">
          <FaWhatsapp size={22} />
        </div>
      </button>

    </div>


  )
}

export default PublishPropertySidebar
