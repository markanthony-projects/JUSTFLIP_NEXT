'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

//store imports
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'
import AuthService from '@/src/services/AuthService'
import { JUSTFLIP } from '@/src/lib/axios/api'

//actions incons import .
import { MdOutlineLocationOn, MdVerified, MdOutlinePendingActions } from "react-icons/md";
import { TbMail, TbUserPlus } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";


const BrokerHeader = ({onEditClick, onUpdateClick}) => {
  const {user, updateUser} = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)
  const [isUploading, setIsUploading] = React.useState(false)
  console.log(user);
  
  const isApproved = user?.approval === "approved"
  const isPending = user?.approval === "pending"
  const isRejected = user?.approval === "rejected"

  const getInitials = (name) =>{
    if(!name) return "B"

    return name.trim().split(' ').map((part) => part.charAt(0).toUpperCase()).join();
  }
  const initials = getInitials(user?.companyName)
  // console.log(initials);

  // Parses the remarks object and returns the most recent entry.
  const getLatestRemark = () => {
    if (!user?.remarks) return null
    const entries = Object.entries(user.remarks)
    if (entries.length === 0) return null
    return entries.sort(([a], [b]) => new Date(b) - new Date(a))[0]
  }
  const handleImageUpdate = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [field]: true }));
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("directory", "BrokerAcccounts");

    try {
      const { data } = await JUSTFLIP.post("/cdn/upload", formDataUpload, { headers: { "Content-Type": "multipart/form-data" } });
      const uploadedUrl = data?.uploaded?.[0]?.url || data?.url;
      if (uploadedUrl) {
        await AuthService.updateBrokerProfile(user.id, { [field]: uploadedUrl });
        if (updateUser) updateUser({ [field]: uploadedUrl });
        addToast({ message: 'Image updated successfully', type: 'success' });
      } else {
        addToast({ message: 'Upload failed: No URL received', type: 'error' });
      }
    } catch (error) {
      addToast({ message: 'Error uploading photo', type: 'error' });
    } finally {
      setIsUploading(prev => ({ ...prev, [field]: false }));
    }
  };
  

  return (
    <div className='bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative'>

      {/* Cover — clean, professional slate background fallback */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className='h-40 md:h-56 relative w-full bg-[#1A2530] group'
      >
        {user?.officePhoto && (
          <Image src={user.officePhoto} 
            alt='office image' 
            className='object-cover' 
            fill={true} >
          </Image>
        )}
        
        {/* Subtle overlay for better contrast if needed, but keeping it clean */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        
        {/* Cover Upload Button (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-10">
          <label className="cursor-pointer bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:bg-white hover:shadow-md transition-all">
            {isUploading.officePhoto ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
            ) : (
              <>
                <FiEdit size={14} /> <span className="hidden sm:inline">Update Cover</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpdate(e, 'officePhoto')} className="hidden" disabled={isUploading.officePhoto} />
          </label>
        </div>
      </motion.div>

      <div className='px-4 pb-4 md:px-8 md:pb-8 relative'>

        {/* mobile layout */}
        <div className='flex flex-col items-center md:hidden'>

          {/* company's logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className='-mt-16 mb-4 z-10 relative'
          >
            <div className='w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-white'>
              {user?.companyLogo ? (
                <Image alt="the company's logo" 
                  src={user?.companyLogo} 
                  fill={true} 
                  className='object-cover'>
                </Image>
              ) : (
                <div className='w-full h-full flex items-center justify-center text-[#002B5B] text-4xl font-bold bg-slate-50'>
                  {initials}
                </div>
              )}
            </div>
            
            {/* Logo Upload Button (Bottom-Right) */}
            <div className="absolute -bottom-2 -right-2 z-20">
              <label className="cursor-pointer bg-white text-gray-700 border border-gray-200 shadow-md text-xs font-semibold px-2 py-1.5 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors w-8 h-8">
                {isUploading.companyLogo ? (
                  <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                ) : (
                  <FiEdit size={14} />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpdate(e, 'companyLogo')} className="hidden" disabled={isUploading.companyLogo} />
              </label>
            </div>
          </motion.div>

          {/* approval status banners - for mobile */}
          {isPending && (
            <div className='flex items-center gap-2 text-blue-600 mb-3 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100'>
              <MdOutlinePendingActions size={16} />
              <span className='text-xs font-bold tracking-wide uppercase'>Profile under review</span>
            </div>
          )}
          {isRejected && (
            <div className='flex items-center gap-2 text-red-600 mb-3 bg-red-50 px-4 py-1.5 rounded-full border border-red-100'>
              <span className='text-xs font-bold tracking-wide uppercase'>Profile Rejected</span>
            </div>
          )}

          <div className='flex items-center gap-2 mb-1 justify-center text-center'>
            <h1 className='text-2xl font-bold text-gray-900'>
              {user?.companyName || user?.name}
            </h1>
            {isApproved && <MdVerified className="text-blue-500" size={24}/>}
          </div>
          {user?.missionAndVision && (
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-1 mb-4 text-center px-4 leading-relaxed">
              "{user.missionAndVision}"
            </p>
          )}

          {/* the rera certified or id  */}
          {user?.rera && (
            <div className='flex items-center justify-center gap-2 mt-1 mb-5 flex-wrap'>
              <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide">
                RERA: {user.rera}
              </span>
              <span className='bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm'>
                <MdVerified size={14} /> Verified
              </span>
            </div>
          )}

          {/* the company address */}
          {user?.companyAddress && (
            <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5 mt-1 mb-4 text-center bg-gray-50/50 px-4 py-2 rounded-xl">
              <MdOutlineLocationOn className="text-blue-500" size={16} /> {user.companyAddress}
            </p>
          )}

          {/* Edit / Update button — mobile */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={isRejected ? onUpdateClick : onEditClick}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-sm
              ${isRejected 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200'}`}
          >
            {isRejected ? "Update Profile" : "Edit Profile"} <FiEdit size={16} />
          </motion.button>

           {/* Rejected remarks — mobile */}
          {isRejected && latestRemark && (
            <div className='mt-4 w-full p-4 bg-red-50/50 border border-red-100 rounded-xl'>
              <p className='text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5'>Required Updates</p>
              <p className='text-xs text-red-400 font-medium mb-2'>{new Date(latestRemark[0]).toLocaleString()}</p>
              <p className='text-sm text-red-800 font-medium leading-relaxed'>{latestRemark[1]}</p>
            </div>
          )}

        </div>


        {/* the desktop layout  */}
        <div className='hidden md:block'>
          <div className='flex items-end justify-between gap-6'>

            {/* logo + company's details */}
            <div className='flex items-end gap-6 relative z-10'>
              {/* logo */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className='-mt-20 shrink-0 relative'
              >
                <div className='w-36 h-36 rounded-full border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden relative bg-white'>
                  {user?.companyLogo ? (
                    <Image alt="the company's logo" 
                      src={user?.companyLogo} 
                      fill={true} 
                      className='object-cover'>
                    </Image>
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-[#002B5B] text-5xl font-bold bg-slate-50'>
                      {initials}
                    </div>)}
                </div>
                
                {/* Logo Upload Button (Bottom-Right) */}
                <div className="absolute -bottom-3 -right-3 z-20">
                  <label className="cursor-pointer bg-white text-gray-700 border border-gray-200 shadow-lg text-xs font-semibold px-2 py-2 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all w-10 h-10">
                    {isUploading.companyLogo ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    ) : (
                      <FiEdit size={16} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpdate(e, 'companyLogo')} className="hidden" disabled={isUploading.companyLogo} />
                  </label>
                </div>
              </motion.div>

              {/* company info */}
              <div className="pb-2">
                <div className="flex gap-3 mb-2">
                  {isPending && ( 
                    <div className='flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100'>
                      <MdOutlinePendingActions size={14} />
                      <span className='text-[10px] font-bold uppercase tracking-wider'>Under Review</span>
                    </div>
                  )}
                  {isRejected && (
                    <div className='flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100'>
                      <span className='text-[10px] font-bold uppercase tracking-wider'>Rejected</span>
                    </div>
                  )}
                </div>
                
                {/* the company name */}
                <div className='flex items-center gap-3'>
                  <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                    {user?.companyName || user?.name}
                  </h1>
                  {isApproved && <MdVerified className="text-blue-500 drop-shadow-sm" size={28} />}
                </div>
                
                {user?.missionAndVision && (
                  <p className="text-sm font-medium text-gray-500 mt-2 max-w-2xl leading-relaxed">
                    "{user.missionAndVision}"
                  </p>
                )}

                {/* address and rera information*/}
                <div className='flex items-center gap-4 flex-wrap mt-4'>
                  {/* the rera information */}
                  {user?.rera && (
                    <div className='flex items-center gap-2'>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wide">
                        RERA: {user.rera}
                      </span>
                      <span className='border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 font-bold tracking-wide text-xs uppercase shadow-sm flex items-center gap-1'>
                        <MdVerified size={14} /> Verified
                      </span>
                    </div>
                  )}

                  {/* address */}
                  {user?.companyAddress && (
                    <p className='text-sm text-gray-600 font-medium flex items-center gap-1.5 bg-gray-50/50 px-4 py-1.5 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-colors'>
                      <MdOutlineLocationOn className="text-blue-500" size={16} /> {user.companyAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={isRejected ? onUpdateClick : onEditClick}
                className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm shrink-0
                  ${isRejected 
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                    : 'bg-[#002B5B] text-white border border-[#002B5B] hover:bg-[#001f42] shadow-md hover:shadow-lg'}`}
              >
                {isRejected ? "Update Profile" : "Edit Profile"} <FiEdit size={16} />
            </motion.button>

          </div>

          {/* Rejected remarks — desktop */}
          {isRejected && latestRemark && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className='mt-6 p-5 bg-red-50/50 border border-red-100 rounded-2xl relative overflow-hidden'
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <p className='text-xs font-bold uppercase tracking-widest text-red-600 mb-1'>Required Updates</p>
              <p className='text-[11px] text-red-400 font-medium mb-3'>{new Date(latestRemark[0]).toLocaleString()}</p>
              <p className='text-sm text-red-800 font-medium leading-relaxed max-w-3xl'>{latestRemark[1]}</p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}

export default BrokerHeader