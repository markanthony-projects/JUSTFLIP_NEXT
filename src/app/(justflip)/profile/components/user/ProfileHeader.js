//the component is responsible for layout of the header containing the logo(name initials) and the basic user information
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/src/stores/auth.store'

import { FaMapLocationDot } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";



const ProfileHeader = ({ onEditClick }) => {
  const { user } = useAuthStore()
  console.log(user);
  // Safe date formatting
  const memberSince = user?.createdAt && !isNaN(new Date(user.createdAt)) ? 
                    new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : ''

  // Get initials safely
  const getInitials = name => {
    if (!name) return 'N.A.'
    
    return name.trim().split(' ').map(part => part.charAt(0).toUpperCase()).join('')
  }

  const initials = getInitials(user?.name)

  return (
    <div className='bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative'>
      
      {/* Cover banner with subtle gradient and animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='h-36 md:h-44 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 relative overflow-hidden'
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      </motion.div>

      {/* the mobile layout */}
      <div className='md:hidden flex flex-row items-center justify-center gap-2 relative'>

        <div  className='flex flex-col items-center px-4 pb-6'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="relative -mt-16 flex h-32 w-32 items-center justify-center rounded-full
                        bg-gradient-to-br from-slate-50 via-white to-blue-100
                        border-[6px] border-white
                        shadow-[0_20px_45px_rgba(37,99,235,0.18)]
                        text-5xl font-black text-blue-700"
            >
              {initials}

              {/* Soft inner ring */}
              <div className="absolute inset-0 rounded-full ring-1 ring-blue-100" />

              {/* Verification badge */}
              <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

        {/* name and badge of the user */}
        <div className='flex items-center gap-2 flex-wrap justify-center mb-2 mt-3'>
          <h1 className='text-xl font-bold text-gray-900'>{user?.name || "User"}</h1>
          <span className='text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50 shadow-sm'>
            {user?.authType === "broker" ? "Broker" : "Buyer"}
          </span>
        </div>

        {/* for the location of the user */}
        {user?.city && (
          <p className='text-sm text-gray-500 flex items-center gap-1.5 mb-1 font-medium'>
            <FaMapLocationDot className="text-blue-500" /> {user.city}
          </p>
        )}

         {/* Email — shown on mobile */}
        {user?.email && (
          <p className="text-sm text-gray-400 mb-1">{user.email}</p>
        )}
 
        {/* Phone — shown on mobile */}
        {user?.phone && (
          <p className="text-sm text-gray-400 mb-4">{user.phone}</p>
        )}
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEditClick}
          className="absolute top-4 right-4 shrink-0 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
          >
            <MdEdit size={14} />
            <span className="font-medium">Edit</span>
        </motion.button>

      </div>

{/* ------------------------------------------------------------------------------------------------------------------------- */}
      {/* the desktop layout */}
      <div className='hidden md:block px-8 pb-8'>
        <div className='flex flex-row items-end justify-between gap-6'>

          {/* Left section */}
          <div className='flex flex-col md:flex-row md:items-end gap-6 relative z-10'>
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="relative -mt-16 flex h-32 w-32 items-center justify-center rounded-full
                        bg-gradient-to-br from-slate-50 via-white to-blue-100
                        border-[6px] border-white
                        shadow-[0_20px_45px_rgba(37,99,235,0.18)]
                        text-5xl font-black text-blue-700"
            >
              {initials}

              {/* Soft inner ring */}
              <div className="absolute inset-0 rounded-full ring-1 ring-blue-100" />

              {/* Verification badge */}
              <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            {/* User Info */}
            <div className='flex flex-col gap-3 pb-4 mt-3'>
              <div className='flex items-center gap-3 flex-wrap'>
                <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                  {user?.name || 'User'}
                </h1>

                {/* Role badge */}
                <span className='text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50 shadow-sm'>
                  {user?.authType === "broker" ? "Broker" : 'Buyer'}
                </span>
              </div>

              {/* Location (fixed condition) */}
              <div className="flex flex-wrap items-center gap-5 mt-1 text-sm">
                {user?.city && (
                  <p className='flex items-center gap-2 text-gray-600 font-medium'>
                    <FaMapLocationDot className="text-blue-500" /> {user.city}
                  </p>
                )}

                {/* Member since + email */}
                <p className='flex items-center gap-2 text-sm text-gray-400 font-medium'>
                  {memberSince && <span>Member since {memberSince}</span>}
                  {memberSince && user?.email && <span className="text-gray-300">•</span>}
                  {user?.email && <span>{user.email}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEditClick}
            className="shrink-0 flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            >
              <MdEdit size={16} />
              <span>Edit Profile</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
