import Link from "next/link";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import UploadPropBanner from "@/public/assets/UploadPropBanner.png";

export default function HomeReviewPromptCard() {
  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        
        {/* Increased image wrapper dimensions here */}
        <div className="relative w-52 h-40 sm:w-60 sm:h-48 shrink-0 sm:mr-30">
          <Image
            src={UploadPropBanner}
            alt="Rate your locality or society"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Center Text and Interactive Stars */}
        <div className="flex flex-col items-center text-center space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#002B5B]">
            Rate Your Locality & Residential Project ?
          </h3>

          <div className="flex items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Link
                key={rating}
                href={`/write-review`}
                className="group p-1 transition-transform transform hover:scale-125 focus:outline-none"
              >
                <FiStar className="w-8 h-8 sm:w-9 sm:h-9 text-slate-400 group-hover:text-amber-400 group-hover:fill-amber-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}