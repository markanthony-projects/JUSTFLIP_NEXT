import React from "react";
import Image from "next/image";
import { 
  FiCheckCircle, 
  FiCpu, 
  FiTrendingUp, 
  FiLayers 
} from "react-icons/fi";

// Image Imports (Preserved from original setup)
import Frame from "@/public/assets/About/Frame_1984080321.png";
import bgimage from "@/public/assets/About/Group.png";
import about from "@/public/assets/About/Rectangle.png";

const About = () => {
  const highlights = [
    {
      icon: FiCheckCircle,
      title: "100% Verified Data",
      description: "Transparent information at every stage of the journey.",
    },
    {
      icon: FiTrendingUp,
      title: "Mortgage Tools",
      description: "Built-in calculators to make smart financial choices.",
    },
    {
      icon: FiLayers,
      title: "Robust CRM",
      description: "Connecting brokers & developers directly with target buyers.",
    },
  ];

  return (
    <div className="w-full max-w-[1540px] mx-auto space-y-12 sm:space-y-16 py-4 font-sans text-slate-800">
      
      {/* 1. HERO / OUR MISSION SECTION */}
      <section className="relative w-full min-h-[420px] lg:min-h-[520px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-6 sm:p-12">
        {/* Original Background Image */}
        <Image
          src={bgimage}
          alt="Our Mission Background"
          fill
          priority
          className="object-cover scale-105 transition-transform duration-1000 hover:scale-100"
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Pulsing Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Redefining Real Estate</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
            Our Mission
          </h1>

          {/* Frosted Glass Quote Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
            <p className="text-lg sm:text-2xl font-bold leading-relaxed italic tracking-wide">
              &ldquo;To change the way people buy and experience real estate, making the process simple, transparent, and trustworthy.&rdquo;
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            JustFlip follows a simple, efficient approach that builds trust and scales easily, ensuring a smoother experience for buyers, sellers, and investors.
          </p>
        </div>
      </section>

      {/* 2. WHY JUSTFLIP SECTION */}
      <section className="py-12 px-6 lg:px-12 bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-sm space-y-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Original Frame Image with Creative Framing */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#002B5B] to-sky-500 rounded-3xl blur-2xl opacity-20" />
            
            <div className="relative w-full max-w-[340px] h-[340px] sm:h-[380px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={Frame}
                alt="Why JustFlip Illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Paragraph + Feature Cards */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600">The JustFlip Advantage</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002B5B] mt-1">
                Why JustFlip?
              </h2>
            </div>

            <p className="text-sm sm:text-base font-normal text-[#333333] leading-relaxed text-justify max-w-[738px]">
              At JustFlip, we’re transforming real estate by pouring clarity into a cluttered market. Our platform empowers you with verified information at every step—whether you&apos;re searching, financing, or customizing your home. With AI-driven recommendations, detailed property insights, market trend graphs, and an easy mortgage calculator, we help you make well-informed homeownership decisions. For brokers and developers, our robust CRM infrastructure connects them with the right audience, driving meaningful and lasting real estate transactions. From the first thought to the final key, JustFlip redefines homeownership with transparency, trust, and the right tools for informed choices.
            </p>
         
            {/* 4 Feature Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                const isThird = index == 2

                return (
                  <div
                    key={index}
                    className={`p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#002B5B] hover:bg-white hover:shadow-md transition-all duration-200 flex items-start space-x-3.5 group ${
                        isThird ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full" : ""
                    }`}
                  >
                    <div className="p-2.5 rounded-lg bg-sky-50 text-[#002B5B] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#002B5B]">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-normal leading-snug mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="relative w-full min-h-[380px] lg:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-6 sm:p-12">
        {/* Original About Background Image */}
        <Image
          src={about}
          alt="About Us Background"
          fill
          className="object-cover"
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-widest border border-sky-400/30">
            Next-Gen Real Estate Tech
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight pt-4">
            About Us
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto">
            A game-changing real estate platform built for developers, investors, and businesses, seamlessly blending transactions with razor-sharp market insights. Fueled by AI and big data analytics, it redefines every stage of the property journey—powering predictive trends, immersive virtual tours, intelligent financing, and streamlined sales.
          </p>

          {/* Interactive Feature Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-sky-200">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">Predictive Trends</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">Virtual Tours</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">Intelligent Financing</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">Streamlined Sales</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
