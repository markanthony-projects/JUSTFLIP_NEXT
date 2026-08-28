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
    <div className='w-full'>
      <div className="md:mb-4 mb-3 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#002B5B] tracking-tight">
            Our Journey
        </h2>
      </div>

      <div className='flex flex-col md:flex-row gap-10 md:gap-4 items-center justify-between min-h-[500px]'>
        
        {/* LEFT TIMELINE & DESCRIPTION */}
        <div className='relative w-full md:w-[45%] flex items-center justify-between h-[450px]'>
            {/* TIMELINE */}
            <div className="relative flex flex-col items-center gap-4 z-10 w-1/4">
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-blue-200 to-transparent -translate-x-1/2" />
                
                <motion.button
                    onClick={prevYear}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg text-[#002B5B] hover:text-blue-600 transition-all z-10"
                >
                    <FaChevronUp />
                </motion.button>
                
                <div className="flex flex-col gap-6 py-4 z-10">
                    {[activeIndex - 1, activeIndex, activeIndex + 1].map((index, i) => {
                        const wrappedIndex = (index + timelineData.length) % timelineData.length;
                        const isActive = i === 1;

                        return (
                            <motion.div
                                key={timelineData[wrappedIndex]?.year + '-' + i}
                                onClick={() => setActiveIndex(wrappedIndex)}
                                className="relative flex flex-col items-center cursor-pointer group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    scale: isActive ? 1.1 : 0.9,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        isActive ? "bg-[#002B5B] shadow-[0_0_15px_rgba(0,43,91,0.5)]" : "bg-gray-300 group-hover:bg-blue-400"
                                    }`}
                                />
                                <span
                                    className={`mt-2 transition-all duration-300 ${
                                        isActive
                                            ? "text-[#002B5B] text-2xl font-bold"
                                            : "text-gray-400 text-lg font-medium group-hover:text-blue-500"
                                    }`}
                                >
                                    {timelineData[wrappedIndex]?.year}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>
                
                <motion.button
                    onClick={nextYear}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg text-[#002B5B] hover:text-blue-600 transition-all z-10"
                >
                    <FaChevronDown />
                </motion.button>
            </div>

            {/* DESCRIPTION CARD */}
            <div className="w-3/4 relative z-20 pr-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={timelineData[activeIndex]?.year}
                        className="rounded-3xl bg-white border border-gray-100 shadow-lg p-6 md:p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4 }}
                        onAnimationComplete={() => setAnimating(false)}
                    >
                        <h3 className="text-xl font-bold text-[#002B5B] mb-3">{timelineData[activeIndex]?.title || "Milestone"}</h3>
                        <p className="text-[15px] text-gray-700 leading-relaxed text-justify max-h-60 overflow-y-auto scrollbar-modern pr-2">
                            {timelineData[activeIndex]?.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* RIGHT SIDE (IMAGES) */}
        <div className='relative w-full md:w-[55%] flex items-stretch justify-end gap-2 h-[400px] md:h-[500px]'>
            {/* MAIN LARGE IMAGE */}
            <div className="w-2/3 h-full relative overflow-hidden rounded-3xl shadow-xl">
                <AnimatePresence mode="wait">
                {timelineData[activeIndex] && (
                    <motion.img
                        key={timelineData[activeIndex]?.images?.[0]?.url}
                        src={timelineData[activeIndex]?.images?.[0]?.url}
                        alt={timelineData[activeIndex]?.year}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                )}
                </AnimatePresence>

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f42]/80 via-transparent to-transparent" />

                 {/* YEAR FLOATING */}
                <motion.div
                    key={'year-' + timelineData[activeIndex]?.year}
                    className="absolute bottom-6 left-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg opacity-90">
                        {timelineData[activeIndex]?.year}
                    </p>
                </motion.div>
            </div>

            {/* SIDE STACK */}
            <div className="flex flex-col gap-2 w-1/3 h-full">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="relative flex-1 overflow-hidden rounded-2xl shadow-md group"
                    >
                        <AnimatePresence mode="wait">
                        {timelineData[activeIndex]?.images?.[i]?.url ? (
                            <motion.img
                                key={timelineData[activeIndex]?.images?.[i]?.url}
                                src={timelineData[activeIndex]?.images?.[i]?.url}
                                alt=""
                                className="w-full h-full object-cover absolute inset-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 absolute inset-0"></div>
                        )}
                        </AnimatePresence>

                        {/* HOVER EFFECT */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  )
}

export default DeveloperHistory
