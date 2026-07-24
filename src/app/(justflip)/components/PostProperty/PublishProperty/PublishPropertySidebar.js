'use client'

import React from 'react'
import { IoCallOutline } from 'react-icons/io5'
import { FaWhatsapp } from 'react-icons/fa'

const PublishPropertySidebar = () => {
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
    <div className="md:hidden fixed right-3 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-full shadow-lg border border-slate-200 px-3 py-2 flex flex-col items-center">
            <div className='flex items-center gap-2'>
                <button
                    onClick={HandleCall}
                    className="w-7 h-7 rounded-full bg-[#002B5B] text-white flex items-center justify-center transition-transform hover:scale-105"
                >
                    <IoCallOutline size={18} />
                </button>

                <button
                    onClick={handleWhatsApp}
                    className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform hover:scale-105"
                >
                    <FaWhatsapp size={18} />
                </button>
            </div>
            {/* <span className="mt-2 text-[10px] font-semibold text-slate-600">
                Need Help
            </span> */}
        </div>
    </div>

  )
}

export default PublishPropertySidebar
