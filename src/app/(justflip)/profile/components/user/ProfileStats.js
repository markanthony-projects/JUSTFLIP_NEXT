'use client'

// This component is responsible for showing summary stat cards.

import { FaHeart } from 'react-icons/fa6'
import { FaSearch } from 'react-icons/fa'
import { GiFamilyHouse } from 'react-icons/gi'
import { HiBellAlert } from 'react-icons/hi2'
import { HiArrowRight } from 'react-icons/hi'

import { motion } from 'framer-motion'

import { useFavouritesStore } from '@/src/stores/favourites.store'

const stats = [
  {
    icon: <FaHeart />,
    label: 'Saved Properties',
    key: 'saved',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    accent: 'bg-red-500',
  },
  {
    icon: <FaSearch />,
    label: 'Saved Searches',
    key: 'searches',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accent: 'bg-blue-600',
  },
  {
    icon: <GiFamilyHouse />,
    label: 'Visited Properties',
    key: 'visited',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'bg-emerald-600',
  },
  {
    icon: <HiBellAlert />,
    label: 'Property Alerts',
    key: 'alerts',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    accent: 'bg-amber-600',
  },
]

const ProfileStats = () => {
  const savedProperties = useFavouritesStore(state => state.list.length)

  const counts = {
    saved: savedProperties,
    searches: 0,
    visited: 0,
    alerts: 0,
  }

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {stats.map(({ icon, label, key, iconBg, iconColor, accent }) => (
        <motion.div
          key={key}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
        >
          {/* Top Accent */}
          <div className={`absolute left-0 top-0 h-1 w-full ${accent}`} />

          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10 flex h-full flex-col">
            {/* Icon */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 ${iconBg} ${iconColor}`}
            >
              {icon}
            </div>

            {/* Count */}
            <div className="mt-6">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                {counts[key]}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ProfileStats