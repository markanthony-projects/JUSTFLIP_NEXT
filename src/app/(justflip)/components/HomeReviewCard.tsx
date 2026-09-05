import Link from "next/link";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import review from "@/public/assets/review.webp";

export default function HomeReviewPromptCard() {
  const positiveTags = ["Metro Nearby", "Safe at Night", "Gated Security"];
  const otherTags = ["Gated Community", "Quiet Streets"];

  return (
    <div className="w-full bg-white rounded-lg md:rounded-lg px-6 sm:px-12 py-2 sm:py-8 border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        
        {/* Image */}
        <div className="relative w-50 h-40 sm:w-80 sm:h-64 shrink-0 md:ml-8">
          <Image
            src={review}
            alt="Rate your locality or society"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Center Content: Title, Stars, Tags fully centered */}
        <div className="flex flex-col items-center text-center space-y-3 flex-1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#002B5B]">
            Rate Your Locality & Residential Project?
          </h3>

          <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-400 uppercase">
            Tap to Review
          </p>

          {/* Interactive Stars */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Link
                key={rating}
                href={`/write-review`}
                className="group p-1 transition-transform transform hover:scale-125 focus:outline-none"
              >
                <FiStar className="w-10 h-10 sm:w-9 sm:h-9 text-slate-500 group-hover:text-amber-400 group-hover:fill-amber-400 transition-colors" />
              </Link>
            ))}
          </div>

          <div className="pt-1 w-full">
            {/* Mobile View: Forced 3 and 2 Stacked Rows with tighter sizing */}
            <div className="flex flex-col items-center gap-2 sm:hidden w-full">
              <div className="flex items-center justify-center gap-1.5 whitespace-nowrap w-full">
                {positiveTags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[11px] font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                {otherTags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tablet & Desktop View: Fluid Row */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-2">
              {[...positiveTags, ...otherTags].map((tag, index) => (
                <span
                  key={index}
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${
                    index < 3
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


