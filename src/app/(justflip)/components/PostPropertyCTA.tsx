import Link from "next/link";

export default function PostPropertyCTA() {
  const benefits = [
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
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 lg:p-10 text-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center space-y-5 sm:space-y-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-xs bg-[#002B5B]/5 border border-[#002B5B]/25 text-[#002B5B]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="#002B5B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="uppercase tracking-wider font-bold text-xs text-[#002B5B]">
                For Owners &amp; Channel Partners
              </span>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#002B5B]/10 text-[#002B5B] border border-[#002B5B]/15">
                Zero Brokerage
              </span>
            </div>

            {/* Headline & Description */}
            <div className="space-y-2.5 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
                Sell or Rent Your Property{" "}
                <span className="block sm:inline underline decoration-wavy decoration-slate-300 decoration-2 underline-offset-4 text-[#002B5B]">
                  Faster &amp; at Best Price
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
                List your home, apartment, or plot on JustFlip and connect directly with verified, genuine buyers. Warm human
                support, direct negotiations, and zero middlemen fees.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <Link
                href="/post-property"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm sm:text-base tracking-tight shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:opacity-95 bg-[#002B5B] hover:bg-[#00234a]"
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
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base tracking-tight transition-colors shadow-xs border border-[#002B5B]/20 text-[#002B5B] bg-white hover:bg-[#002B5B]/5"
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
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#002b5b]/10 text-[#002b5b]">
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
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 group">
              <img
                alt="Happy homeowner handing over keys in front of modern property"
                className="w-full h-72 sm:h-96 lg:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwqVCv_CkreoKDyJL7qXVl1AbetKUk42EQVDEzxAiZoXTjA3xb0Bq37I8tEJXbcR53z0DtpDyauz8vaKu9DS26-8i69guf2l82fp_1xcavaU0_d_sqERXokjaAOf4hK7ANuoFy1Z2EVmsAARCeJOzT74lW6s1o9ToWGEQFCmAQStQJSyWD9CRRxTEwTPL8sk6iJQYT4xsaJLG7b1g628c0k3HwZzcC14T61i5HMngrnF2QRzTXdv91Eg"
                loading="lazy"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2 border border-slate-200/80 shadow-md flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#002b5b]" />
                <div className="text-xs font-bold text-slate-800">
                  Deal Closed in 14 Days <span className="text-slate-500 font-normal">(Avg.)</span>
                </div>
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/80 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#002b5b]" />
                  <span className="text-xs font-bold text-slate-800">Verified Inquiries Live</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-[#002B5B] bg-[#002B5B]/10 border border-[#002B5B]/15">
                  Zero Brokerage
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
