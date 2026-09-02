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
    <div className="border border-slate-200/60 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-fit overflow-hidden max-w-[340px] w-full">
      {/* Upper Content Section */}
      <div className="px-4 pt-4 sm:px-5 sm:pt-5 pb-3">
        {/* Category Header */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-1">
          {product.category}
        </h3>

        {/* Price Range */}
        <div className="text-sm sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
          {price}
        </div>

        {/* Area with Icon */}
        <div className="flex items-center text-slate-500 text-xs sm:text-sm font-normal gap-1">
          <svg
            className="w-3.5 h-3.5 text-slate-500 shrink-0"
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
          <span>{area}</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <button
        type="button"
        onClick={onView}
        className="w-full hover:bg-slate-50 border-t border-slate-100 relative sm:px-5 px-5 py-3 flex items-center justify-between text-[#002B5B] transition-colors text-left group"
      >
        <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
          <svg
            className="w-3.5 h-3.5 text-[#002B5B]"
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
          <span>Floor Plan</span>
        </div>

        <svg
          className="w-3.5 h-3.5 text-[#002B5B] transform group-hover:translate-x-0.5 transition-transform"
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