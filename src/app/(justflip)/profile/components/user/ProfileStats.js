'use client'
// this component is Responsible for showing 4 summary stat cards (Favourites, Searches, Visited, Alerts).
// Data source:"Saved" count → list.length from useFavouritesStore (persisted, no API call needed)


// the icons import 
import { FaHeart } from 'react-icons/fa6'
import { FaSearch } from 'react-icons/fa'
import { GiFamilyHouse } from 'react-icons/gi'
import { HiBellAlert } from 'react-icons/hi2'
import { motion } from 'framer-motion'

// the use favourite store import.
import { useFavouritesStore } from '@/src/stores/favourites.store'

//an array of objects to map on the different stats available to display to the user
const stats = [
  { icon: <FaHeart />,        label: 'Favourite Properties', key: 'saved',    color: '#d12121' },
  { icon: <FaSearch />,       label: 'Saved Searches',       key: 'searches', color: '#041a33' },
  { icon: <GiFamilyHouse />,  label: 'Visited Properties',   key: 'visited',  color: '#041a33' },
  { icon: <HiBellAlert />,    label: 'Active Alerts',        key: 'alerts',   color: '#7f7a1a' },
]

const ProfileStats = () => {
  const savedProperties = useFavouritesStore(state => state.list.length)

  const counts = {
    saved:    savedProperties,
    searches: 0, // wire up when saved searches store/API is available
    visited:  0, // wire up when recently viewed store/API is available
    alerts:   0, // wire up when alerts store/API is available
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {stats.map(({ icon, label, key, color }, index) => (
        <motion.div
          key={key}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className='flex flex-col items-start gap-3 bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 relative overflow-hidden group'
        >
          {/* Subtle background glow on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"
            style={{ backgroundColor: color }}
          />

          {/* Icon box */}
          <div
            className='text-2xl p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110'
            style={{ backgroundColor: `${color}10`, color: color }}
          >
            {icon}
          </div>

          <div className='flex flex-col mt-2'>
            <span className='text-3xl font-extrabold text-gray-900 tracking-tight'>
              {counts[key]}
            </span>
            <span className='text-xs md:text-sm font-medium text-gray-500 mt-1'>
              {label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ProfileStats