import Link from "next/link";
import { FiMapPin, FiDollarSign, FiHome, FiZap, FiArrowRight } from "react-icons/fi";

export default function PropertyRecommend() {
  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Title, Description & CTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#002B5B]/5 rounded-full border border-[#002B5B]/10 text-[#002B5B] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#002B5B]"></span>
            Quick Property Matcher
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002B5B] leading-snug">
            Find Your Property in 2 Simple Steps
          </h3>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
            Select your preferred location, budget, and BHK configuration to instantly view matching verified properties tailored strictly to your needs.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/recommendation"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#002B5B] hover:bg-[#001f3f] text-white font-bold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Property Matcher</span>
              <FiArrowRight className="text-base" />
            </Link>
          </div>
        </div>

        {/* Right Column: 2x2 Feature Highlights Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-3">
          
          {/* Feature 1 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#002B5B]/10 text-[#002B5B] flex items-center justify-center text-lg mb-3">
              <FiMapPin />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#002B5B]">Target Locations</h4>
              <p className="text-xs text-slate-600 mt-0.5">Choose area near you</p>
            </div>
          </div>

          {/* Feature 2 - Rupee Icon */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#002B5B]/10 text-[#002B5B] flex items-center justify-center text-lg mb-3">
              <FiDollarSign />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#002B5B]">Budget Friendly</h4>
              <p className="text-xs text-slate-600 mt-0.5">Custom price brackets</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#002B5B]/10 text-[#002B5B] flex items-center justify-center text-lg mb-3">
              <FiHome />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#002B5B]">BHK Options</h4>
              <p className="text-xs text-slate-600 mt-0.5">1BHK to 4BHK+ layouts</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="w-9 h-9 rounded-lg bg-[#002B5B]/10 text-[#002B5B] flex items-center justify-center text-lg mb-3">
              <FiZap />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#002B5B]">Instant Results</h4>
              <p className="text-xs text-slate-600 mt-0.5">No waiting, live filters</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}