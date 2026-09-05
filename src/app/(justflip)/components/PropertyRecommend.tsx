// import Link from "next/link";
// import Image from "next/image";
// import { FiMapPin, FiHome, FiZap, FiArrowRight } from "react-icons/fi";
// import property from "@/public/assets/property.webp"
// import "../../globals.css"

// export default function PropertyRecommend() {
//     const benefits = [
//     {
//       title: "Target Locations",
//       description: "Choose area near you",
//       icon: <FiMapPin className="w-3.5 h-3.5 shrink-0" />,
//     },
//     {
//       title: "Budget Friendly",
//       description: "Custom price brackets",
//       icon: (
//         <svg
//           className="w-3.5 h-3.5 shrink-0"
//           fill="none"
//           stroke="#002B5B"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2.5"
//           viewBox="0 0 24 24"
//         >
//           <path d="M6 4h12M6 9h12M6 4c6 0 11 1 11 5s-5 5-11 5h3l8 7" />
//         </svg>
//       ),
//     },
//     {
//       title: "BHK Options",
//       description: "1BHK to 4BHK+ layouts",
//       icon: <FiHome className="w-3.5 h-3.5 shrink-0" />
//     },
//     {
//       title: "Instant Results",
//       description: "No waiting, live filters",
//       icon: <FiZap className="w-3.5 h-3.5 shrink-0" />
//     },
//   ];
//   return (
//     <div className="w-full bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
//         {/* Left Column: Top Tag, Title, Description, CTA, Social Proof & Features */}
//         <div className="lg:col-span-7 space-y-6 order-2 md:order-1">

//           {/* Headline & Description */}
//           <div className="space-y-3">
//             <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black leading-[1.2]">
//               Find Your Dream Property in <br />
//               <span className="block sm:inline underline decoration-wavy decoration-slate-300 decoration-2 underline-offset-4 text-[#002B5B]">
//                 2 Simple Steps
//               </span>
//             </h3>
//             <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
//               Select your preferred location, budget, and BHK configuration to instantly view matching verified properties tailored strictly to your needs.
//             </p>
//           </div>

//           {/* CTA Buttons Row */}
//           <div className="flex flex-wrap items-center gap-4 pt-1">
//             <Link
//               href="/recommendation"
//               className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary hover:bg-[#001f3f] text-white font-bold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
//             >
//               <span>Start Property Matcher</span>
//               <FiArrowRight className="text-base" />
//             </Link>
//           </div>

//           {/* 2x2 Feature Boxes Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
//               {benefits.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 shadow-xs"
//                 >
//                   <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
//                     {item.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-slate-900 text-sm font-bold leading-snug">{item.title}</h3>
//                     <p className="text-slate-500 text-xs font-medium">{item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//         </div>

//         {/* Right Column: Large Image Card with Floating Badges */}
//         <div className="lg:col-span-5 relative order-1 md:order-2">
//           <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-200 bg-slate-900 aspect-6.5/5 sm:aspect-square lg:aspect-[5.5/5]">
//             <Image 
//               src={property} 
//               alt="House model with keys for property matching" 
//               fill
//               className="object-cover opacity-95 hover:scale-105 transition-transform duration-500"
//             />
            
//             {/* Top Floating Badge */}
//             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5 z-10">
//               <span className="w-2 h-2 rounded-full bg-primary"></span>
//               Match Found in 2 Mins (Avg.)
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiHome, FiZap, FiArrowRight } from "react-icons/fi";
import property from "@/public/assets/property.webp";
import "../../globals.css";

export default function PropertyRecommend() {
  const benefits = [
    {
      title: "Target Locations",
      description: "Choose area near you",
      icon: <FiMapPin className="w-5 h-5 shrink-0" />,
    },
    {
      title: "Budget Friendly",
      description: "Custom price brackets",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h12M6 9h12M6 4c6 0 11 1 11 5s-5 5-11 5h3l8 7" />
        </svg>
      ),
    },
    {
      title: "BHK Options",
      description: "1BHK to 4BHK+ layouts",
      icon: <FiHome className="w-5 h-5 shrink-0" />,
    },
    {
      title: "Instant Results",
      description: "No waiting, live filters",
      icon: <FiZap className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <section aria-label="Property Recommendation Banner" className="w-full">
      {/* Outer Card Shell with Ambient Shadow & Border Reflection */}
      <div className="relative overflow-hidden rounded-lg md:rounded-lg bg-white border border-slate-200/90 shadow-sm md:shadow-md p-5 sm:p-8 lg:p-10 text-slate-900">
        
        {/* ======================= MOBILE VIEW (< lg) ======================= */}
        <div className="flex flex-col gap-5 lg:hidden">
          {/* Mobile Featured Visual with Trust Badge */}
          <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-lg overflow-hidden shadow-xs sm:shadow-sm border border-slate-200 bg-slate-100 group shrink-0">
            <Image
              src={property}
              alt="House model with keys for property matching"
              fill
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Floating Trust Pill Overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 border border-slate-200/80 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-slate-800 tracking-tight">Match Found in 2 Mins (Avg.)</span>
            </div>
          </div>

          {/* Header & Content Hierarchy */}
          <div className="flex flex-col items-start gap-2.5">

            <h3 className="text-2xl font-extrabold tracking-tight leading-tight text-slate-900">
              Find Your Dream Property in{" "}
              <span className="text-primary block">2 Simple Steps</span>
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              Select your preferred location, budget, and BHK configuration to instantly view matching verified properties tailored strictly to your needs.
            </p>
          </div>

          {/* Mobile 2x2 Value Pillars Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 py-1 text-xs text-slate-700 font-semibold">
            {[
              "Target Locations",
              "Budget Friendly",
              "BHK Options",
              "Instant Results",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Mobile Touch-friendly Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Link
              href="/recommendation"
              className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-white font-bold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] bg-primary hover:bg-[#001f3f]"
            >
              <span>Start Property Matcher</span>
              <FiArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ======================= DESKTOP VIEW (>= lg) ======================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center space-y-5 sm:space-y-6">

            {/* Headline & Description */}
            <div className="space-y-2.5 sm:space-y-3">
              <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
                Find Your Dream Property in <br />
                <span className="block sm:inline underline decoration-wavy decoration-slate-300 decoration-2 underline-offset-4 text-primary">
                  2 Simple Steps
                </span>
              </h2>
              <p className="text-slate-600 text-base lg:text-sm max-w-xl leading-relaxed font-normal">
                Select your preferred location, budget, and BHK configuration to instantly view matching verified properties tailored strictly to your needs.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <Link
                href="/recommendation"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg text-white font-bold text-sm sm:text-base tracking-tight shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:opacity-95 bg-primary hover:bg-[#001f3f]"
              >
                <span>Start Property Matcher</span>
                <FiArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 2x2 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-900 text-sm font-bold leading-snug">{item.title}</h3>
                    <p className="text-slate-500 text-xs font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Badges */}
          <div className="lg:col-span-5 w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full min-h-[420px] rounded-lg overflow-hidden shadow-sm md:shadow-md border border-slate-200 bg-slate-100 group">
                <Image
                  src={property}
                  alt="House model with keys for property matching"
                  fill
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-lg px-3.5 py-2 border border-slate-200/80 shadow-md flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="text-xs font-bold text-slate-800">
                  Match Found in 2 Mins <span className="text-slate-500 font-normal">(Avg.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}