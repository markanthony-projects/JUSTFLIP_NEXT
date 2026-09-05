"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { MdReadMore } from "react-icons/md";
import { FiArrowUpRight, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BUDGET_BUCKETS = [
  {
    label: "Under ₹50 Lac",
    subtext: "Budget-friendly starter homes",
    tag: "Starter Homes",
    count: "420+ Listings",
    specs: "1 & 2 BHK Flats",
    image: "/banners/budget-1.webp",
    minPrice: 0,
    maxPrice: 5000000,
  },
  {
    label: "₹50 Lac – ₹1 Cr",
    subtext: "Mid-segment premium flats",
    tag: "Most Popular",
    count: "1,150+ Listings",
    specs: "2 & 3 BHK Gated",
    image: "/banners/budget-2.webp",
    minPrice: 5000000,
    maxPrice: 10000000,
  },
  {
    label: "₹1 Cr – ₹2 Cr",
    subtext: "Premium residences & towers",
    tag: "High Demand",
    count: "890+ Listings",
    specs: "Luxury High-rises",
    image: "/banners/budget-3.webp",
    minPrice: 10000000,
    maxPrice: 20000000,
  },
  {
    label: "₹2 Cr – ₹5 Cr",
    subtext: "Luxury villas & estates",
    tag: "Luxury Living",
    count: "340+ Listings",
    specs: "Villas & Condos",
    image: "/banners/budget-4.webp",
    minPrice: 20000000,
    maxPrice: 50000000,
  },
  {
    label: "Above ₹5 Cr",
    subtext: "Ultra luxury penthouses",
    tag: "Ultra Prime",
    count: "120+ Listings",
    specs: "Penthouses & Mansions",
    image: "/banners/budget-5.webp",
    minPrice: 50000000,
    maxPrice: 500000000,
  },
];

export default function ExploreByBudget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="w-full flex flex-col">
      {/* Section Header */}
      <div className="mb-2 md:mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-primary">
            Explore Properties by Budget
          </h2>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              aria-label="View All Budget Brackets"
              href="/search"
              className="text-primary flex items-center gap-1 py-0.5 px-1 rounded-xs hover:bg-primary/5 hover:underline transition-all duration-300 ease-in-out text-xs md:text-sm font-semibold"
            >
              <span className="hidden sm:block">View All Brackets</span>
              <MdReadMore className="text-xl" />
            </Link>

            {/* Desktop Carousel Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "text-slate-700 hover:bg-primary hover:text-white hover:border-primary cursor-pointer shadow-xs"
                    : "text-slate-300 border-slate-100 cursor-not-allowed opacity-40"
                }`}
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? "text-slate-700 hover:bg-primary hover:text-white hover:border-primary cursor-pointer shadow-xs"
                    : "text-slate-300 border-slate-100 cursor-not-allowed opacity-40"
                }`}
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="hidden md:block text-xs md:text-sm text-gray-600 mt-0.5">
          Handpicked residential projects categorized by your target price range.
        </p>
      </div>

      {/* Horizontally Scrollable Cards Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-3.5 sm:gap-4 pb-2 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {BUDGET_BUCKETS.map((bucket, index) => (
          <Link
            key={index}
            href={`/search?minPrice=${bucket.minPrice}&maxPrice=${bucket.maxPrice}`}
            className="group relative flex flex-col justify-between w-[260px] sm:w-[285px] md:w-[305px] h-64 sm:h-72 shrink-0 snap-start rounded-lg overflow-hidden border border-slate-200/90 bg-slate-900 shadow-xs hover:shadow-lg transition-all duration-200 p-4 text-white"
          >
            {/* Background Image */}
            <img
              src={bucket.image}
              alt={`${bucket.label} - ${bucket.subtext}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            {/* Dark Dramatic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-black/20" />

            {/* Top Floating Badges */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-slate-800 px-2.5 py-1 rounded-full shadow-xs border border-white/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {bucket.tag}
              </span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur text-slate-700 flex items-center justify-center shadow-xs transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                <FiArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            {/* Bottom Overlay Content */}
            <div className="relative z-10 flex flex-col gap-1.5 mt-auto">
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-200">
                <svg className="w-3.5 h-3.5 fill-current shrink-0 text-slate-300" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>{bucket.count}</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {bucket.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 font-normal leading-tight mt-0.5 line-clamp-1">
                  {bucket.subtext}
                </p>
              </div>

              <div className="mt-1 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] sm:text-xs font-medium text-slate-300">
                <span className="truncate">{bucket.specs}</span>
                <span className="text-white font-medium inline-flex items-center gap-0.5 group-hover:text-sky-300 transition-colors shrink-0">
                  Explore
                  <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
