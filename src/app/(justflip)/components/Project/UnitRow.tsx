import React from "react";

export default function UnitRow({ product, getCurrencySymbol, onView }: { product: any, getCurrencySymbol: (val: any) => string, onView: () => void }) {
  const currencySymbol = getCurrencySymbol(product.currency);

  const hasMinPrice = Boolean(product?.minPrice && String(product.minPrice).trim() !== "");
  const hasMaxPrice = Boolean(product?.maxPrice && String(product.maxPrice).trim() !== "");

  let price = "On Request";

  if (hasMinPrice && hasMaxPrice) {
      price = product.minPrice === product.maxPrice
          ? `${currencySymbol} ${product.minPrice}`
          : `${currencySymbol} ${product.minPrice} - ${product.maxPrice}`;
  } else if (hasMinPrice) {
      price = `${currencySymbol} ${product.minPrice}`;
  } else if (hasMaxPrice) {
      price = `${currencySymbol} ${product.maxPrice}`;
  }

  const isValidNumber = (val: any) => {
      return val !== null && val !== undefined && val !== "" && !isNaN(Number(val)) && Number(val) > 0;
  };

  const hasMinArea = isValidNumber(product?.minArea);
  const hasMaxArea = isValidNumber(product?.maxArea);

  let area = "On Request";

  if (hasMinArea && hasMaxArea) {
      area = Number(product.minArea) === Number(product.maxArea)
          ? `${product.minArea} sq.ft`
          : `${product.minArea} - ${product.maxArea} sq.ft`;
  } else if (hasMinArea) {
      area = `${product.minArea} sq.ft`;
  } else if (hasMaxArea) {
      area = `${product.maxArea} sq.ft`;
  }

  return (
    <div className="group border border-slate-200/80 rounded-lg transition-all duration-300 flex flex-col h-fit overflow-hidden max-w-[380px] w-full mt-2 relative">
      <div className="absolute right-[-30px] top-[-3px] bottom-1 w-3/4 pointer-events-none overflow-hidden flex items-center justify-end z-0">
        <img 
          src="/assets/building_watermark.png" 
          alt="Watermark" 
          className="w-full h-full object-contain object-right transform scale-150 mix-blend-multiply opacity-45" 
        />
      </div>

      {/* Upper Content Section */}
      <div className="p-5 pb-4 relative z-10">
        
        {/* Category Header Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Price Range */}
        <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          {price}
        </div>

        {/* Area with Icon */}
        <div className="flex items-center text-slate-500 text-xs sm:text-sm font-medium gap-1.5">
          <div className="p-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 19L5 5v14h14zM8 16h2m-2-3h4m-4-3h2"
              />
            </svg>
          </div>
          <span>{area}</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <button
        type="button"
        onClick={onView}
        className="w-full border-t border-slate-100 px-5 py-3 flex items-center justify-between text-[#002B5B] transition-colors text-left group/btn relative z-10 cursor-pointer"
      >
        <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
          <div className="w-6 h-6 rounded-full bg-[#002B5B]/10 flex items-center justify-center text-[#002B5B] group-hover/btn:bg-[#002B5B] group-hover/btn:text-white transition-colors">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>
          <span>View Floor Plan</span>
        </div>

        <svg
          className="w-4 h-4 text-[#002B5B] transform group-hover/btn:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div> 
  );
}

