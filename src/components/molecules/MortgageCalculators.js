"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CiCalculator1 } from "react-icons/ci";

function SummaryCard({ label, value, dotClass, borderClass = "border-gray-200" }) {
    return (
        <div className={`flex items-center justify-between rounded-xl border ${borderClass} bg-white p-3 sm:p-4 shadow-sm`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0 ${dotClass}`} />

                <span className="truncate text-xs sm:text-sm font-medium text-gray-600">
                    {label}
                </span>
            </div>

            <span className="ml-3 text-xs sm:text-sm md:text-base font-semibold text-gray-900 break-all text-right">
                ₹ {Number(value || 0).toLocaleString("en-IN")}
            </span>
        </div>
    );
}

export default function MortgageCalculator() {

    const [loanAmount, setLoanAmount] = useState("1000000");
    const [years, setYears] = useState("5");
    const [months, setMonths] = useState("5");
    const [interestRate, setInterestRate] = useState("8");

    const [results, setResults] = useState(null);



    useEffect(() => {
        calculateMortgage();
    }, [loanAmount, years, months, interestRate]);

    const calculateMortgage = () => {

        const loanAmountNum = parseFloat(loanAmount) || 0;
        const yearsNum = parseInt(years) || 0;
        const monthsNum = parseInt(months) || 0;
        const interestRateNum = parseFloat(interestRate) || 0;

        const totalMonths = yearsNum * 12 + monthsNum;

        if (loanAmountNum <= 0 || totalMonths <= 0) {

            setResults({
                monthlyPayment: "",
                totalPrincipal: "",
                totalInterest: "",
                totalPayment: ""
            });

            return;

        }

        const monthlyInterestRate = interestRateNum / 100 / 12;

        let monthlyPayment = 0;

        if (monthlyInterestRate === 0) {

            monthlyPayment = loanAmountNum / totalMonths;

        } else {

            monthlyPayment =
                (loanAmountNum * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -totalMonths));

        }

        const totalPayment = monthlyPayment * totalMonths;
        const totalInterest = totalPayment - loanAmountNum;

        setResults({
            monthlyPayment: monthlyPayment.toFixed(2),
            totalPrincipal: loanAmountNum.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            totalPayment: totalPayment.toFixed(2)
        });

    };

    const handleAmountChange = (e) => {

        const rawValue =
            e.target.value.replace(/\D/g, "");

        if (rawValue > 1000000000) return;

        setLoanAmount(rawValue);

    };



    return (
        <div className="w-full rounded-md border border-gray-200 bg-white p-3 sm:p-4 md:p-6">

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 lg:gap-8">

                {/* LEFT */}

                <div className="space-y-4 sm:space-y-5">

                    {/* HEADER */}

                    <div className="flex items-center gap-3 sm:gap-4">

                        <div className="shrink-0 rounded-full bg-gray-100 p-2.5 sm:p-3">
                            <CiCalculator1 className="text-2xl sm:text-3xl md:text-4xl text-[#002B5B]" />
                        </div>

                        <div>
                            <p className="text-base sm:text-lg font-semibold leading-tight">
                                Mortgage Calculator
                            </p>

                            <p className="text-gray-500 text-xs sm:text-sm">
                                Instantly calculate your EMI
                            </p>
                        </div>

                    </div>

                    {/* EMI HERO */}

                    <div className="rounded-2xl bg-[#002B5B] p-4 sm:p-5 md:p-6 text-center text-white">

                        <p className="text-xs sm:text-sm uppercase tracking-wide opacity-80">
                            Monthly EMI
                        </p>

                        <h2 className="mt-2 text-xl md:text-4xl font-bold break-words leading-tight">
                            ₹ {Number(results?.monthlyPayment || 0).toLocaleString("en-IN")}
                        </h2>

                    </div>

                    {/* LOAN INPUT */}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">

                        <label className="mb-3 block text-center text-xs sm:text-sm font-medium text-gray-600">
                            Loan Amount
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={
                                "₹ " +
                                (
                                    loanAmount
                                        ? Number(loanAmount).toLocaleString("en-IN")
                                        : 0
                                )
                            }
                            onChange={handleAmountChange}
                            placeholder="0"
                            aria-label="Loan amount"
                            className="w-full bg-transparent text-center text-xl md:text-4xl font-bold text-[#002B5B] focus:outline-none"
                        />

                    </div>

                    {/* CONTROLS */}

                    <div className="space-y-4 sm:space-y-5">

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                    Loan Tenure Years
                                </label>

                                <span className="text-xs sm:text-sm font-semibold">
                                    {years} Yrs
                                </span>

                            </div>

                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={years}
                                onChange={(e) => setYears(+e.target.value)}
                                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
                            />

                            <div className="mt-1 flex justify-between text-[11px] sm:text-xs text-gray-500">
                                <span>1 Yr</span>
                                <span>30 Yrs</span>
                            </div>

                        </div>

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                    Loan Tenure Months
                                </label>

                                <span className="text-xs sm:text-sm font-semibold">
                                    {months} Months
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="11"
                                value={months}
                                onChange={(e) => setMonths(+e.target.value)}
                                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
                            />

                            <div className="mt-1 flex justify-between text-[11px] sm:text-xs text-gray-500">
                                <span>0</span>
                                <span>11</span>
                            </div>

                        </div>

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                    Interest Rate (%)
                                </label>

                                <span className="text-xs sm:text-sm font-semibold">
                                    {interestRate}%
                                </span>

                            </div>

                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={interestRate}
                                onChange={(e) => setInterestRate(+e.target.value)}
                                className="h-2 w-full cursor-pointer accent-[#0d4d96]"
                            />

                            <div className="mt-1 flex justify-between text-[11px] sm:text-xs text-gray-500">
                                <span>1%</span>
                                <span>30%</span>
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-4 sm:space-y-5">

                    <div>

                        <p className="text-base sm:text-lg font-semibold">
                            Loan Summary
                        </p>

                        <p className="text-gray-500 text-xs sm:text-sm">
                            Based on your selected loan amount and tenure
                        </p>

                    </div>

                    {/* CHART + SUMMARY */}

                    <div className="relative flex flex-col items-center gap-5 sm:gap-6">

                        {/* CHART */}

                        <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] flex items-center justify-center">

                            <div className="absolute h-36 w-36 sm:h-44 sm:w-44 md:h-56 md:w-56 rounded-full blur-3xl opacity-20 bg-cyan-400" />

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#1e3a8a" />
                                        </linearGradient>
                                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={
                                                interestRate <= 5 ? "#22c55e" : interestRate <= 12 ? "#f59e0b" : "#ef4444"
                                            } />
                                            <stop offset="100%" stopColor={
                                                interestRate <= 5 ? "#16a34a" : interestRate <= 12 ? "#ea580c" : "#b91c1c"
                                            } />
                                        </linearGradient>
                                    </defs>
                                    <Pie
                                        data={[
                                            { name: "Principal", value: Number(results?.totalPrincipal || 0) },
                                            { name: "Interest", value: Number(results?.totalInterest || 0) }
                                        ]}
                                        innerRadius="76%"
                                        outerRadius="100%"
                                        dataKey="value"
                                        stroke="none"
                                        paddingAngle={2}
                                        cornerRadius={12}
                                    >
                                        <Cell fill="url(#colorPrincipal)" />
                                        <Cell fill="url(#colorInterest)" />
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff" }}
                                        itemStyle={{ color: "#fff" }}
                                        formatter={(value, name) => [`₹ ${Number(value).toLocaleString("en-IN")}`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute px-4 text-center">

                                <p className="text-[11px] sm:text-xs text-gray-400">
                                    Monthly EMI
                                </p>

                                <p className="text-base sm:text-xl md:text-2xl font-bold text-black drop-shadow-lg break-words">
                                    ₹ {Number(results?.monthlyPayment || 0).toLocaleString("en-IN")}
                                </p>

                            </div>

                        </div>

                        {/* SUMMARY */}

                        <div className="relative w-full space-y-3 sm:space-y-4">

                            <SummaryCard
                                label="Principal"
                                value={results?.totalPrincipal}
                                dotClass="bg-cyan-500"
                            />

                            <SummaryCard
                                label="Interest"
                                value={results?.totalInterest}
                                dotClass={
                                    interestRate <= 5
                                        ? "bg-green-500"
                                        : interestRate <= 12
                                            ? "bg-orange-500"
                                            : "bg-red-500"
                                }
                                borderClass={
                                    interestRate <= 5
                                        ? "border-green-200"
                                        : interestRate <= 12
                                            ? "border-orange-200"
                                            : "border-red-200"
                                }
                            />

                            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">

                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                    Total Payment
                                </span>

                                <span className="text-xs sm:text-sm md:text-base font-bold text-[#002B5B] break-all text-right">
                                    ₹ {Number(results?.totalPayment || 0).toLocaleString("en-IN")}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );

}