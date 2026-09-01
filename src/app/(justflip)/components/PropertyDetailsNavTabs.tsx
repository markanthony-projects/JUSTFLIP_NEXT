"use client";

import { useState, useEffect, useRef } from "react";

export type navItems = {
    id: string;
    label: string;
};

type navTabProps = {
    navItems: navItems[];
    scrollThreshold?: number;
    showArrows?:boolean;
}

export default function PropertyDetailNavTabs({navItems, scrollThreshold = 500, showArrows = true}: navTabProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0]?.id || "");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll()

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [navItems]);

  const handleTabScroll = () => {
    const container = navContainerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // Show/hide left arrow based on scroll position
      setShowLeftArrow(scrollLeft > 10);
      // Show/hide right arrow based on whether we reached the end
      setShowRightArrow(scrollLeft < maxScrollLeft - 10);
    }
  };

  const scrollByAmount = (amount: number) => {
    const container = navContainerRef.current;
    if (container) {
      container.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`fixed left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300 ease-in-out ${
        isVisible
          ? "top-[60px] translate-y-0 opacity-100 pointer-events-auto"
          : "top-[60px] -translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {/* Left Arrow Indicator */}
        {showArrows && showLeftArrow && (
          <button
            onClick={() => scrollByAmount(-200)}
            className="absolute left-2 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pr-4 pl-1 py-3 flex items-center text-gray-600 hover:text-gray-900 transition-opacity cursor-pointer"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Nav Container (Vertically Centered with flex items-center) */}
        <div
          ref={navContainerRef}
          onScroll={handleTabScroll}
          className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar py-2 w-full px-4 scroll-smooth"
          aria-label="Property Sections"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap py-1 text-sm font-semibold transition-all border-b-2 ${
                  isActive
                    ? "border-[#002B5B] text-[#002B5B]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Indicator */}
        {showArrows && showRightArrow && (
          <button
            onClick={() => scrollByAmount(200)}
            className="absolute right-2 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pl-4 pr-1 py-3 flex items-center text-gray-600 hover:text-gray-900 transition-opacity cursor-pointer"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}