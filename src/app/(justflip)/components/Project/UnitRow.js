import React from "react";

export default function UnitRow({ product, getCurrencySymbol, onView }) {
  const currencySymbol = getCurrencySymbol(product.currency);

  // console.log("product",product)

  // const area =
  //   product.minArea === product.maxArea
  //     ? `${product.minArea} sq.ft`
  //     : `${product.minArea} - ${product.maxArea} sq.ft`;

  // const price =
  //   product.minPrice === product.maxPrice || !product.maxPrice
  //     ? `${currencySymbol} ${product.minPrice}`
  //     : `${currencySymbol} ${product.minPrice} - ${currencySymbol} ${product.maxPrice}`;

  // 1. Validate if valid prices exist
  const hasMinPrice = product?.minPrice !== "" && product?.minPrice !== null && !isNaN(Number(product?.minPrice)) && Number(product?.minPrice) > 0;
  const hasMaxPrice = product?.maxPrice !== "" && product?.maxPrice !== null && !isNaN(Number(product?.maxPrice)) && Number(product?.maxPrice) > 0;

  // 2. Determine price display text
  const price = !hasMinPrice
    ? "On Request"
    : product.minPrice === product.maxPrice || !hasMaxPrice
    ? `${currencySymbol} ${product.minPrice}`
    : `${currencySymbol} ${product.minPrice} - ${currencySymbol} ${product.maxPrice}`;

  // 3. Optional: Format area display text (e.g., "1885 - 1927 sq.ft")
  const area = product?.minArea && product?.maxArea
    ? product.minArea === product.maxArea
      ? `${product.minArea} sq.ft`
      : `${product.minArea} - ${product.maxArea} sq.ft`
    : "On Request";

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