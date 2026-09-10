'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/auth.store';
import { 
  HiOutlineGlobeAlt, 
  HiOutlineShieldCheck, 
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineDocumentText,
  HiOutlineTrash
} from 'react-icons/hi';
import NotificationsSection from '../../profile/components/user/NotificationsSection';

const SettingsMain = () => {
  const router = useRouter();
  const { authType, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  console.log(authType)

  return (
    <div className="py-2 max-w-4xl mx-auto">
      
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your application preferences, security, and notifications.</p>
      </div>

      <div className="space-y-6">

        {/* Account Security */}
        {authType === "broker" && 
          (<div className="bg-white border border-[#E6EEF2] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
           <div className="px-5 py-3.5 bg-gradient-to-r from-[#F4F7F9] to-white border-b border-[#E6EEF2] flex items-center gap-3">
             <div className="bg-white p-1.5 rounded-lg shadow-sm">
               <HiOutlineShieldCheck className="text-primary" size={20} />
             </div>
             <h2 className="text-base font-bold text-primary">Account Security</h2>
           </div>
           
           <div className="px-5 py-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/50 p-5 rounded-lg border border-blue-100">
               <div>
                  <h3 className="font-semibold text-primary text-sm">Password</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-md">Ensure your account stays secure by changing your password regularly.</p>
               </div>
               <button className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-[#001F42] transition-all shadow-sm shadow-primary/20 whitespace-nowrap active:scale-95">
                 Change Password
               </button>
             </div>
           </div>
         </div>)}

        {/* Notifications Section */}
        <div className="bg-white border border-[#E6EEF2] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
           <div className="px-5 py-3.5 bg-gradient-to-r from-[#F4F7F9] to-white border-b border-[#E6EEF2] flex items-center gap-3">
               <div className="bg-white p-1.5 rounded-lg shadow-sm">
                 <HiOutlineBell className="text-primary" size={20} />
               </div>
               <h2 className="text-base font-bold text-primary">Notifications</h2>
           </div>
           <div className="px-5 py-4">
             <NotificationsSection />
           </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white border border-[#E6EEF2] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
           <div className="px-5 py-3.5 bg-gradient-to-r from-[#F4F7F9] to-white border-b border-[#E6EEF2] flex items-center gap-3">
             <div className="bg-white p-1.5 rounded-lg shadow-sm">
               <HiOutlineDocumentText className="text-primary" size={20} />
             </div>
             <h2 className="text-base font-bold text-primary">Privacy & Data</h2>
           </div>
           
           <div className="px-5 py-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-lg border border-gray-200 gap-4 shadow-sm hover:border-blue-200 transition-colors">
                 <div>
                   <p className="font-semibold text-primary text-sm">Cookie Preferences</p>
                   <p className="text-xs text-gray-500 mt-1">Manage how we use cookies and tracking across the site.</p>
                 </div>
                 <button className="text-sm font-semibold text-primary hover:text-white hover:bg-primary bg-white px-6 py-2 rounded-md border border-primary shadow-sm transition-all active:scale-95">
                   Manage
                 </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-red-50/50 rounded-lg border border-red-200 gap-4 mt-2">
                 <div>
                   <p className="font-semibold text-red-700 text-sm">Delete Account</p>
                   <p className="text-xs text-red-500/80 mt-1">Permanently delete your account and all associated data. This action is irreversible.</p>
                 </div>
                 <button className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md border border-red-600 transition-all shadow-sm whitespace-nowrap active:scale-95">
                   <HiOutlineTrash size={16} />
                   Delete Account
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Logout */}
      <div className="pt-8 pb-4 border-t border-gray-200 mt-8">
        <button 
           onClick={handleLogout}
           className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#E6EEF2] text-primary hover:bg-[#F4F7F9] hover:border-primary rounded-md font-bold text-sm transition-all shadow-sm w-full sm:w-auto ml-auto"
        >
           <HiOutlineLogout size={18} />
           Sign Out
        </button>
      </div>

    </div>
  );
};

export default SettingsMain;
