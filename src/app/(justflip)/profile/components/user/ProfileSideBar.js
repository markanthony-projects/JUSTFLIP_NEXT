'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/src/stores/auth.store'
import Image from 'next/image'

// Icons import
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineBell, HiOutlineHome, HiOutlineSearch, HiOutlineDocumentText, HiOutlineHeart, HiOutlineCollection } from "react-icons/hi"
import { HiBuildingOffice2 } from "react-icons/hi2"
import { FaArrowRight } from "react-icons/fa6"
import { MdOutlineRealEstateAgent } from "react-icons/md"

const ProfileSideBar = ({ activeNav, setActiveNav }) => {
  const { user } = useAuthStore()
  const router = useRouter()

  const NAV_ITEMS = [
    { id: "overview", label: "My Profile", icon: <HiOutlineUser size={22} />, color: "text-[#002B5B]" },
    { id: "post-property", label: "Post a Property", icon: <HiOutlineHome size={22} />, color: "text-[#002B5B]", isLink: true, href: "/post-property" },
    { id: "my-properties", label: "Posted Properties", icon: <HiOutlineDocumentText size={22} />, color: "text-[#002B5B]" },
    { id: "wishlist", label: "Wishlist", icon: <HiOutlineHeart size={22} />, color: "text-[#002B5B]" },
    { id: "compare", label: "Compare", icon: <HiOutlineCollection size={22} />, color: "text-[#002B5B]", isLink: true, href: "/compare" },
  ];

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.trim().split(' ').map(part => part.charAt(0).toUpperCase()).join('')
  }
  const initials = getInitials(user?.name)

  const handleNavClick = (item) => {
    console.log("Clicked:", item);

    if (item.isLink) {
      console.log("Router push:", item.href);
      router.push(item.href);
    } else {
      console.log("Setting activeNav:", item.id);
      setActiveNav(item.id);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Navigation */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Dashboard</h3>
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between rounded-xl gap-3 px-4 py-3.5 text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? "bg-[#002B5B] text-white shadow-md shadow-[#002B5B]/20"
                    : "text-gray-600 hover:bg-[#E6EEF2]/50 hover:text-[#002B5B] hover:shadow-sm"
                  }`}
              >
                <div className='flex gap-3 items-center'>
                  <span className={isActive ? "text-white" : item.color}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <motion.span 
                  animate={{ x: isActive ? 0 : -5, opacity: isActive ? 1 : 0 }}
                  className={isActive ? "text-white/80" : "text-gray-300"}
                >
                  <FaArrowRight size={14} />
                </motion.span>
              </motion.button>
            )
          })}
        </div>
      </div>

       {/* User personal info card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">About You</h3>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#E6EEF2] mb-4 relative shadow-sm border-2 border-white transition-transform duration-300">
            {user?.profilePhoto ? (
              <Image src={user.profilePhoto}
                alt={user.name} 
                fill={true} 
                className="object-cover" > 
              </Image>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#002B5B] text-3xl font-bold">
                {initials}
              </div>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 tracking-tight">{user?.name || "User"}</p>
          <span className='text-[10px] font-bold tracking-wider uppercase px-3 py-1 mt-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50 shadow-sm'>
            {user?.authType || 'Buyer'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSideBar
