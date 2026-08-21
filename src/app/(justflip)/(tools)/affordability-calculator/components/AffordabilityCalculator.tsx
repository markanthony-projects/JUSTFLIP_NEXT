'use client';

import React, { useState, useMemo } from 'react';

interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  remainingBalance: number;
}

export default function AffordabilityCalculator() {
  // Input States in INR (₹)
  const [income, setIncome] = useState<number>(150000);
  const [debts, setDebts] = useState<number>(20000);
  const [downPayment, setDownPayment] = useState<number>(2200000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20); // Default to 20 Years

  // Standard Pill Options for Loan Duration
  const tenureOptions = [5, 10, 15, 20, 25, 30];

  // Helper for Indian Currency Formatting
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Real-time Calculations
  const calculationResults = useMemo(() => {
    const foirRatio = 0.50;
    const maxEMI = (income * foirRatio) - debts;

    if (maxEMI <= 0 || interestRate <= 0 || tenureYears <= 0) {
      return { totalBudget: 0, maxLoan: 0, maxEMI: 0, schedule: [] };
    }

    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    // Max Borrowing Capacity Formula
    const maxLoan =
      maxEMI *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)));

    const totalBudget = maxLoan + downPayment;

    // Yearly Amortization Schedule
    let balance = maxLoan;
    const schedule: AmortizationYear[] = [];
    let annualInterest = 0;
    let annualPrincipal = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interest = balance * monthlyRate;
      let principal = maxEMI - interest;

      if (balance < principal) principal = balance;

      balance -= principal;
      if (balance < 0) balance = 0;

      annualInterest += interest;
      annualPrincipal += principal;

      if (m % 12 === 0 || m === totalMonths) {
        schedule.push({
          year: Math.ceil(m / 12),
          principalPaid: Math.round(annualPrincipal),
          interestPaid: Math.round(annualInterest),
          totalPayment: Math.round(annualPrincipal + annualInterest),
          remainingBalance: Math.round(balance),
        });
        annualInterest = 0;
        annualPrincipal = 0;
      }
    }

    return {
      totalBudget: Math.round(totalBudget),
      maxLoan: Math.round(maxLoan),
      maxEMI: Math.round(maxEMI),
      schedule,
    };
  }, [income, debts, downPayment, interestRate, tenureYears]);

  return (
    <div className="max-w-6xl mx-auto px: 0 sm:p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="p-6 bg-white rounded-xl shadow-md space-y-5 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Check Your Home Purchasing Power</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Monthly Income (₹)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Existing Monthly EMIs / Debts (₹)</label>
            <input
              type="number"
              value={debts}
              onChange={(e) => setDebts(Number(e.target.value))}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Down Payment Savings Available (₹)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Option 1: Interactive Tenure Pill-Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Tenure (Years)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {tenureOptions.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all border ${
                    tenureYears === yr
                      ? 'bg-[#002B5B] text-white border-[#002B5B] shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Result Card */}
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold text-[#002B5B] uppercase tracking-wide">Maximum Affordable Home Loan</p>
            <h1 className="text-4xl font-extrabold text-[#002B5B] mt-2">
              {formatINR(calculationResults.maxLoan)}
            </h1>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span>Down Payment:</span>
                <span className="font-semibold">{formatINR(downPayment)}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span>Estimated Property Cost:</span>
                <span className="font-semibold">{formatINR(calculationResults.totalBudget)}</span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span>Monthly EMI:</span>
                <span className="font-semibold">{formatINR(calculationResults.maxEMI)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={`/stamp-duty?amount=${calculationResults.totalBudget}`}
              className="block w-full text-center bg-[#002B5B] hover:bg-[#002B5B] text-white font-semibold py-3 rounded-lg transition"
            >
              Calculate Stamp Duty For This Budget
            </a>
          </div>
        </div>
      </div>

      {/* Repayment Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Yearly Loan Repayment Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-medium border-b">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3">Principal Paid</th>
                <th className="p-3">Interest Paid</th>
                <th className="p-3">Total Payment</th>
                <th className="p-3">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calculationResults.schedule.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">Year {row.year}</td>
                  <td className="p-3 text-green-600">{formatINR(row.principalPaid)}</td>
                  <td className="p-3 text-red-500">{formatINR(row.interestPaid)}</td>
                  <td className="p-3">{formatINR(row.totalPayment)}</td>
                  <td className="p-3">{formatINR(row.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}