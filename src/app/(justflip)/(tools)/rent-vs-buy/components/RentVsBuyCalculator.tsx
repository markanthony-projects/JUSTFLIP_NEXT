"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

    const chartData = [];

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
        year: `Yr ${year}`,
        buyerNetWorthNum: buyerNetWorth,
        renterNetWorthNum: renterInvestmentCorpus,
      });
    }

    const finalBuyerNW = chartData[chartData.length - 1].buyerNetWorthNum;
    console.log("buyer....",finalBuyerNW)
    const finalRenterNW = chartData[chartData.length - 1].renterNetWorthNum;
    console.log("renter ...",finalRenterNW)
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

  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-8">
        Rent vs Buy Financial Decision Tool
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 order-2 lg:order-1">
          {/* Property Price */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
              <span className="text-slate-600">Property Price</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {formatIndianCurrency(propertyPrice)}
              </span>
            </div>
            <input
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
              <span className="text-slate-600">Monthly Rent</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                ₹{currentRent.toLocaleString("en-IN")}
              </span>
            </div>
            <input
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
              <span className="text-slate-600">Home Loan Interest Rate</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {loanInterestRate}%
              </span>
            </div>
            <input
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
              <span className="text-slate-600">Time Horizon</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {tenureYears} Years
              </span>
            </div>
            <input
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
              <span className="text-slate-600">Expected Property Growth</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {appreciationRate}%
              </span>
            </div>
            <input
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
              <span className="text-slate-600">SIP Investment Return</span>
              <span style={{ color: THEME_COLOR }} className="font-bold">
                {investmentReturn}%
              </span>
            </div>
            <input
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
            <div className="flex justify-between text-slate-600">
              <span>Down Payment (20%):</span>
              <span className="font-semibold text-slate-800">
                {formatIndianCurrency(calculationData.downPayment)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Loan Principal Amount:</span>
              <span className="font-semibold text-slate-800">
                {formatIndianCurrency(calculationData.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-900 pt-1 font-bold">
              <span>Estimated EMI:</span>
              <span className="text-base">
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
                ? "#02BD5B10"
                : "#2563EB10",
              borderColor: calculationData.buyingIsBetter
                ? THEME_COLOR
                : "#2563EB",
            }}
          >
            <h3
              className="text-xl md:text-2xl font-extrabold"
              style={{
                color: calculationData.buyingIsBetter ? THEME_COLOR : "#2563EB",
              }}
            >
              {calculationData.buyingIsBetter
                ? "Buying is Financially Better"
                : "Renting & Investing is Better"}
            </h3>
            <p className="text-sm md:text-base font-medium text-slate-600 mt-1">
              Over {tenureYears} years,{" "}
              {calculationData.buyingIsBetter ? "buying" : "renting"} generates{" "}
              <strong className="text-slate-900 font-bold">
                {formatIndianCurrency(calculationData.netDifference)}
              </strong>{" "}
              more net wealth.
            </p>
          </div>

          {/* Chart Section */}
          <div className="w-full h-[360px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={calculationData.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="year"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => formatIndianCurrency(val)}
                />
                <Tooltip
                  formatter={(value) => [
                    formatIndianCurrency(Number(value)),
                    "",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    borderColor: "#E2E8F0",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "15px" }} />
                <Line
                  type="monotone"
                  dataKey="buyerNetWorthNum"
                  name="Buying Net Worth"
                  stroke={calculationData.buyingIsBetter ? THEME_COLOR : "#94A3B8"}
                  strokeWidth={calculationData.buyingIsBetter ? 3.5 : 2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="renterNetWorthNum"
                  name="Renting Net Worth"
                  stroke={!calculationData.buyingIsBetter ? THEME_COLOR : "#94A3B8"}
                  strokeWidth={!calculationData.buyingIsBetter ? 3.5 : 2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}