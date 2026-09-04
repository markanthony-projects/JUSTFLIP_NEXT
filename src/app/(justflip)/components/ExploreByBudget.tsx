import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const BUDGET_BUCKETS = [
  {
    label: "Under ₹50 Lac",
    subtext: "Budget-friendly homes",
    minPrice: 0,
    maxPrice: 5000000,
  },
  {
    label: "₹50 Lac – ₹1 Cr",
    subtext: "Mid-segment flats",
    minPrice: 5000000,
    maxPrice: 10000000,
  },
  {
    label: "₹1 Cr – ₹2 Cr",
    subtext: "Premium residences",
    minPrice: 10000000,
    maxPrice: 20000000,
  },
  {
    label: "₹2 Cr – ₹5 Cr",
    subtext: "Luxury villas & estates",
    minPrice: 20000000,
    maxPrice: 50000000,
  },
  {
    label: "Above ₹5 Cr",
    subtext: "Ultra luxury penthouses",
    minPrice: 50000000,
    maxPrice: 500000000,
  },
];

export default function ExploreByBudget() {
  return (
    <section className="w-full flex flex-col">
      {/* Section Header */}
      <div className="md:mb-2 mb-0 flex items-center justify-between">
        <div>
          <h2 className="text-sm md:text-xl font-semibold text-[#002B5B]">
            Explore Properties by Budget
          </h2>
        </div>
      </div>

      {/* Bigger Clean Budget Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {BUDGET_BUCKETS.map((bucket, index) => (
          <Link
            key={index}
            href={`/search?minPrice=${bucket.minPrice}&maxPrice=${bucket.maxPrice}`}
            className="group bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#002B5B] hover:shadow-sm transition-all duration-200 flex flex-col justify-between min-h-[96px] sm:min-h-[110px]"
          >
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="text-[15px] sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-[#002B5B] transition-colors leading-snug">
                {bucket.label}
              </h3>
              <FiArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#002B5B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0 mt-0.5" />
            </div>

            <p className="text-xs sm:text-[13px] text-gray-500 mt-2.5 leading-snug">
              {bucket.subtext}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
