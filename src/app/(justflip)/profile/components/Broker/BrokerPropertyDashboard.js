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
    { label: "Total Uploads", shortLabel: "Total Uploads", value: properties.length, icon: <HiBuildingOffice2 size={24} /> },
    { label: "Approved Properties", shortLabel: "Approved", value: properties.filter(p => p.approval === 'approved').length, icon: <FiCheckCircle size={24} /> },
    { label: "Pending Properties", shortLabel: "Pending", value: properties.filter(p => p.approval === 'pending').length, icon: <FiClock size={24} /> },
    { label: "Rejected Properties", shortLabel: "Rejected", value: properties.filter(p => p.approval === 'rejected').length, icon: <FiXCircle size={24} /> },
    { label: "Live Properties", shortLabel: "Live", value: properties.filter(p => p.status === 'active').length, icon: <FiGlobe size={24} />, isLive: true },
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
    { id: "All Properties", label: "All", icon: <HiBuildingOffice2 /> },
    { id: "Approved Properties", label: "Approved", icon: <FiCheckCircle /> },
    { id: "Pending Properties", label: "Pending", icon: <FiClock /> },
    { id: "Rejected Properties", label: "Rejected", icon: <FiXCircle /> },
    { id: "Active Properties", label: "Active", icon: <FiGlobe /> },
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
      className='bg-gray-50/30 md:bg-white/80 md:backdrop-blur-2xl rounded-3xl md:p-8 p-4 md:shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:border md:border-white min-h-[600px] relative overflow-hidden'
    >
      {/* Decorative background blob */}
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-50 -z-10 translate-x-20 -translate-y-20 pointer-events-none"></div>

      {/* Top Stats Grid */}
      <motion.div variants={itemVariants} className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-10">
        {stats.map((stat, index) => {
          const isActiveCard = activeTab === tabs[index].id;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.02 }}
              onHoverStart={() => setIsHovered(index)}
              onHoverEnd={() => setIsHovered(null)}
              onClick={() => setActiveTab(tabs[index].id)}
              className={`cursor-pointer relative flex flex-row items-center md:flex-col md:items-start p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 ${isHovered === index && !isActiveCard ? 'shadow-md md:ring-1 md:ring-gray-200' : 'shadow-sm'} ${isActiveCard ? 'bg-[#002B5B] text-white border-transparent shadow-md' : 'bg-white border-gray-100 text-slate-800 hover:bg-slate-50'}`}
            >
              <div className={`w-12 h-12 rounded-lg md:rounded-xl flex items-center justify-center mr-4 md:mr-0 md:mb-4 shrink-0 ${isActiveCard ? 'bg-white/10 border border-white/10 text-white' : 'bg-slate-50 border border-slate-100 text-[#002B5B]'}`}>
                {stat.icon}
              </div>
              <div className="flex flex-col md:block">
                <div className="flex flex-col md:flex-col-reverse">
                  <p className={`text-[11px] font-bold ${isActiveCard ? 'text-blue-100' : 'text-slate-400 md:text-slate-500'} uppercase tracking-wide md:tracking-wider md:mt-1`}>
                    <span className="md:hidden">{stat.shortLabel}</span>
                    <span className="hidden md:inline">{stat.label}</span>
                  </p>
                  <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight md:tracking-tight ${isActiveCard ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
                </div>
              </div>
              {isActiveCard && (
                <div className="ml-auto text-white pr-2 md:hidden">
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5L7 7L1.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              {stat.isLive && (
                <div className="ml-auto bg-green-100 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-green-200 md:hidden">
                  ACTIVE
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Pill Navigation & Search Layout */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8">

        {/* Animated Pill Navigation */}
        <div className="order-2 md:order-1 flex flex-row md:flex-wrap overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 w-full md:w-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 flex items-center gap-2 px-6 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group border ${isActive ? 'md:border-transparent bg-[#002B5B] md:bg-transparent text-white' : 'border-gray-200 md:border-transparent md:border-slate-200 bg-white md:hover:bg-slate-50 text-slate-700'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="hidden md:block absolute inset-0 bg-[#002B5B] rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-slate-600 md:group-hover:text-[#002B5B]'}`}>
                  <span className={`hidden md:flex ${isActive ? 'text-white' : 'text-slate-400 md:group-hover:text-[#002B5B]'} transition-colors`}>
                    {tab.icon}
                  </span>
                  <span className="md:hidden whitespace-nowrap">{tab.label}</span>
                  <span className="hidden md:inline">{tab.id}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="order-1 md:order-2 relative flex items-center w-full md:w-72 h-12 rounded-xl focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100 bg-white border border-gray-200 overflow-hidden transition-all duration-300 shrink-0"
        >
          <div className="grid place-items-center h-full w-12 text-gray-400 bg-transparent md:bg-gray-50">
            <HiOutlineSearch size={18} />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 bg-transparent px-1 md:px-3 font-medium placeholder-gray-400"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center md:justify-items-start"
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
