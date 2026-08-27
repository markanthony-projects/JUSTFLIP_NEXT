"use client";

import { useState, useMemo } from "react";
import { CiWallet } from "react-icons/ci";
import SummaryCard from "./SummaryCard";
import { FaArrowRight, FaHome } from "react-icons/fa";
import Link from "next/link";

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export default function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("100000");
  const [existingEmi, setExistingEmi] = useState("10000");
  const [age, setAge] = useState("30");
  const [tenure, setTenure] = useState("20");
  const [interestRate, setInterestRate] = useState("8.5");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Synchronous calculation via useMemo — eliminates double-render & layout reflow
  const results = useMemo(() => {
    const incomeNum = parseFloat(monthlyIncome) || 0;
    const existingEmiNum = parseFloat(existingEmi) || 0;
    const ageNum = parseInt(age) || 30;
    const tenureNum = parseInt(tenure) || 20;
    const rateNum = parseFloat(interestRate) || 8.5;

    const maxAllowedTenure = Math.max(1, Math.min(tenureNum, 60 - ageNum));
    const totalMonths = maxAllowedTenure * 12;

    const maxAllowableTotalEmi = incomeNum * 0.50;
    const availableEmiForNewLoan = maxAllowableTotalEmi - existingEmiNum;

    if (availableEmiForNewLoan <= 0 || incomeNum <= 0) {
      return {
        maxLoanAmount: 0,
        maxEligibleEmi: 0,
        disposableIncome: Math.max(0, incomeNum - existingEmiNum),
        existingEmi: existingEmiNum,
      };
    }

    const monthlyInterestRate = rateNum / 100 / 12;
    const maxLoanAmount =
      (availableEmiForNewLoan * (1 - Math.pow(1 + monthlyInterestRate, -totalMonths))) /
      monthlyInterestRate;

    return {
      maxLoanAmount: Math.round(maxLoanAmount),
      maxEligibleEmi: Math.round(availableEmiForNewLoan),
      disposableIncome: Math.round(incomeNum - maxAllowableTotalEmi),
      existingEmi: existingEmiNum,
    };
  }, [monthlyIncome, existingEmi, age, tenure, interestRate]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (Number(rawValue) > 100000000) return;
    setMonthlyIncome(rawValue);
  };

  const handleEmiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (Number(rawValue) > 10000000) return;
    setExistingEmi(rawValue);
  };

  const chartData: ChartDataItem[] = useMemo(() => [
    { name: "New Loan EMI Capacity", value: results.maxEligibleEmi, fill: "#06b6d4" },
    { name: "Existing EMIs", value: results.existingEmi, fill: "#f59e0b" },
    { name: "Free Disposable Income", value: results.disposableIncome, fill: "#22c55e" },
  ], [results]);

  const totalChartValue = useMemo(
    () => chartData.reduce((acc, curr) => acc + (curr.value > 0 ? curr.value : 0), 0),
    [chartData]
  );

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const maxLoanNum = results.maxLoanAmount;

  return (
    <div id="eligibility-calculator" className="w-full rounded-md border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
        
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0 rounded-full bg-gray-100 p-2.5 sm:p-3">
              <CiWallet className="text-2xl sm:text-3xl md:text-4xl text-[#002B5B]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold leading-tight">Home Loan Eligibility Calculator</h1>
              <p className="text-gray-500 text-xs sm:text-sm">Check your maximum loan limit instantly</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#002B5B] p-4 sm:p-5 md:p-6 text-center text-white">
            <p className="text-xs sm:text-sm uppercase tracking-wide opacity-80">Maximum Loan Limit</p>
            <h2 className="mt-2 text-xl md:text-4xl font-bold break-words leading-tight">
              ₹ {maxLoanNum.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="rounded-full bg-cyan-600 p-3 text-white">
                <FaHome className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Looking for properties?</p>
                <p className="text-xs text-gray-600">Explore homes matching your budget up to ₹ {maxLoanNum.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <Link
              href={`/search?maxPrice=${maxLoanNum}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#002B5B] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-opacity-90 shrink-0"
            >
              <span>View Properties</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <label htmlFor="net-monthly-salary" className="mb-2 block text-center text-xs font-medium text-gray-600">Net Monthly Salary</label>
              <input
                id="net-monthly-salary"
                name="netMonthlySalary"
                aria-label="Net Monthly Salary in Rupees"
                type="text"
                value={"₹ " + (monthlyIncome ? Number(monthlyIncome).toLocaleString("en-IN") : "0")}
                onChange={handleIncomeChange}
                className="w-full bg-transparent text-center text-lg md:text-2xl font-bold text-[#002B5B] focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <label htmlFor="existing-monthly-emis-input" className="mb-2 block text-center text-xs font-medium text-gray-600">Existing Monthly EMIs</label>
              <input
                id="existing-monthly-emis-input"
                name="existingMonthlyEmis"
                aria-label="Existing Monthly EMIs in Rupees"
                type="text"
                value={"₹ " + (existingEmi ? Number(existingEmi).toLocaleString("en-IN") : "0")}
                onChange={handleEmiChange}
                className="w-full bg-transparent text-center text-lg md:text-2xl font-bold text-[#002B5B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="user-age-slider" className="text-xs sm:text-sm font-semibold text-gray-700">Your Age</label>
                <span className="text-xs sm:text-sm font-semibold">{age} Yrs</span>
              </div>
              <input
                id="user-age-slider"
                name="userAge"
                aria-label="Your Age slider"
                type="range"
                min="21"
                max="58"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="loan-tenure-slider" className="text-xs sm:text-sm font-semibold text-gray-700">Loan Tenure</label>
                <span className="text-xs sm:text-sm font-semibold">{tenure} Yrs</span>
              </div>
              <input
                id="loan-tenure-slider"
                name="loanTenure"
                aria-label="Loan Tenure slider in years"
                type="range"
                min="1"
                max={Math.max(1, 60 - parseInt(age || "30"))}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="interest-rate-slider" className="text-xs sm:text-sm font-semibold text-gray-700">Interest Rate (%)</label>
                <span className="text-xs sm:text-sm font-semibold">{interestRate}%</span>
              </div>
              <input
                id="interest-rate-slider"
                name="interestRate"
                aria-label="Interest Rate Percentage slider"
                type="range"
                min="6"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-base sm:text-lg font-semibold">Eligibility Breakdown</p>
            <p className="text-gray-500 text-xs sm:text-sm">Based on 50% FOIR banking norms</p>
          </div>

          <div className="relative flex flex-col items-center gap-5">
            {/* Zero-Overhead High-Performance SVG Donut Chart */}
            <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="13"
                />

                {/* Data Segments */}
                {totalChartValue > 0 && chartData.map((item, index) => {
                  if (item.value <= 0) return null;
                  const segmentLength = (item.value / totalChartValue) * circumference;
                  const gap = chartData.filter(d => d.value > 0).length > 1 ? 2 : 0;
                  const dashLength = Math.max(0, segmentLength - gap);
                  const dashArray = `${dashLength} ${circumference - dashLength}`;
                  const dashOffset = -cumulativeOffset;
                  cumulativeOffset += segmentLength;

                  const isHovered = hoveredIndex === index;

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={item.fill}
                      strokeWidth={isHovered ? 15 : 13}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="cursor-pointer transition-all duration-200"
                    />
                  );
                })}
              </svg>

              {/* Center Metric */}
              <div className="absolute text-center pointer-events-none">
                {hoveredIndex !== null && chartData[hoveredIndex] ? (
                  <>
                    <p className="text-[11px] font-medium text-gray-500 truncate max-w-[130px]">
                      {chartData[hoveredIndex].name}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-gray-900">
                      ₹ {chartData[hoveredIndex].value.toLocaleString("en-IN")}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-400">Max New EMI</p>
                    <p className="text-base sm:text-xl font-bold text-black">
                      ₹ {results.maxEligibleEmi.toLocaleString("en-IN")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="w-full space-y-3">
              <SummaryCard label="Max New EMI Allowed" value={results.maxEligibleEmi} dotClass="bg-cyan-500" />
              <SummaryCard label="Existing Loan Obligations" value={results.existingEmi} dotClass="bg-amber-500" />
              <SummaryCard label="Living Expenses Margin" value={results.disposableIncome} dotClass="bg-green-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}