import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";
import { BsBuildingCheck } from "react-icons/bs";

export default function PostPropertyCTA() {
  const benefits = [
    {
      icon: <FiZap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      title: "100% Free Listing",
      description: "Zero hidden charges",
    },
    {
      icon: <FiTrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      title: "50,000+ Active Buyers",
      description: "Maximum visibility",
    },
    {
      icon: <FiShield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      title: "Verified Inquiries",
      description: "Genuine buyers only",
    },
    {
      icon: <BsBuildingCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      title: "Fast 3-Min Process",
      description: "Quick guided steps",
    },
  ];

  return (
    <section className="w-full relative overflow-hidden rounded-xl md:rounded-2xl bg-[#002B5B] text-white p-4 sm:p-6 md:p-8 border border-[#003875] shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Left Column: Headline, Value Prop & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-2.5 sm:space-y-3.5">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 border border-white/15 text-[10px] sm:text-xs font-semibold tracking-wide">
            <FiCheckCircle className="w-3 h-3" />
            <span>FOR OWNERS & CHANNEL PARTNERS</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-snug">
              Sell or Rent Your Property Faster & at Best Price
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
              List your apartment, villa, or plot on JustFlip and connect directly with verified buyers with zero brokerage.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 w-full sm:w-auto">
            <Link
              href="/post-property"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              <span>Post Property — Free</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/register?type=broker"
              className="inline-flex items-center justify-center px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm transition-colors"
            >
              For Brokers
            </Link>
          </div>
        </div>

        {/* Right Column: Compact 2x2 Benefits Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-2 sm:gap-2.5 w-full pt-1 lg:pt-0">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2"
            >
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[11px] sm:text-xs text-white leading-tight truncate">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-300 leading-tight mt-0.5 truncate hidden sm:block">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
