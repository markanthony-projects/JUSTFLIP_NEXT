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
import { FiEdit } from 'react-icons/fi'

const CONTACT_FIELDS = [
  { label: "Email",           field: "email"          },
  { label: "Phone",           field: "phone"          },
  { label: "Alt Phone",       field: "alternatePhone" },
  { label: "Team Members",    field: "teamSize"       },
  { label: "Annual Income",   field: "annualIncome"   },
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
        await AuthService.updateBrokerProfile(user.id, { profilePhoto: uploadedUrl });
        if (updateUser) updateUser({ profilePhoto: uploadedUrl });
        addToast({ message: 'Profile photo updated successfully', type: 'success' });
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
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">About Broker</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left Col - Avatar & Name */}
            <div className="flex flex-col items-center shrink-0 w-full md:w-48">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative shadow-md border-4 border-white bg-slate-50">
                      {user?.profilePhoto ? (
                      <Image src={user.profilePhoto}
                          alt={user.name} 
                          fill={true} 
                          className="object-cover" > 
                      </Image>
                      ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                          {user?.name?.charAt(0) || "B"}
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
                <p className="text-xl font-bold text-gray-900 tracking-tight text-center">{user?.name}</p>
                {user?.companyName && (
                  <p className="text-sm font-semibold text-[#002B5B] text-center mt-1">{user.companyName}</p>
                )}
                {user?.rera && (
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">RERA: {user.rera}</p>
                )}
                <div className="mt-3">
                    <StarRating rating={user?.averageRating} size="w-4 h-4" />
                </div>
            </div>
    
            {/* Right Col - Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 w-full border-t md:border-t-0 md:border-l border-gray-100/50 pt-6 md:pt-0 md:pl-8">
                {CONTACT_FIELDS.map(({ label, field }) => (
                    <div key={field} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                    <span className="text-[15px] font-medium text-slate-800 break-all" title={user?.[field]}>
                        {user?.[field] || "—"}
                    </span>
                    </div>
                ))}
                
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                    <span className="text-[15px] font-medium text-slate-800">{getExperience() || "—"}</span>
                </div>
                
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {user?.companyAddress ? "Company Address" : "Address"}
                    </span>
                    <span className="text-[15px] font-medium text-slate-800 leading-relaxed max-w-lg">
                    {user?.companyAddress || user?.address || "—"}
                    </span>
                </div>
            </div>

            {/* Third Col - Extra Business Details if they exist */}
            {(user?.missionAndVision || user?.expertiesIn?.length > 0 || user?.brokerOperatedCities?.length > 0) && (
              <div className="flex flex-col gap-8 w-full border-t md:border-t-0 md:border-l border-gray-100/50 pt-6 md:pt-0 md:pl-8">
                  {user?.expertiesIn?.filter(Boolean)?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expertise</span>
                        <div className="flex flex-wrap gap-2">
                          {user.expertiesIn.filter(Boolean).map((exp, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">{exp}</span>
                          ))}
                        </div>
                    </div>
                  )}

                  {user?.brokerOperatedCities?.filter(Boolean)?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Cities</span>
                        <div className="flex flex-wrap gap-2">
                          {user.brokerOperatedCities.filter(Boolean).map((cityObj, i) => {
                            const cityName = typeof cityObj === 'string' 
                              ? cityObj 
                              : (cityObj?.City?.name || cityObj?.City || cityObj?.name || "Unknown City");
                            return (
                              <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                                {String(cityName)}
                              </span>
                            );
                          })}
                        </div>
                    </div>
                  )}
                  
                  {user?.missionAndVision && (
                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mission & Vision</span>
                        <p className="text-[14px] font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                          "{user.missionAndVision}"
                        </p>
                    </div>
                  )}
              </div>
            )}

        </div>
    </div>
  )
}

export default BrokerAbout