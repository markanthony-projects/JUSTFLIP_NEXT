'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

//stores import
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store';

//global component
import Breadcrumb from '@/src/components/organisms/breadCrumb';

//components import
import Loading from '../Loading';
import BrokerHeader from './BrokerHeader';
import BrokerStats from './BrokerStats';
import BrokerAbout from './BrokerAbout';
import BrokerProjects from './BrokerProjects';
import BrokerReviews from './BrokerReviews';
import BrokerSideBar from './BrokerSideBar';
import BrokerPropertyDashboard from './BrokerPropertyDashboard';
import WishlistClient from '@/src/app/(justflip)/wishlist/WishlistClient';
import BrokerEditModal from './BrokerEditModal';



const BrokerProfile = () => {
    const { user, hydrated } = useAuthStore(); //we are getting these informations from the auth store.
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [activeNav, setActivenav] = useState('Property Status');

    useEffect(() => {
        if (tabParam) {
            if (tabParam === 'dashboard') {
                setActivenav('Property Status');
            } else {
                setActivenav(tabParam);
            }
        }
    }, [tabParam]);

    // Modal state — centralized here
    const [isEditModalOpen,     setIsEditModalOpen]     = useState(false);
    const [isUpdateModalOpen,   setIsUpdateModalOpen]   = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   
    const addToast = useToastStore((state) => state.addToast) //we are getting the useToast function from the toast store.

    // Hydration guard — wait for Zustand persist to load from localStorage
    if(!hydrated){  
        return(
            <Loading/>
        )
    }


  return (
    <div className='mb-10 min-h-screen'>
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb className='mb-6' items={[{label:'Broker Profile'}]}/>
        </motion.div>
        
        {/* main layout */}
        <div className='flex flex-col gap-8 mt-6 max-w-6xl mx-auto'>
            <motion.div 
                className='flex flex-col gap-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
                {activeNav === 'my-profile' && (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <BrokerHeader 
                                onEditClick={() => setIsEditModalOpen(true)}
                                onUpdateClick={() => setIsUpdateModalOpen(true)}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <BrokerStats />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <BrokerAbout />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <BrokerProjects />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <BrokerReviews />
                        </motion.div>
                    </>
                )}

                {activeNav === 'Property Status' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <BrokerPropertyDashboard />
                    </motion.div>
                )}

                {activeNav === 'security' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 tracking-tight mb-2'>Account Security</h2>
                    <p className="text-gray-500 mb-6">Manage your password and security settings here.</p>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20">
                        Change Password
                    </button>
                    </motion.div>
                )}

                {activeNav === 'notifications' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center'>
                        <h2 className='text-xl font-bold text-gray-900'>Notifications</h2>
                        <p className="text-gray-500 mt-2">Your notifications will appear here.</p>
                    </motion.div>
                )}



                {activeNav === 'wishlist' && (
                    <div className='bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden'>
                      <WishlistClient isEmbedded={true} />
                    </div>
                )}
                
                {activeNav === 'real-estate' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 tracking-tight mb-2'>Real Estate</h2>
                    <p className="text-gray-500">Explore real estate options and news here.</p>
                    </motion.div>
                )}
                
            </motion.div>
        </div>

        {/* Modals */}
        <BrokerEditModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
        />
    </div>
  )
}

export default BrokerProfile