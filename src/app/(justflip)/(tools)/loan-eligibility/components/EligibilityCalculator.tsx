"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { CiWallet } from "react-icons/ci";
import SummaryCard from "./SummaryCard";
import CustomTooltip from "./CustomTooltip";

export default function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("100000");
  const [existingEmi, setExistingEmi] = useState("10000");
  const [age, setAge] = useState("30");
  const [tenure, setTenure] = useState("20");
  const [interestRate, setInterestRate] = useState("8.5");

  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateEligibility();
  }, [monthlyIncome, existingEmi, age, tenure, interestRate]);

  const calculateEligibility = () => {
    const incomeNum = parseFloat(monthlyIncome) || 0;
    const existingEmiNum = parseFloat(existingEmi) || 0;
    const ageNum = parseInt(age) || 30;
    let tenureNum = parseInt(tenure) || 20;
    const rateNum = parseFloat(interestRate) || 8.5;

    const maxAllowedTenure = Math.max(1, Math.min(tenureNum, 60 - ageNum));
    const totalMonths = maxAllowedTenure * 12;

    const maxAllowableTotalEmi = incomeNum * 0.50;
    const availableEmiForNewLoan = maxAllowableTotalEmi - existingEmiNum;

    if (availableEmiForNewLoan <= 0 || incomeNum <= 0) {
      setResults({
        maxLoanAmount: "0",
        maxEligibleEmi: "0",
        disposableIncome: Math.max(0, incomeNum - existingEmiNum).toFixed(0),
        existingEmi: existingEmiNum.toFixed(0),
      });
      return;
    }

    const monthlyInterestRate = rateNum / 100 / 12;

    const maxLoanAmount =
      (availableEmiForNewLoan * (1 - Math.pow(1 + monthlyInterestRate, -totalMonths))) /
      monthlyInterestRate;

    setResults({
      maxLoanAmount: Math.round(maxLoanAmount).toString(),
      maxEligibleEmi: Math.round(availableEmiForNewLoan).toString(),
      disposableIncome: Math.round(incomeNum - maxAllowableTotalEmi).toString(),
      existingEmi: existingEmiNum.toString(),
    });
  };

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

  const chartData = [
    { name: "New Loan EMI Capacity", value: Number(results?.maxEligibleEmi || 0), fill: "#06b6d4" },
    { name: "Existing EMIs", value: Number(results?.existingEmi || 0), fill: "#f59e0b" },
    { name: "Free Disposable Income", value: Number(results?.disposableIncome || 0), fill: "#22c55e" },
  ];

  return (
    <div id="eligibility-calculator" className="w-full rounded-md border border-gray-200 bg-white p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
        
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0 rounded-full bg-gray-100 p-2.5 sm:p-3">
              <CiWallet className="text-2xl sm:text-3xl md:text-4xl text-[#002B5B]" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold leading-tight">Home Loan Eligibility Calculator</p>
              <p className="text-gray-500 text-xs sm:text-sm">Check your maximum loan limit instantly</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#002B5B] p-4 sm:p-5 md:p-6 text-center text-white">
            <p className="text-xs sm:text-sm uppercase tracking-wide opacity-80">Maximum Loan Limit</p>
            <h2 className="mt-2 text-xl md:text-4xl font-bold break-words leading-tight">
              ₹ {Number(results?.maxLoanAmount || 0).toLocaleString("en-IN")}
            </h2>
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
            <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius="76%"
                    outerRadius="100%"
                    dataKey="value"
                    stroke="none"
                    paddingAngle={2}
                    cornerRadius={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute text-center">
                <p className="text-[11px] text-gray-400">Max New EMI</p>
                <p className="text-base sm:text-xl font-bold text-black">
                  ₹ {Number(results?.maxEligibleEmi || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <SummaryCard label="Max New EMI Allowed" value={results?.maxEligibleEmi} dotClass="bg-cyan-500" />
              <SummaryCard label="Existing Loan Obligations" value={results?.existingEmi} dotClass="bg-amber-500" />
              <SummaryCard label="Living Expenses Margin" value={results?.disposableIncome} dotClass="bg-green-500" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}