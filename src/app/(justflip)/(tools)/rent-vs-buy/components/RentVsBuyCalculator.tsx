"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import { FaArrowRight, FaHome } from "react-icons/fa";

// Helper function to format Indian Currency dynamically into Lakh / Cr
const formatIndianCurrency = (amountInRupees: number): string => {
  if (amountInRupees >= 10000000) {
    const crValue = amountInRupees / 10000000;
    return `₹${crValue % 1 === 0 ? crValue.toFixed(0) : crValue.toFixed(2)} Cr`;
  }
  const lakhValue = amountInRupees / 100000;
  return `₹${lakhValue % 1 === 0 ? lakhValue.toFixed(0) : lakhValue.toFixed(1)} Lakhs`;
};

export default function RentVsBuyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(10000000); // 1 cr
  const [currentRent, setCurrentRent] = useState<number>(30000); // 30k/month
  const [appreciationRate, setAppreciationRate] = useState<number>(6); // 6%
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.9); // 8.9%
  const [investmentReturn, setInvestmentReturn] = useState<number>(12); // 12%
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 Years
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  const downPaymentPercent = 0.2; // 20%
  const rentInflation = 0.05; // 5% annual rent hike

  const calculationData = useMemo(() => {
    const downPayment = propertyPrice * downPaymentPercent;
    const loanAmount = propertyPrice - downPayment;
    const monthlyLoanRate = loanInterestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    // Monthly EMI Formula
    const emi =
      (loanAmount *
        monthlyLoanRate *
        Math.pow(1 + monthlyLoanRate, totalMonths)) /
      (Math.pow(1 + monthlyLoanRate, totalMonths) - 1);

    let currentPropertyValue = propertyPrice;
    let remainingLoanPrincipal = loanAmount;
    let buyerNetWorth = 0;

    let renterInvestmentCorpus = downPayment;
    let monthlyRent = currentRent;

    const chartData: { year: number; buyerNetWorthNum: number; renterNetWorthNum: number }[] = [];

    for (let year = 1; year <= tenureYears; year++) {
      // 1. BUYING SCENARIO
      currentPropertyValue *= 1 + appreciationRate / 100;

      for (let m = 0; m < 12; m++) {
        const interestForMonth = remainingLoanPrincipal * monthlyLoanRate;
        const principalForMonth = emi - interestForMonth;
        remainingLoanPrincipal = Math.max(
          0,
          remainingLoanPrincipal - principalForMonth
        );
      }
      buyerNetWorth = currentPropertyValue - remainingLoanPrincipal;

      // 2. RENTING SCENARIO
      renterInvestmentCorpus *= 1 + investmentReturn / 100;

      for (let m = 0; m < 12; m++) {
        const monthlySurplus = emi - monthlyRent;
        if (monthlySurplus > 0) {
          renterInvestmentCorpus +=
            monthlySurplus * Math.pow(1 + investmentReturn / 12 / 100, 11 - m);
        }
      }

      monthlyRent *= 1 + rentInflation;

      chartData.push({
        year,
        buyerNetWorthNum: Math.round(buyerNetWorth),
        renterNetWorthNum: Math.round(renterInvestmentCorpus),
      });
    }

    const finalBuyerNW = chartData[chartData.length - 1].buyerNetWorthNum;
    const finalRenterNW = chartData[chartData.length - 1].renterNetWorthNum;
    const buyingIsBetter = finalBuyerNW > finalRenterNW;

    return {
      emi: Math.round(emi),
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      chartData,
      buyingIsBetter,
      netDifference: Math.abs(finalBuyerNW - finalRenterNW),
    };
  }, [
    propertyPrice,
    currentRent,
    appreciationRate,
    loanInterestRate,
    investmentReturn,
    tenureYears,
  ]);

  const THEME_COLOR = "#002B5B";

  // SVG Line Chart Dimensions & Coordinate Mapping
  const chartWidth = 520;
  const chartHeight = 220;
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = useMemo(() => {
    const allValues = calculationData.chartData.flatMap((d) => [
      d.buyerNetWorthNum,
      d.renterNetWorthNum,
    ]);
    return Math.max(...allValues, 100000) * 1.1;
  }, [calculationData.chartData]);

  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (total - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    return paddingTop + plotHeight - (Math.max(0, val) / maxVal) * plotHeight;
  };

  const buyerPoints = calculationData.chartData
    .map((d, i) => `${getX(i, calculationData.chartData.length)},${getY(d.buyerNetWorthNum)}`)
    .join(" ");

  const renterPoints = calculationData.chartData
    .map((d, i) => `${getX(i, calculationData.chartData.length)},${getY(d.renterNetWorthNum)}`)
    .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const activePoint =
    hoveredYearIndex !== null && calculationData.chartData[hoveredYearIndex]
      ? calculationData.chartData[hoveredYearIndex]
      : calculationData.chartData[calculationData.chartData.length - 1];

  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h1 className="text-xl md:text-3xl font-bold text-slate-900 mb-8">
        Rent vs Buy Financial Decision Tool
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 order-2 lg:order-1">
          {/* Property Price */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="property-price-range" className="text-slate-700 font-medium">Property Price</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {formatIndianCurrency(propertyPrice)}
              </span>
            </div>
            <input
              id="property-price-range"
              name="propertyPrice"
              aria-label="Property Price range slider"
              type="range"
              min={2000000}
              max={100000000}
              step={500000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Monthly Rent */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="monthly-rent-range" className="text-slate-700 font-medium">Monthly Rent</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                ₹{currentRent.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="monthly-rent-range"
              name="monthlyRent"
              aria-label="Monthly Rent range slider"
              type="range"
              min={5000}
              max={200000}
              step={1000}
              value={currentRent}
              onChange={(e) => setCurrentRent(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Home Loan Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="loan-interest-rate-range" className="text-slate-700 font-medium">Home Loan Interest Rate</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {loanInterestRate}%
              </span>
            </div>
            <input
              id="loan-interest-rate-range"
              name="loanInterestRate"
              aria-label="Home Loan Interest Rate range slider"
              type="range"
              min={6.5}
              max={12}
              step={0.1}
              value={loanInterestRate}
              onChange={(e) => setLoanInterestRate(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Time Horizon (Tenure) */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="tenure-years-range" className="text-slate-700 font-medium">Time Horizon</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {tenureYears} Years
              </span>
            </div>
            <input
              id="tenure-years-range"
              name="tenureYears"
              aria-label="Time Horizon range slider in years"
              type="range"
              min={3}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Property Appreciation */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="appreciation-rate-range" className="text-slate-700 font-medium">Expected Property Growth</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {appreciationRate}%
              </span>
            </div>
            <input
              id="appreciation-rate-range"
              name="appreciationRate"
              aria-label="Expected Property Growth percentage slider"
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* SIP Investment Return */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <label htmlFor="investment-return-range" className="text-slate-700 font-medium">SIP Investment Return</label>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {investmentReturn}%
              </span>
            </div>
            <input
              id="investment-return-range"
              name="investmentReturn"
              aria-label="SIP Investment Return percentage slider"
              type="range"
              min={4}
              max={18}
              step={0.5}
              value={investmentReturn}
              onChange={(e) => setInvestmentReturn(Number(e.target.value))}
              style={{ accentColor: THEME_COLOR }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Breakdown Box */}
          <div className="pt-3 border-t border-slate-200 space-y-2 text-xs md:text-sm">
            <div className="flex justify-between text-slate-700 font-medium">
              <span>Down Payment (20%):</span>
              <span className="font-semibold text-slate-900">
                {formatIndianCurrency(calculationData.downPayment)}
              </span>
            </div>
            <div className="flex justify-between text-slate-700 font-medium">
              <span>Loan Principal Amount:</span>
              <span className="font-semibold text-slate-900">
                {formatIndianCurrency(calculationData.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-900 pt-1 font-bold">
              <span>Estimated EMI:</span>
              <span className="text-base font-bold text-[#002B5B]">
                ₹{calculationData.emi.toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Right Output & Visualization Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
          <div
            className="p-5 rounded-2xl text-center border shadow-sm transition-all"
            style={{
              backgroundColor: calculationData.buyingIsBetter
                ? "#002B5B10"
                : "#2563EB10",
              borderColor: calculationData.buyingIsBetter
                ? THEME_COLOR
                : "#2563EB",
            }}
          >
            <h2
              className="text-xl md:text-2xl font-extrabold"
              style={{
                color: calculationData.buyingIsBetter ? THEME_COLOR : "#2563EB",
              }}
            >
              {calculationData.buyingIsBetter
                ? "Buying is Financially Better"
                : "Renting & Investing is Better"}
            </h2>
            <p className="text-sm md:text-base font-medium text-slate-700 mt-1">
              Over {tenureYears} years,{" "}
              {calculationData.buyingIsBetter ? "buying" : "renting"} generates{" "}
              <strong className="text-slate-900 font-bold">
                {formatIndianCurrency(calculationData.netDifference)}
              </strong>{" "}
              more net wealth.
            </p>
          </div>

          <div className="rounded-xl border border-cyan-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-full bg-cyan-600 p-2.5 text-white shrink-0">
                <FaHome className="text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">Ready to make a move?</p>
                <p className="text-xs text-gray-700 font-medium">Browse properties matching your budget up to {formatIndianCurrency(propertyPrice)}</p>
              </div>
            </div>
            <Link
              href={`/search?maxPrice=${propertyPrice}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#002B5B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-opacity-90 shrink-0"
            >
              <span>View Properties</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Zero-Overhead Pure Vector SVG Comparison Chart */}
          <div className="w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            {/* Live Hover Metrics Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 text-xs sm:text-sm">
              <span className="font-bold text-slate-800">
                Year {activePoint.year} Projection:
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-bold text-[#002B5B]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#002B5B]" />
                  <span>Buy: {formatIndianCurrency(activePoint.buyerNetWorthNum)}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <span>Rent: {formatIndianCurrency(activePoint.renterNetWorthNum)}</span>
                </div>
              </div>
            </div>

            {/* Vector Chart */}
            <div className="w-full aspect-[2/1] min-h-[220px] max-h-[300px]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                {/* Horizontal Grid Lines & Y-Axis Labels */}
                {yTicks.map((ratio) => {
                  const yPos = paddingTop + plotHeight * (1 - ratio);
                  const labelVal = maxVal * ratio;
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingLeft}
                        y1={yPos}
                        x2={chartWidth - paddingRight}
                        y2={yPos}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={yPos + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="600"
                        fill="#64748b"
                      >
                        {formatIndianCurrency(labelVal)}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Ticks & Labels */}
                {calculationData.chartData.map((d, i) => {
                  const total = calculationData.chartData.length;
                  const showLabel =
                    i === 0 ||
                    i === Math.floor(total / 2) ||
                    i === total - 1 ||
                    total <= 6;
                  const xPos = getX(i, total);

                  return (
                    <g key={d.year}>
                      {showLabel && (
                        <text
                          x={xPos}
                          y={chartHeight - 8}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill="#64748b"
                        >
                          Yr {d.year}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Renter Polyline (Green) */}
                <polyline
                  points={renterPoints}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Buyer Polyline (Navy) */}
                <polyline
                  points={buyerPoints}
                  fill="none"
                  stroke="#002B5B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Hover Columns */}
                {calculationData.chartData.map((d, i) => {
                  const total = calculationData.chartData.length;
                  const xPos = getX(i, total);
                  const colWidth = plotWidth / total;

                  return (
                    <rect
                      key={d.year}
                      x={xPos - colWidth / 2}
                      y={paddingTop}
                      width={colWidth}
                      height={plotHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredYearIndex(i)}
                      onMouseLeave={() => setHoveredYearIndex(null)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center items-center gap-6 pt-3 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-800">
                <span className="h-3 w-3 rounded-full bg-[#002B5B]" />
                <span>Buying Net Worth</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <span className="h-3 w-3 rounded-full bg-emerald-600" />
                <span>Renting & Investing Net Worth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}