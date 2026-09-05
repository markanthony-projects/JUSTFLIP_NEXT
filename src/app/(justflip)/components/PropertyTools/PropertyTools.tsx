import React from "react";
import Link from "next/link";
import { 
  TbCalculator, 
  TbShieldCheck, 
  TbHomeDollar, 
  TbScale, 
  TbFileCertificate, 
  TbDimensions 
} from "react-icons/tb";
import { FiArrowUpRight } from "react-icons/fi";

export interface ToolItem {
  id: string;
  title: string;
  subtext: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_TOOLS: ToolItem[] = [
  {

    id: "mortgage-calculator",
    title: "Mortgage / EMI",
    subtext: "Calculate monthly EMI & interest",
    href: "/mortgage-calculator",
    icon: TbCalculator,
  },
  {
    id: "loan-eligibility",
    title: "Loan Eligibility",
    subtext: "Check your maximum borrowing limit",
    href: "/loan-eligibility",
    icon: TbShieldCheck,
  },
  {
    id: "affordability-calculator",
    title: "Affordability",
    subtext: "Find out your property budget",
    href: "/affordability-calculator",
    icon: TbHomeDollar,
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy",
    subtext: "Compare long-term wealth creation",
    href: "/rent-vs-buy",
    icon: TbScale,
  },
  {
    id: "stamp-duty",
    title: "Stamp Duty",
    subtext: "Calculate state taxes & registration",
    href: "/stamp-duty",
    icon: TbFileCertificate,
  },
  {
    id: "area-converter",
    title: "Area Converter",
    subtext: "Convert Sq.Ft, Acres, Cents, Guntas",
    href: "/area-converter",
    icon: TbDimensions,
  },
];

interface PropertyToolsProps {
  title?: string;
  excludeId?: string;
}

export default function PropertyTools({ 
  title = "More Financial & Planning Tools", 
  excludeId 
}: PropertyToolsProps) {
  const tools = excludeId 
    ? ALL_TOOLS.filter(t => t.id !== excludeId) 
    : ALL_TOOLS;

  const gridColsClass = tools.length === 5 
    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4";

  return (
    <section className="w-full flex flex-col">
      {/* Section Header */}
      <div className="md:mb-2 mb-0 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-primary">
          {title}
        </h2>
      </div>

      {/* Clean Brand Cards Grid */}
      <div className={gridColsClass}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 hover:border-[#002B5B] hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#002B5B]/5 text-[#002B5B] flex items-center justify-center group-hover:bg-[#002B5B] group-hover:text-white transition-colors duration-200 shrink-0">
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <FiArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#002B5B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>

              <div className="mt-3">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#002B5B] transition-colors leading-tight truncate">
                  {tool.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                  {tool.subtext}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
