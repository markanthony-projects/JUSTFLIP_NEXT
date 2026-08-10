'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

export interface DeveloperHistoryProps {
    history?: any[];
}

const DeveloperHistory = ({ history = [] }: DeveloperHistoryProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [animating, setAnimating] = useState<boolean>(false)
  const timelineData = history

  const nextYear = () => {
    if (!animating && timelineData.length) {
      setAnimating(true)
      setActiveIndex(prev => (prev + 1) % timelineData.length)
    }
  }

  const prevYear = () => {
    if (!animating && timelineData.length) {
      setAnimating(true)
      setActiveIndex(prev => (prev === 0 ? timelineData.length - 1 : prev - 1))
    }
  }

  if (!timelineData.length) return null

  return (
    <div className='mb-70 md:mb-0'>
      <p className='text-xl pt-3 font-bold'>History</p>
      <div className='border mb-3' />

      <div className='flex flex-col md:flex-row gap-y-5 items-center justify-between h-[400px]'>
        
        {/* LEFT TIMELINE */}
        <div className='relative w-full md:w-2/5 flex items-center gap-4 md:h-full'>
        {/* VERTICAL LINE */}
        <div className="absolute left-1/3 top-0 h-full w-0.5 bg-linear-to-b from-transparent via-gray-300 to-transparent" />

            {/* timeline content */}
            <div className="relative flex flex-col items-center gap-3 lg:gap-6 z-10">
                 {/* TOP BUTTON */}
                <motion.button
                    onClick={prevYear}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 lg:3 rounded-full bg-white border-2 border-gray-400 backdrop-blur-md shadow-md hover:shadow-lg transition"
                    >
                    <FaChevronUp />
                </motion.button>
                 {/* YEARS */}
                {[activeIndex - 1, activeIndex, activeIndex + 1].map((index, i) => {
                const wrappedIndex =
                    (index + timelineData.length) % timelineData.length;

                const isActive = i === 1;

                return(
                    <motion.div
                        key={timelineData[wrappedIndex]?.year}
                        onClick={() => setActiveIndex(wrappedIndex)}
                        className="relative flex flex-col items-center cursor-pointer"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{
                            opacity: isActive ? 1 : 0.4,
                            scale: isActive ? 1.2 : 0.9,
                            y: (i - 1) * 10,
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    >
                    
                        {/* DOT */}
                        <div
                            className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-blue-600 scale-105" : "bg-gray-400"
                            } transition`}
                        />

                         {/* YEAR */}
                        <span
                            className={`mt-1 lg:mt-2 ${
                            isActive
                                ? "text-blue-900 text-xl lg:text-2xl font-semibold"
                                : "text-gray-500 text-sm"
                            }`}
                        >
                            {timelineData[wrappedIndex]?.year}
                        </span>
                    </motion.div>
                )})}
                 {/* BOTTOM BUTTON */}
                <motion.button
                    onClick={nextYear}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 lg:3 rounded-full bg-white border-2 border-gray-400 backdrop-blur-md shadow-md hover:shadow-lg transition"
                    >
                    <FaChevronDown />
                </motion.button>
            </div>

            {/* DESCRIPTION CARD */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={timelineData[activeIndex]?.year}
                    className="md:absolute z-30 left-[40%] md:w-[320px] rounded-xl bg-white/30 backdrop-blur-md border-white/20 max-h-52 overflow-y-auto text-justify w-full lg:w-125 md:min-h-30 text-[10px] md:text-xs border p-2 md:p-4 shadow-lg md:left-1/2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x  : -30 }}
                    transition={{ duration: 0.4 }}
                    onAnimationComplete={() => setAnimating(false)}
                >
                    <p className="text-sm text-gray-900 leading-relaxed">
                        {timelineData[activeIndex]?.description}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>

{/* ----------------------------------------------------------------------------------------------------------------------- */}

        {/* RIGHT SIDE (IMAGES) */}
        <div className='relative w-full md:w-3/5 flex items-center justify-center gap-1'>
            {/* MAIN LARGE IMAGE */}
            <div className="w-2/3 h-96 relative overflow-hidden rounded-l-lg shadow-sm shadow-gray-500">
                <AnimatePresence mode="wait">
                {timelineData[activeIndex] && (
                    <motion.img
                    key={timelineData[activeIndex]?.images?.[0]?.url}
                    src={timelineData[activeIndex]?.images?.[0]?.url}
                    alt={timelineData[activeIndex]?.year}
                    className="h-96 w-full object-cover absolute"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                        opacity: 0,
                        x: -30,
                        transition: { delay: 0.6, duration: 1 },
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                )}
                </AnimatePresence>

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                 {/* YEAR FLOATING */}
                <motion.div
                    key={timelineData[activeIndex]?.year}
                    className="absolute bottom-4 left-4 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-3xl md:text-5xl font-bold tracking-wide">
                        {timelineData[activeIndex]?.year}
                    </p>
                </motion.div>
            </div>

            {/* SIDE STACK */}
            <div className="flex flex-col gap-1 w-1/3 h-96">
                
                {[1, 2].map((i) => (
                <div
                    key={i}
                    className={`relative flex-1 overflow-hidden ${ i == 1 ? "rounded-tr-lg" : "rounded-br-lg" }  shadow-sm group`}
                >
                    <AnimatePresence mode="wait">
                    <motion.img
                        key={timelineData[activeIndex]?.images?.[i]?.url}
                        src={timelineData[activeIndex]?.images?.[i]?.url}
                        alt=""
                        className="w-full h-48 object-cover absolute"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                    </AnimatePresence>

                    {/* HOVER EFFECT */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}

export default DeveloperHistory
