'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/src/stores/auth.store'

import { useRouter } from 'next/navigation'

//icons import
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaArrowRight } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineBell, HiOutlineHome, HiOutlineSearch, HiOutlineDocumentText, HiOutlineHeart, HiOutlineCollection } from "react-icons/hi"
import { MdOutlineRealEstateAgent } from "react-icons/md"
import Image from 'next/image';
import StarRating from '@/src/components/atoms/StarRating';


const QUICK_LINKS = [
  { id: "my-profile", label: "My Profile", icon: <HiOutlineUser size={22} />, color: "text-[#002B5B]" },
  { id: "Property Status", label: "Property Status", icon: <HiBuildingOffice2 size={22} />, color: "text-[#002B5B]" },
  { id: "post-property", label: "Post a Property", icon: <HiOutlineHome size={22} />, color: "text-[#002B5B]", isLink: true, href: "/post-property" },
  { id: "wishlist", label: "Wishlist", icon: <HiOutlineHeart size={22} />, color: "text-[#002B5B]" },
  { id: "compare", label: "Compare", icon: <HiOutlineCollection size={22} />, color: "text-[#002B5B]", isLink: true, href: "/compare" },
];

const CONTACT_FIELDS = [
  { label: "Email",           field: "email"          },
  { label: "Phone",           field: "phone"          },
  { label: "Alt Phone", field: "alternatePhone" },
  { label: "Team Members",    field: "teamSize"       },
];

const BrokerSideBar = ({activeNav, setActivenav, onChangePassword}) => {
  const {user} = useAuthStore();
  const router = useRouter();
  
  const isApproved = user?.approval === "approved";

  // Calculate experience from startedAt
  const getExperience = () => {
    if (!user?.startedAt) return null;
    const start = new Date(user.startedAt);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years -= 1; months += 12; }
    return `${years} yr${years !== 1 ? "s" : ""} ${months} mo${months !== 1 ? "s" : ""}`;
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Quick Links */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Dashboard Menu</h3>
        <div className="flex flex-col gap-2">
          {QUICK_LINKS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                key={item.id}
                onClick={() => {
                  if (item.isLink) {
                    router.push(item.href)
                  } else {
                    setActivenav(item.id)
                  }
                }}
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

    </div>
  )
}

export default BrokerSideBar