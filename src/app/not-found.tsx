'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import React,{ useEffect, useState } from "react";
import { FiArrowRight, FiHome } from "react-icons/fi";

const REDIRECT_TIME = 10;

export default function NotFound() {
    const router = useRouter()
    const [ secondsLeft, setSecondsLeft ] = useState(REDIRECT_TIME)

    useEffect(() =>{
        const interval = setInterval(()=>{
            setSecondsLeft((prev) => {
                    if(prev <= 1){
                    clearInterval(interval)
                    router.replace('/')
                    return 0;
                }
                return prev-1
            })
        },1000)

        return ()=> clearInterval(interval)
    },[router])

    const goHome = () => {
        router.replace('/')
    }

    const progress = (secondsLeft/REDIRECT_TIME) * 100

    return (
    <main className="min-h-[80vh] bg-slate-50 px-5 py-10 flex items-center justify-center">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,43,91,0.08)]">
        <div className="grid min-h-[560px] md:grid-cols-2">

          {/* LEFT CONTENT */}
          <section className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">

            {/* 404 */}
            <div className="mb-5">
              <span className="text-7xl font-extrabold tracking-tight text-[#002B5B] sm:text-8xl">
                404
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-lg text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Looks like this property
              <span className="text-[#002B5B]"> doesn&apos;t exist.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-500 sm:text-lg">
              The page you&apos;re looking for may have been moved, removed,
              or the link might be incorrect.
            </p>

            <button
              onClick={goHome}
              className="mt-8 flex w-fit items-center gap-3 rounded-xl bg-[#002B5B] px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#003b7a] hover:shadow-lg"
            >
              <FiHome size={19} />
              Go to Home
              <FiArrowRight size={18} />
            </button>

           
            <div className="mt-8 max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Taking you home automatically...
                </span>

                <span className="font-semibold text-[#002B5B]">
                  {secondsLeft}s
                </span>
              </div>

              
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#002B5B] transition-all duration-1000 ease-linear"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* RIGHT ILLUSTRATION */}
          <section className="hidden relative sm:flex items-center justify-center overflow-hidden bg-[#002B5B] px-6 py-12">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

            <div className="relative w-full max-w-120">

              <div className="absolute right-4 top-2 z-10 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
                <p className="text-xs font-medium text-white/60">
                  PROPERTY STATUS
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Not Found
                </p>
              </div>

              <svg viewBox="0 0 520 430" className="h-auto w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ground */}
                <path d="M55 365H470" stroke="white" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round"/>

                {/* Building 1 */}
                <rect y="190" width="120" height="175" rx="6" x="65" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.55" strokeWidth="3"/>

                {/* Building 1 roof */}
                <path d="M55 190L125 145L195 190" stroke="white" strokeOpacity="0.7" strokeWidth="3" strokeLinejoin="round"/>

                {/* Windows building 1 */}
                <rect x="87" y="215" width="25" height="28" rx="3" stroke="white" strokeOpacity="0.65" strokeWidth="2"/>

                <rect x="135" y="215" width="25" height="28" rx="3" stroke="white" strokeOpacity="0.65" strokeWidth="2"/>

                <rect x="87" y="260" width="25" height="28" rx="3" stroke="white" strokeOpacity="0.65" strokeWidth="2"/>

                <rect x="135" y="260" width="25" height="28" rx="3" stroke="white" strokeOpacity="0.65" strokeWidth="2"/>

                {/* Building 2 */}
                <rect x="210" y="125" width="120" height="240" rx="6" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.7" strokeWidth="3"/>

                {/* Building 2 top */}
                <path d="M195 125H345" stroke="white" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round"/>

                {/* Windows building 2 */}
                {[150, 195, 240, 285].map((y) => (
                  <React.Fragment key={y}>
                    <rect x="232" y={y} width="25" height="27" rx="3" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.6" strokeWidth="2" />

                    <rect x="282" y={y} width="25" height="27" rx="3" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.6" strokeWidth="2" />
                  </React.Fragment>
                ))}

                {/* Broken building section */}
                <path d="M365 365V235L420 205L475 235V365" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinejoin="round" />

                {/* Broken roof */}
                <path d="M350 235L385 215L405 225L430 195L490 235" stroke="white" strokeOpacity="0.7" strokeWidth="3" strokeLinejoin="round" />

                {/* Broken pieces */}
                <path d="M385 185L402 170" stroke="white" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />

                <path d="M410 175L430 158" stroke="white" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />

                <path d="M440 180L455 164" stroke="white" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />

                {/* Windows building 3 */}
                <rect x="385" y="260" width="25" height="27" rx="3" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

                <rect x="430" y="260" width="25" height="27" rx="3" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

                <rect x="385" y="305" width="25" height="27" rx="3" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

                <rect x="430" y="305" width="25" height="27" rx="3" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

                {/* Location pin */}
                <g transform="translate(145 65)">
                  <path d="M30 0C13.4 0 0 13.4 0 30C0 52 30 75 30 75C30 75 60 52 60 30C60 13.4 46.6 0 30 0Z" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.7" strokeWidth="3" />

                  <circle cx="30" cy="30" r="10" fill="white" fillOpacity="0.7" />
                </g>

                {/* Floating dots */}
                <circle cx="85" cy="90" r="5" fill="white" fillOpacity="0.35" />
                <circle cx="390" cy="90" r="7" fill="white" fillOpacity="0.2" />
                <circle cx="455" cy="125" r="4" fill="white" fillOpacity="0.35" />
              </svg>

              {/* Bottom message */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="text-sm font-medium text-white/60">
                  Your next property is waiting
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
    );
}