"use client";

import React from "react";
import Link from "next/link";

export interface ToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  image: string;
}

const ALL_TOOLS: ToolItem[] = [
  {
    id: "mortgage-calculator",
    title: "Mortgage / EMI",
    desc: 'Calculate tenure',
    href: "/mortgage-calculator",
    image: "/assets/images/tools/icon_mortgage.jpg",
  },
  {
    id: "loan-eligibility",
    title: "Loan Eligibility",
    desc: 'CIBIL & Limits',
    href: "/loan-eligibility",
    image: "/assets/images/tools/icon_property_mgmt.jpg",
  },
  {
    id: "affordability-calculator",
    title: "Affordability",
    desc: 'Market rates',
    href: "/affordability-calculator",
    image: "/assets/images/tools/icon_valuation.jpg",
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy",
    desc: 'Wealth estimator',
    href: "/rent-vs-buy",
    image: "/assets/images/tools/icon_sell_rent.jpg",
  },
  {
    id: "stamp-duty",
    title: "Stamp Duty",
    desc: 'State legal slabs',
    href: "/stamp-duty",
    image: "/assets/images/tools/icon_stamp_duty.jpg",
  },
  {
    id: "area-converter",
    title: "Area Converter",
    desc: '12+ Land units',
    href: "/area-converter",
    image: "/assets/images/tools/icon_compass.jpg",
  },
];

interface PropertyToolsProps {
  title?: string;
}

export default function PropertyTools({
  title = "Financial & Planning Tools",
}: PropertyToolsProps) {
  const tools = ALL_TOOLS;

  return (
    <section className="w-full flex flex-col">
      {/* Section Header */}
      {title && (
        <div className="mb-2 md:mb-3">
          <h2 className="section-heading">
            {title}
          </h2>
        </div>
      )}

      {/* Clean 3D Tools Bar */}
      <div className="w-full bg-white rounded-lg border border-slate-200/80 shadow-[0_2px_14px_-2px_rgba(0,43,91,0.06)] p-3 sm:p-5 md:py-8 md:px-6">
        <div className="grid grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-2 sm:gap-x-4 md:flex md:items-center md:justify-between md:gap-0">
          {tools.map((tool, index) => (
            <React.Fragment key={tool.id}>
              <Link
                href={tool.href}
                className="group w-full min-w-0 md:flex-1 flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg transition-all duration-200 hover:bg-slate-50/80 cursor-pointer"
              >
                {/* 3D Isometric Icon */}
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-26 lg:h-26 flex items-center justify-center">
                  <img
                    src={tool.image}
                    alt={tool.title}
                    loading="lazy"
                    className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2"
                  />
                </div>

                {/* Clean Label */}
                <span className="text-xs sm:text-sm md:text-xl font-bold text-slate-800 group-hover:text-primary transition-colors text-center mt-2 sm:mt-3 md:mt-6 leading-snug line-clamp-2">
                  {tool.title}
                </span>
                {tool.desc && (
                  <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 mt-0.5 sm:mt-1 font-medium group-hover:text-primary transition-colors text-center line-clamp-1">
                    {tool.desc}
                  </span>
                )}
              </Link>

              {/* Vertical Divider Between Items */}
              {index < tools.length - 1 && (
                <div className="hidden md:block w-px h-16 md:h-20 bg-slate-200/80 shrink-0 self-center mx-1.5" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
