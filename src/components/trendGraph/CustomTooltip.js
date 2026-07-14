"use client";
import { getCurrencySymbol } from "./utils";

export default function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { year, price, currency } = payload[0].payload;
  const symbol = getCurrencySymbol(currency);

  return (
    <div className="bg-white p-2 shadow-md rounded text-sm border border-gray-300">
      <p className="font-semibold text-gray-700">Year: {year}</p>
      <p className="text-gray-600">
        {symbol} {Number(price).toLocaleString()} / Sq. Ft
      </p>
    </div>
  );
}