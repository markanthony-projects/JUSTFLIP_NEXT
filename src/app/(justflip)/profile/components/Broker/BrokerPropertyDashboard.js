'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineDocumentText } from "react-icons/hi"
import { HiBuildingOffice2 } from "react-icons/hi2"
import { FiCheckCircle, FiClock, FiXCircle, FiGlobe, FiPlus } from "react-icons/fi"
import { useAuthStore } from '@/src/stores/auth.store'
import { JUSTFLIP } from '@/src/lib/axios/api'
import ProjectCard from '@/src/components/Cards/ProjectCard'
import Link from 'next/link'

const BrokerPropertyDashboard = () => {
  const { user, authType } = useAuthStore()
  const [activeTab, setActiveTab] = useState('All Properties')
  const [isHovered, setIsHovered] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = {};
        let url = "/project";

        if (authType === 'broker' && user?.id) {
           params.uploader = 'broker';
           url = "/project/listings";
        } else if (user?.id) {
           params.ownerId = user.id;
        }
        
        if (Object.keys(params).length > 0) {
          const { data } = await JUSTFLIP.get(url, { params });
          setProperties(data?.projects || []);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [user, authType]);

  const stats = [
    { label: "Total Uploads", value: properties.length, icon: <HiBuildingOffice2 className="text-[#002B5B]" size={24} /> },
    { label: "Approved Properties", value: properties.filter(p => p.approval === 'approved').length, icon: <FiCheckCircle className="text-[#002B5B]" size={24} /> },
    { label: "Pending Properties", value: properties.filter(p => p.approval === 'pending').length, icon: <FiClock className="text-[#002B5B]" size={24} /> },
    { label: "Rejected Properties", value: properties.filter(p => p.approval === 'rejected').length, icon: <FiXCircle className="text-[#002B5B]" size={24} /> },
    { label: "Live Properties", value: properties.filter(p => p.status === 'active').length, icon: <FiGlobe className="text-[#002B5B]" size={24} /> },
  ]

  const filteredProperties = useMemo(() => {
    let filtered = properties;
    if (activeTab === 'Approved Properties') filtered = properties.filter(p => p.approval === 'approved');
    if (activeTab === 'Pending Properties') filtered = properties.filter(p => p.approval === 'pending');
    if (activeTab === 'Rejected Properties') filtered = properties.filter(p => p.approval === 'rejected');
    if (activeTab === 'Active Properties') filtered = properties.filter(p => p.status === 'active');
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [properties, activeTab, searchQuery]);

  const tabs = [
    { id: "All Properties", icon: <HiBuildingOffice2 /> },
    { id: "Approved Properties", icon: <FiCheckCircle /> },
    { id: "Pending Properties", icon: <FiClock /> },
    { id: "Rejected Properties", icon: <FiXCircle /> },
    { id: "Active Properties", icon: <FiGlobe /> },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
      className='bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white min-h-[600px] relative overflow-hidden'
    >
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-50 -z-10 translate-x-20 -translate-y-20 pointer-events-none"></div>
      
      {/* Top Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            whileHover={{ y: -4, scale: 1.02 }}
            onHoverStart={() => setIsHovered(index)}
            onHoverEnd={() => setIsHovered(null)}
            className={`relative flex flex-col p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 ${isHovered === index ? 'shadow-md ring-1 ring-gray-200' : ''}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-50 border border-slate-100`}>
              {stat.icon}
            </div>
            <h3 className={`text-3xl font-extrabold text-slate-800 mb-1 tracking-tight`}>{stat.value}</h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pill Navigation & Search Layout */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        
        {/* Animated Pill Navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group border ${isActive ? 'border-transparent' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#002B5B] rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-[#002B5B]'}`}>
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#002B5B]'} transition-colors`}>
                    {tab.icon}
                  </span>
                  {tab.id}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative flex items-center w-full lg:w-72 h-12 rounded-xl focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100 bg-white border border-gray-200 overflow-hidden transition-all duration-300 shrink-0"
        >
          <div className="grid place-items-center h-full w-12 text-gray-400 bg-gray-50">
            <HiOutlineSearch size={18} />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent px-3 font-medium placeholder-gray-400"
            type="text"
            id="search"
            placeholder="Search properties..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center mt-20 p-10 text-center"
          >
            <div className="w-10 h-10 border-4 border-blue-200 border-t-[#002B5B] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching your properties...</p>
          </motion.div>
        ) : filteredProperties.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProperties.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center mt-20 p-10 text-center"
          >
              <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse opacity-60"></div>
                  <div className="absolute inset-4 bg-[#E6EEF2] rounded-full"></div>
                  <HiOutlineDocumentText className="relative z-10 text-[#002B5B] opacity-80" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} Found</h3>
              <p className="text-gray-500 font-medium text-sm max-w-sm mb-8 leading-relaxed">
                  You currently don't have any properties that match this search or filter status.
              </p>
              
              <Link href="/post-property">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#002B5B] to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all"
                >
                    <FiPlus size={18} /> Post a New Property
                </motion.button>
              </Link>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default BrokerPropertyDashboard
