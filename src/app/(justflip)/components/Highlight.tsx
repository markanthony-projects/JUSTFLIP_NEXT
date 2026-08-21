"use client";
import React, { memo, useState } from "react";

const BulletItem = memo(function BulletItem({ title, description, tone }: { title: any; description: any; tone: string }) {
  return (
    <div className="flex gap-3 p-2 sm:p-2.5 rounded-lg">
      {/* Bullet Dot Badge */}
      <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-sm mt-0.5">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            tone === "positive" ? "bg-[#0B8019]" : "bg-[#E65100]"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] sm:text-[15px] font-bold text-gray-900 leading-snug">
          {title}
        </p>
        <p className="text-[12px] sm:text-[13px] text-gray-600 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
});

const SectionHeader = ({ title, icon, tone, isOpen, onToggle }: { title: any; icon: any; tone: 'positive' | 'negative'; isOpen: boolean; onToggle: () => void }) => {
  const toneStyles = {
    positive: "text-[#0B8019]",
    negative: "text-[#C7641C]",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-2.5 sm:mb-3 focus:outline-none group md:cursor-default"
    >
      <div className={`flex items-center gap-2 sm:gap-2.5 font-bold text-[15px] sm:text-[16px] ${toneStyles[tone]}`}>
        {icon}
        <span>{title}</span>
      </div>

      {/* Accordion Chevron Icon (Visible on mobile only) */}
      <svg
        className={`w-5 h-5 text-gray-500 transition-transform duration-200 md:hidden ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

const ThumbUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B8019" className="sm:w-[22px] sm:h-[22px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#C7641C" className="sm:w-[22px] sm:h-[22px]" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
  </svg>
);

const HighlightLocation = ({ data = {}, name = "" }: { data?: any; name?: string }) => {
  const { advantages = [], disadvantages = [], name: locationName = "Unknown Location" } = data;

  const [isAdvOpen, setIsAdvOpen] = useState(true);
  const [isDisOpen, setIsDisOpen] = useState(false);

  return (
    <section className="w-full">
      {/* City Title */}
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 tracking-tight">
        {name ? `${name} - ` : ""}{locationName} as a City
      </h2>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Left Column (Positive) */}
        <div className="flex flex-col">
          {/* Header outside the box with accordion toggle */}
          <SectionHeader
            title="What Stands Out"
            icon={<ThumbUpIcon />}
            tone="positive"
            isOpen={isAdvOpen}
            onToggle={() => setIsAdvOpen((prev) => !prev)}
          />

          {/* Green Box Container */}
          <div
            className={`bg-[#f2f8f3] p-2 sm:p-2.5 rounded-xl flex-1 space-y-1 transition-all duration-300 ${
              isAdvOpen ? "block" : "hidden md:block"
            }`}
          >
            {advantages.length > 0 ? (
              advantages.map((item: any, index: number) => (
                <BulletItem
                  key={`adv-${index}`}
                  title={item?.title}
                  description={item?.description}
                  tone="positive"
                />
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-400 p-2">No highlights available</p>
            )}
          </div>
        </div>

        {/* Right Column (Negative) */}
        <div className="flex flex-col">
          {/* Header outside the box with accordion toggle */}
          <SectionHeader
            title="What Goes Unnoticed"
            icon={<ThumbDownIcon />}
            tone="negative"
            isOpen={isDisOpen}
            onToggle={() => setIsDisOpen((prev) => !prev)}
          />

          {/* Yellow Box Container */}
          <div
            className={`bg-[#fff9ef] p-2 sm:p-2.5 rounded-xl flex-1 space-y-1 transition-all duration-300 ${
              isDisOpen ? "block" : "hidden md:block"
            }`}
          >
            {disadvantages.length > 0 ? (
              disadvantages.map((item: any, index: number) => (
                <BulletItem
                  key={`dis-${index}`}
                  title={item?.title}
                  description={item?.description}
                  tone="negative"
                />
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-400 p-2">No issues reported</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default memo(HighlightLocation);