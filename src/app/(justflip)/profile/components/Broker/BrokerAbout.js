'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'
import AuthService from '@/src/services/AuthService'
import { JUSTFLIP } from '@/src/lib/axios/api'
import StarRating from '@/src/components/atoms/StarRating'

//icons
import { 
  FiEdit, 
  FiMail, 
  FiPhoneCall, 
  FiPhone, 
  FiUsers, 
  FiDollarSign, 
  FiBriefcase, 
  FiMapPin, 
  FiAward, 
  FiTarget,
  FiMap 
} from 'react-icons/fi'

const CONTACT_FIELDS = [
  { label: "Email",           field: "email",          icon: FiMail },
  { label: "Phone",           field: "phone",          icon: FiPhoneCall },
  { label: "Alt Phone",       field: "alternatePhone", icon: FiPhone },
  { label: "Team Members",    field: "teamSize",       icon: FiUsers },
  { label: "Annual Income",   field: "annualIncome",   icon: FiDollarSign },
];

const BrokerAbout = () => {
  const { user, updateUser } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleImageUpdate = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("directory", "BrokerAcccounts");

    try {
      const { data } = await JUSTFLIP.post("/cdn/upload", formDataUpload, { headers: { "Content-Type": "multipart/form-data" } });
      const uploadedUrl = data?.uploaded?.[0]?.url || data?.url;
      if (uploadedUrl) {
        await AuthService.updateBrokerProfile(user.id, { companyLogo: uploadedUrl });
        if (updateUser) updateUser({ companyLogo: uploadedUrl });
        addToast({ message: 'Company logo updated successfully', type: 'success' });
      } else {
        addToast({ message: 'Upload failed: No URL received', type: 'error' });
      }
    } catch (error) {
      addToast({ message: 'Error uploading photo', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">About Company</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left Col - Avatar & Name */}
            <div className="flex flex-col items-center shrink-0 w-full md:w-56">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative shadow-md border-4 border-white bg-slate-50">
                      {user?.companyLogo ? (
                      <Image src={user.companyLogo}
                          alt={user.companyName || user.name} 
                          fill={true} 
                          className="object-cover" > 
                      </Image>
                      ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                          {user?.companyName?.charAt(0) || user?.name?.charAt(0) || "C"}
                      </div>
                      )}
                  </div>
                  
                  {/* Upload Button (Bottom-Right) */}
                  <div className="absolute -bottom-2 -right-2 z-20">
                    <label className="cursor-pointer bg-white text-gray-700 border border-gray-200 shadow-sm text-xs font-semibold px-2 py-1.5 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors w-8 h-8">
                      {isUploading ? (
                        <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                      ) : (
                        <FiEdit size={14} />
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpdate} className="hidden" disabled={isUploading} />
                    </label>
                  </div>
                </div>
                {user?.companyName && (
                  <p className="text-xl font-bold text-gray-900 tracking-tight text-center">{user.companyName}</p>
                )}
                <p className="text-sm font-semibold text-[#002B5B] text-center mt-1">Broker: {user?.name}</p>
                {user?.rera && (
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">RERA: {user.rera}</p>
                )}
                <div className="mt-3">
                    <StarRating rating={user?.averageRating} size="w-4 h-4" />
                </div>
            </div>
    
            {/* Right Col - All Details */}
            <div className="flex flex-col gap-8 w-full min-w-0 md:border-l border-gray-100/50 md:pl-8">
                
                {/* Contacts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6 w-full">
                    {CONTACT_FIELDS.map(({ label, field, icon: Icon }) => (
                        <div key={field} className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Icon size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
                          </div>
                          <span className="text-[15px] font-medium text-slate-800 break-words" title={user?.[field]}>
                              {user?.[field] || "—"}
                          </span>
                        </div>
                    ))}
                    
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FiBriefcase size={14} />
                          <span className="text-[11px] font-bold uppercase tracking-wider">Experience</span>
                        </div>
                        <span className="text-[15px] font-medium text-slate-800">{getExperience() || "—"}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <FiMapPin size={14} />
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            {user?.companyAddress ? "Company Address" : "Address"}
                          </span>
                        </div>
                        <span className="text-[15px] font-medium text-slate-800 leading-relaxed max-w-lg">
                          {user?.companyAddress || user?.address || "—"}
                        </span>
                    </div>
                </div>

                {/* Extra Business Details */}
                {(user?.missionAndVision || user?.expertiesIn?.length > 0 || user?.brokerOperatedCities?.length > 0) && (
                  <div className="flex flex-col gap-8 w-full border-t border-gray-100/50 pt-8">
                      {((user?.expertiesIn?.filter(Boolean)?.length > 0) || (user?.brokerOperatedCities?.filter(Boolean)?.length > 0)) && (
                        <div className="flex flex-wrap gap-x-12 gap-y-6 w-full">
                            {user?.expertiesIn?.filter(Boolean)?.length > 0 && (
                              <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <FiAward size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Expertise</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {user.expertiesIn.filter(Boolean).map((exp, i) => (
                                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
                                        {exp}
                                      </span>
                                    ))}
                                  </div>
                              </div>
                            )}

                            {user?.brokerOperatedCities?.filter(Boolean)?.length > 0 && (
                              <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <FiMap size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Operating Cities</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {user.brokerOperatedCities.filter(Boolean).map((cityObj, i) => {
                                      const cityName = typeof cityObj === 'string' 
                                        ? cityObj 
                                        : (cityObj?.City?.name || cityObj?.City || cityObj?.name || "Unknown City");
                                      return (
                                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
                                          {String(cityName)}
                                        </span>
                                      );
                                    })}
                                  </div>
                              </div>
                            )}
                        </div>
                      )}
                      
                      {user?.missionAndVision && (
                        <div className="flex flex-col gap-2 min-w-0 mt-2">
                            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                              <FiTarget size={14} />
                              <span className="text-[11px] font-bold uppercase tracking-wider">Mission & Vision</span>
                            </div>
                            <p className="text-[14px] font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4 py-1 break-words whitespace-pre-wrap bg-slate-50/50 rounded-r-xl">
                              "{user.missionAndVision}"
                            </p>
                        </div>
                      )}
                  </div>
                )}
            </div>

        </div>
    </div>
  )
}

export default BrokerAbout