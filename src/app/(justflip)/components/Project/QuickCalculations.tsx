"use client";

import { useState, useEffect } from 'react';
import { FiArrowRight, FiX, FiHome } from 'react-icons/fi';
import { CiCalculator1 } from 'react-icons/ci';
import { HiOutlineReceiptPercent } from 'react-icons/hi2';

import StampDutyCalculator from '@/src/app/(justflip)/(tools)/stamp-duty/components/StampDutyCalculator';
import { convertToIndianWords } from '@/src/app/(justflip)/(tools)/stamp-duty/components/useStampDutyCalculator';

interface SummaryCardProps {
    label: string;
    value: string | number | undefined;
    dotClass: string;
    borderClass?: string;
}

function SummaryCard({ label, value, dotClass, borderClass = "border-gray-200" }: SummaryCardProps) {
    return (
        <div className={`flex items-center justify-between rounded-xl border ${borderClass} bg-white p-3 sm:p-4 shadow-xs`}>
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

interface QuickCalculationsProps {
  project?: {
    name?: string;
    city?:{
      id?:string;
      name?:string;
      region?:string;
    }
    units?: Array<{
      minPrice?: number | string;
    }>;
  };
  onViewProperties?: (maxBudget: number) => void;
}

export default function QuickCalculations({ project, onViewProperties }: QuickCalculationsProps) {
  const cityId = project?.city?.id;
  const minPrice = Number(project?.units?.[0]?.minPrice) || 5000000;
  const [activeModal, setActiveModal] = useState<'emi' | 'stamp-duty' | null>(null);

  // Mortgage Calculator State
  const [loanAmount, setLoanAmount] = useState(() => String(minPrice));
  const [years, setYears] = useState("20");
  const [months, setMonths] = useState("5");
  const [interestRate, setInterestRate] = useState("8.5");
  const [results, setResults] = useState<{
    monthlyPayment: string;
    totalPrincipal: string;
    totalInterest: string;
    totalPayment: string;
  } | null>(null);

  useEffect(() => {
    if (minPrice) {
      setLoanAmount(String(minPrice));
    }
  }, [minPrice]);

  useEffect(() => {
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
  }, [loanAmount, years, months, interestRate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (Number(rawValue) > 1000000000) return;
    setLoanAmount(rawValue);
  };

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-xl shadow-slate-100 transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#002B5B] tracking-tight">
              Financial & Tax Estimator
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quick calculations for <span className="font-semibold text-slate-700">{project?.name || 'Property'}</span>
            </p>
          </div>

          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#002B5B]/5 text-[#002B5B] border border-[#002B5B]/10 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#002B5B] animate-pulse" />
            Based on Min Price
          </span>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveModal('emi')}
            className="group relative flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-[#002B5B] hover:bg-[#002B5B]/[0.02] hover:shadow-md transition-all text-left w-full cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-blue-50 text-[#002B5B] group-hover:bg-[#002B5B] group-hover:text-white transition-colors">
                <CiCalculator1 className="text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#002B5B]">Calculate EMI</h4>
                <p className="text-xs text-slate-500">Monthly loan installments</p>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 group-hover:translate-x-1 group-hover:bg-[#002B5B]/10 group-hover:text-[#002B5B] transition-all">
              <FiArrowRight className="text-sm" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('stamp-duty')}
            className="group relative flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-[#002B5B] hover:bg-[#002B5B]/[0.02] hover:shadow-md transition-all text-left w-full cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-blue-50 text-[#002B5B] group-hover:bg-[#002B5B] group-hover:text-white transition-colors">
                <HiOutlineReceiptPercent className="text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#002B5B]">Stamp Duty</h4>
                <p className="text-xs text-slate-500">Registration & taxes</p>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 group-hover:translate-x-1 group-hover:bg-[#002B5B]/10 group-hover:text-[#002B5B] transition-all">
              <FiArrowRight className="text-sm" />
            </div>
          </button>
        </div>
      </div>

      {/* Modal Layout */}
      {activeModal && (
        <div className="fixed inset-0 h-screen w-screen z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 backdrop-blur-xs">
          <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all duration-300 border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#002B5B]">
                {activeModal === 'emi' ? 'Mortgage / EMI Calculator' : 'Stamp Duty & Registration Calculator'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div>
              {activeModal === 'emi' ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Inputs & Sliders */}
                  <div className="md:col-span-7 space-y-5">
                    <div className="rounded-2xl bg-[#002B5B] p-5 text-center text-white shadow-sm">
                      <p className="text-xs sm:text-sm uppercase tracking-wide opacity-80 font-medium">Monthly EMI</p>
                      <h2 className="mt-1 text-2xl md:text-4xl font-bold">
                        ₹ {Number(results?.monthlyPayment || 0).toLocaleString("en-IN")}
                      </h2>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                      <label className="mb-1 block text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Loan Amount
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={"₹ " + (loanAmount ? Number(loanAmount).toLocaleString("en-IN") : 0)}
                        onChange={handleAmountChange}
                        placeholder="0"
                        className="w-full bg-transparent text-center text-2xl font-bold text-[#002B5B] focus:outline-none"
                      />
                      <p className="text-center text-xs text-gray-400 mt-0.5">
                        {convertToIndianWords(Number(loanAmount))}
                      </p>
                    </div>

                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-700">Loan Tenure Years</span>
                          <span className="text-[#002B5B]">{years} Yrs</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={years}
                          onChange={(e) => setYears(e.target.value)}
                          className="h-2 w-full cursor-pointer accent-[#002B5B]"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-700">Loan Tenure Months</span>
                          <span className="text-[#002B5B]">{months} Months</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="11"
                          value={months}
                          onChange={(e) => setMonths(e.target.value)}
                          className="h-2 w-full cursor-pointer accent-[#002B5B]"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-700">Interest Rate (%)</span>
                          <span className="text-[#002B5B]">{interestRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          className="h-2 w-full cursor-pointer accent-[#002B5B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Summaries & View Properties Option */}
                  <div className="md:col-span-5 space-y-4 flex flex-col justify-between pt-1">
                    <SummaryCard label="Principal" value={results?.totalPrincipal} dotClass="bg-cyan-500" />
                    <SummaryCard label="Interest" value={results?.totalInterest} dotClass="bg-green-500" />
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                      <span className="text-xs font-semibold text-gray-700">Total Payment</span>
                      <span className="text-sm md:text-base font-bold text-[#002B5B]">
                        ₹ {Number(results?.totalPayment || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* View Properties Call-to-Action Box */}
                    <div className="rounded-2xl border border-cyan-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm mt-2">
                        <div className="flex items-center gap-3 text-left">
                            <div className="rounded-full bg-cyan-600 p-2.5 text-white shrink-0">
                                <FiHome className="text-base" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Found your property value?</p>
                                <p className="text-xs text-gray-600 font-medium">Browse listings up to ₹{Number(loanAmount || 0).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                              if (onViewProperties) {
                                onViewProperties(Number(loanAmount));
                              } else {
                                window.open(`/search?cityId=${cityId}&maxPrice=${loanAmount}`, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#002B5B] hover:bg-[#002142] px-4 py-2.5 text-xs font-semibold text-white transition hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer shadow-sm"
                        >
                            <span>View Properties</span>
                            <FiArrowRight className="text-[10px]" />
                        </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="w-full">
                  <StampDutyCalculator initialPrice={minPrice} defaultState={project?.city?.region} cityName={project?.city?.name} cityId={project?.city?.id}/>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}