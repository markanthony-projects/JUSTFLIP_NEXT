import React from "react";

export default function UnitRow({ product, getCurrencySymbol, onView }) {
  const currencySymbol = getCurrencySymbol(product.currency);

  const area =
    product.minArea === product.maxArea
      ? `${product.minArea} sq.ft`
      : `${product.minArea} - ${product.maxArea} sq.ft`;

  const price =
    product.minPrice === product.maxPrice || !product.maxPrice
      ? `${currencySymbol} ${product.minPrice}`
      : `${currencySymbol} ${product.minPrice} - ${currencySymbol} ${product.maxPrice}`;

  return (
    <tr className="bg-white text-black">
      <td className="px-4 py-3 text-xs md:text-sm">{product.category}</td>
      <td className="px-4 py-3 text-xs md:text-sm">{area}</td>
      <td className="px-4 py-3 text-xs md:text-sm">{price}</td>
      <td className="px-4 py-3 text-xs md:text-sm">
        <button
          onClick={onView}
          className="bg-[#002B5B] text-white px-2 py-1 rounded-md text-xs md:text-sm hover:opacity-90 transition"
        >
          View Floor Plan
        </button>
      </td>
    </tr>
  );
}