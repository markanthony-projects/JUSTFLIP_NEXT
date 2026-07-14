"use client";

import Image from "@/src/components/atoms/Image";
import React, { useState, useCallback } from "react";


const CinematicCard = ({ emp, index, activeIndex, setActiveIndex }) => {
  const isActive = activeIndex === index;
  const isDimmed = activeIndex !== null && !isActive;

  return (
    <div
      role="listitem"
      tabIndex={0}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      onFocus={() => setActiveIndex(index)}
      onBlur={() => setActiveIndex(null)}
      className={`
        relative overflow-hidden  cursor-pointer
        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        flex-[0_0_70%] md:flex-[0_0_40%] lg:flex-1
        h-[260px] md:h-[380px]
        
        ${isActive ? "lg:flex-[1.8]" : ""}
        ${isDimmed ? "opacity-40 scale-[0.95]" : "opacity-100"}
      `}
    >
  
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={emp?.image}
          alt={emp?.name}
          className={`
            w-full h-full object-cover
            transition-transform duration-[1200ms] ease-out
            ${isActive ? "scale-105" : "scale-110"}
          `}
        />
      </div>

      {/* Glass Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent backdrop-blur-[1px]" />

      {/* Subtle Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <p className="text-lg md:text-xl font-light tracking-wide">
          {emp?.name}
        </p>
        <p className="text-sm md:text-base opacity-80">
          {emp?.designation}
        </p>
      </div>
    </div>
  );
};


const DeveloperGallery = ({ builder = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleActive = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  return (
    <section className="w-full ">
     

      <div
        role="list"
        className="
          flex 
          overflow-x-auto lg:overflow-hidden scrollbar-hidden
          scroll-smooth
        "
      >
        {builder.map((emp, index) => (
          <CinematicCard
            key={emp?.id || index}
            emp={emp}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={handleActive}
          />
        ))}
      </div>
    </section>
  );
};

export default DeveloperGallery;