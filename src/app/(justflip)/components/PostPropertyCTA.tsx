import Link from "next/link";

export default function PostPropertyCTA() {
  const desktopBenefits = [
    {
      title: "100% Free Listing",
      description: "Zero brokerage, zero hidden fees",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "50,000+ Active Buyers",
      description: "Reach families actively looking",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Phone-Verified Inquiries",
      description: "Screened & spam-free leads",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Fast 3-Min Process",
      description: "Assisted photo upload & guidance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section aria-label="Property Owner and Partner Banner" className="w-full">
      {/* Outer Card Shell with Ambient Shadow & Border Reflection */}
      <div className="relative overflow-hidden rounded-lg md:rounded-lg bg-white border border-slate-200/90 shadow-sm md:shadow-md p-5 sm:p-8 lg:p-10 text-slate-900">
        
        {/* ======================= MOBILE VIEW (< lg) ======================= */}
        <div className="flex flex-col gap-5 lg:hidden">
          {/* Mobile Featured Visual with Trust Badge */}
          <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-lg overflow-hidden shadow-xs sm:shadow-sm border border-slate-200 bg-slate-100 group shrink-0">
            <img
              alt="Happy homeowner receiving keys"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              src="/banners/post-property-cta.webp"
              loading="lazy"
            />

            {/* Floating Trust Pill Overlay */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 border border-slate-200/80 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-slate-800 tracking-tight">Avg. 14 Days to Close</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              Direct Owner Deal
            </div>
          </div>

          {/* Header & Content Hierarchy */}
          <div className="flex flex-col items-start gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-primary border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Zero Brokerage • Direct Owners</span>
            </div>

            <h3 className="text-2xl font-extrabold tracking-tight leading-tight text-slate-900">
              Sell or Rent Your Property{" "}
              <span className="text-primary block">Faster &amp; at Best Price</span>
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              List your property on JustFlip and connect directly with 50,000+ verified buyers with zero brokerage.
            </p>
          </div>

          {/* Mobile 2x2 Value Pillars Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 py-1 text-xs text-slate-700 font-semibold">
            {[
              "100% Free Listing",
              "50k+ Active Buyers",
              "Direct Buyer Chats",
              "3-Min Fast Post",
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
              href="/post-property"
              className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-white font-bold text-sm tracking-tight shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] bg-primary hover:bg-primary-hover"
            >
              <span>Post Property — Free</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href="/register?type=broker"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-semibold text-xs text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 bg-white hover:bg-slate-50"
            >
              For Brokers &amp; Agents
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
                Sell or Rent Your Property <br />
                <span className="block sm:inline underline decoration-wavy decoration-slate-300 decoration-2 underline-offset-4 text-primary">
                  Faster &amp; at Best Price
                </span>
              </h2>
              <p className="text-slate-600 text-base lg:text-sm max-w-xl leading-relaxed font-normal">
                List your home, apartment, or plot on JustFlip and connect directly with verified, genuine buyers. Warm human
                support, direct negotiations, and zero middlemen fees.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <Link
                href="/post-property"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg text-white font-bold text-sm sm:text-base tracking-tight shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:opacity-95 bg-primary hover:bg-primary-hover"
              >
                <span>Post Property — Free</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/register?type=broker"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base tracking-tight transition-colors shadow-xs border border-primary/20 text-primary bg-white hover:bg-primary/5"
              >
                For Brokers &amp; Agents
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 py-1 text-slate-600 text-xs sm:text-sm">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  alt="Priya S."
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF5eDcKPCnN7KwYgYd9hKsagT_6ZKuUCQQZWNZ-TYgq05YMREnktvVv3QmwGDEy2M196VDFgQpMFW5sLfybGy1q6PmWEjZ94ExxI_PI5BUYHmTiREUbFWM-CuKQloXwr2xzT2YHbzwwS5jF9NznYJfcr7g4fSQCjEGLqNN6pS82xM9EwSZvj5io004BZNw7yPGYH0XGJgL2bm7vn-Edgai45m6ecGZNNxy0nBNqr2EhZkX1xhIUq4dXw"
                  loading="lazy"
                />
                <img
                  alt="Rahul K."
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvi5OqEmvA2-XUOw_ZLe4pu5nO5B7dCzc_CwjKkdY8D3vgW1LNAHrZ2L2feaPmt1dYGP_A8ArcdUbOwU55ZI8DBaSd639h7uK3HNFUb5ztmGIfILT-ug1A32nFAuc7g8vIEAtOFgAfrBqR8uZz8EjYBL2ESgbKAKgaLSRhzgx6GKm0vQkqby5sLGUPP5xTB0afHwfJxC0p-qA5CI6Mbfyqt3gDWQZQBoR899bIEMCtXNd03F5Cs0W8FA"
                  loading="lazy"
                />
                <img
                  alt="Sunita V."
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwFy0B87GYLTNfDi5YYuvv1gXUb1JV9F1K3ytcW1sWW3jJtbNLYzweZ8DxutT0YZcAJ0PxBvqbyaFZcJUb6nMEYbCitWEvW1KcLMRSSICHRtBSdDbm_R0n3riR7D8RRznmOHliKxyuAY9dH4IytUOqY9WEza0Tr2_Cpb6Kl80SRR9mSiTqeIBnmZefxwJU5tvNoCD6HqSGAD77Y3st_RAilocsbF0sCM0SsGt7HtbVkOMV4ulSGIZRMQ"
                  loading="lazy"
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900">12,400+ happy owners</span>
                  <span className="text-amber-500 font-bold flex items-center text-xs">★ 4.9/5</span>
                </div>
                <p className="text-slate-500 text-xs">Found verified tenants &amp; buyers this month</p>
              </div>
            </div>

            {/* 2x2 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
              {desktopBenefits.map((item, index) => (
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
            <div className="relative w-full rounded-lg overflow-hidden shadow-sm md:shadow-md border border-slate-200 bg-slate-100 group">
              <img
                alt="Happy homeowner handing over keys in front of modern property"
                className="w-full h-72 sm:h-96 lg:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwqVCv_CkreoKDyJL7qXVl1AbetKUk42EQVDEzxAiZoXTjA3xb0Bq37I8tEJXbcR53z0DtpDyauz8vaKu9DS26-8i69guf2l82fp_1xcavaU0_d_sqERXokjaAOf4hK7ANuoFy1Z2EVmsAARCeJOzT74lW6s1o9ToWGEQFCmAQStQJSyWD9CRRxTEwTPL8sk6iJQYT4xsaJLG7b1g628c0k3HwZzcC14T61i5HMngrnF2QRzTXdv91Eg"
                loading="lazy"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-lg px-3.5 py-2 border border-slate-200/80 shadow-md flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="text-xs font-bold text-slate-800">
                  Deal Closed in 14 Days <span className="text-slate-500 font-normal">(Avg.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
