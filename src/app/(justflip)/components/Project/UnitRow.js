import React from "react";

export default function UnitRow({ product, getCurrencySymbol, onView }) {
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


  const isValidNumber = (val) => {
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