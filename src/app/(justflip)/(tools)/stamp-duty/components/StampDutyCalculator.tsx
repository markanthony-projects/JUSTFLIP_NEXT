'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import rawStampDutyData from '../data.json';
import {
  StampDutyDataSet,
  BuyerGender,
  LocationType,
  StateConfig
} from '@/src/types/stampDuty';

const stampDutyData = rawStampDutyData as StampDutyDataSet;

const PRESET_VALUES = [
  { label: '₹25L', value: 2500000 },
  { label: '₹50L', value: 5000000 },
  { label: '₹75L', value: 7500000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr', value: 20000000 },
];

function convertToIndianWords(num: number): string {
  if (!num || num <= 0) return 'Zero';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWordsLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return units[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + units[n % 10] + ' ';
    return units[Math.floor(n / 100)] + ' Hundred ' + numToWordsLessThanThousand(n % 100);
  };

  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let remainder = num % 1000;

  let result = '';
  if (crore > 0) result += numToWordsLessThanThousand(crore).trim() + ' Crore ';
  if (lakh > 0) result += numToWordsLessThanThousand(lakh).trim() + ' Lakh ';
  if (thousand > 0) result += numToWordsLessThanThousand(thousand).trim() + ' Thousand ';
  if (remainder > 0) result += numToWordsLessThanThousand(remainder).trim();

  return result.trim();
}

// Clean, distinct vector icons for Male, Female, and Joint options
const MaleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="10" cy="14" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
  </svg>
);

const FemaleIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="9" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7M9 18h6" />
  </svg>
);

const JointIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export default function StampDutyCalculator(): React.JSX.Element {
  const [selectedState, setSelectedState] = useState<string>('Gujarat');
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [gender, setGender] = useState<BuyerGender>('male');
  const [locationType] = useState<LocationType>('urban');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentConfig: StateConfig | undefined = stampDutyData[selectedState];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRateForGender = (g: BuyerGender): number => {
    if (!currentConfig) return 0;
    let stampDutyRate = 0;
    let cessRate = 0;

    if (currentConfig.has_slabs && currentConfig.slabs) {
      const slab = currentConfig.slabs.find((s) => {
        const minOk = s.min_value !== undefined ? propertyValue >= s.min_value : true;
        const maxOk = s.max_value !== undefined ? propertyValue <= s.max_value : true;
        return minOk && maxOk;
      });
      stampDutyRate = slab?.rates[g] ?? 5.0;
    } else if (currentConfig.has_location_type && currentConfig.locations) {
      const loc = currentConfig.locations[locationType] || currentConfig.locations.urban;
      stampDutyRate = loc?.rates[g] ?? 5.0;
      cessRate = loc?.cess_percent || 0;
    } else if (currentConfig.rates) {
      stampDutyRate = currentConfig.rates[g] ?? 5.0;
      cessRate = currentConfig.cess_percent || 0;
    }

    return stampDutyRate + cessRate;
  };

  const genderBreakdown = useMemo(() => {
    if (!currentConfig) return [];

    const categories: { key: BuyerGender; label: string; icon: React.ReactNode }[] = [
      { key: 'male', label: 'Male', icon: <MaleIcon /> },
      { key: 'female', label: 'Female', icon: <FemaleIcon /> },
      { key: 'joint_mf', label: 'Joint', icon: <JointIcon /> },
    ];

    return categories.map((cat) => {
      const rate = getRateForGender(cat.key);
      const amount = (propertyValue * rate) / 100;
      const isActive = currentConfig.has_gender_discount
        ? cat.key === gender || (gender.startsWith('joint') && cat.key === 'joint_mf')
        : true;

      return { ...cat, rate, amount, isActive };
    });
  }, [currentConfig, propertyValue, gender, locationType]);

  const activeRate = useMemo(() => {
    if (!currentConfig) return 0;
    const effectiveGender = currentConfig.has_gender_discount ? gender : 'male';
    return getRateForGender(effectiveGender);
  }, [currentConfig, gender, propertyValue, locationType]);

  const totalCalculatedDuty = (propertyValue * activeRate) / 100;

  if (!currentConfig) return <div className="p-4 text-slate-700">State configuration not found.</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        
        {/* Left Form Controls Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#002B49]/10 text-[#002B49] rounded-xl border border-[#002B49]/15">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#002B49]">Stamp Duty Calculator</h2>
                <p className="text-xs font-medium text-slate-500">Calculate payable duty by state</p>
              </div>
            </div>

            {/* Custom State Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#002B49] mb-2">
                State
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#002B49] font-bold flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#002B49]/20 focus:border-[#002B49] transition cursor-pointer"
                >
                  <span>{selectedState}</span>
                  <svg
                    className={`w-4 h-4 text-[#002B49]/60 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[105%] z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
                    {Object.keys(stampDutyData).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setSelectedState(st);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                          selectedState === st
                            ? 'bg-blue-50 text-[#002B49] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{st}</span>
                        {selectedState === st && (
                          <span className="text-[#002B49] font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gender / Ownership Selector */}
            {currentConfig.has_gender_discount && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002B49] mb-2">
                  Gender / Ownership
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition ${
                      gender === 'male'
                        ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm'
                        : 'bg-white text-[#002B49] border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <MaleIcon />
                    <span>Male</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition ${
                      gender === 'female'
                        ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm'
                        : 'bg-white text-[#002B49] border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <FemaleIcon />
                    <span>Female</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('joint_mf')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition ${
                      gender.startsWith('joint')
                        ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm'
                        : 'bg-white text-[#002B49] border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <JointIcon />
                    <span>Joint</span>
                  </button>
                </div>
              </div>
            )}

            {/* Property Value Input Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002B49]">
                  Property Value
                </label>
                <span className="text-xs font-bold text-[#002B49]">
                  ₹ {propertyValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#002B49]/20 focus-within:border-[#002B49] bg-slate-50">
                <span className="px-4 py-3 bg-slate-100 text-[#002B49] font-bold border-r border-slate-200">₹</span>
                <input
                  type="number"
                  value={propertyValue || ''}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full p-3 bg-transparent text-[#002B49] font-bold focus:outline-none"
                />
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1.5">
                {convertToIndianWords(propertyValue)}
              </p>

              {/* Slider */}
              <input
                type="range"
                min="500000"
                max="50000000"
                step="100000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full mt-4 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002B49]"
              />

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick:</span>
                {PRESET_VALUES.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPropertyValue(preset.value)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                      propertyValue === preset.value
                        ? 'bg-[#002B49] text-white border-[#002B49]'
                        : 'bg-slate-50 text-[#002B49] border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-[#002B49] flex items-start gap-3">
            <span className="text-base mt-0.5">ℹ️</span>
            <p className="text-xs font-medium leading-relaxed text-[#002B49]/80">
              Registration charges (typically <strong className="text-[#002B49]">1%</strong> of property value) are extra and applicable at property registration.
            </p>
          </div>

        </div>

        {/* Right Output Panel */}
        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200">
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-[#002B49] uppercase tracking-wider">
              Stamp Duty Breakdown
            </h3>

            {/* Total Duty Banner */}
            <div className="bg-[#002B49] text-white p-6 rounded-2xl shadow-md space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Total Stamp Duty
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ₹{totalCalculatedDuty.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Applied Rate Card */}
            <div className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-sm text-sm">
              <span className="text-[#002B49] font-medium">Applied Rate</span>
              <span className="font-extrabold text-[#002B49]">{activeRate}%</span>
            </div>

            {/* State Rates Comparison */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  State Rates Comparison
                </span>
                {!currentConfig.has_gender_discount && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Uniform Rate
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {genderBreakdown.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition border ${
                      item.isActive
                        ? 'bg-blue-50/70 border-blue-200 font-bold text-[#002B49]'
                        : 'bg-white border-slate-200/70 text-[#002B49] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-[#002B49]">{item.rate}%</span>
                      <span className="block text-[10px] text-slate-500 font-semibold">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-[11px] text-center text-slate-400 font-medium leading-relaxed">
              *Rates are subject to dynamic state government regulations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}