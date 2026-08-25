'use client';

import React from 'react';
import {
  useStampDutyCalculator,
  convertToIndianWords,
  PRESET_VALUES,
} from './useStampDutyCalculator';

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
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 010 7.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  male: <MaleIcon />,
  female: <FemaleIcon />,
  joint_mf: <JointIcon />,
};

export default function StampDutyCalculator(): React.JSX.Element {
  const {
    selectedState,
    setSelectedState,
    propertyValue,
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleKeyDown,
    updatePropertyValue,
    gender,
    setGender,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    currentConfig,
    genderBreakdown,
    activeRate,
    totalCalculatedDuty,
    availableStates,
    MIN_PROPERTY_VALUE,
    MAX_PROPERTY_VALUE,
  } = useStampDutyCalculator();

  if (!currentConfig) return <div className="p-4 text-slate-700">State configuration not found.</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        
        {/* Left Form Controls Panel */}
        <div className="md:col-span-7 px-0 p-6 sm:p-8 flex flex-col justify-between space-y-6 order-2 lg:order-1">
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
                    {availableStates.map((st) => (
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
                <label htmlFor="property-value-input" className="block text-xs font-bold uppercase tracking-wider text-[#002B49]">
                  Property Value
                </label>
                <span className="text-xs font-bold text-[#002B49]">
                  ₹ {propertyValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#002B49]/20 focus-within:border-[#002B49] bg-slate-50">
                <span className="px-4 py-3 bg-slate-100 text-[#002B49] font-bold border-r border-slate-200">₹</span>
                <input
                  id="property-value-input"
                  name="propertyValue"
                  aria-label="Property Value in Rupees"
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleInputBlur}
                  className="w-full p-3 bg-transparent text-[#002B49] font-bold focus:outline-none"
                />
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1.5">
                {convertToIndianWords(propertyValue)}
              </p>

              {/* Slider */}
              <input
                type="range"
                aria-label="Property value range slider"
                min={MIN_PROPERTY_VALUE}
                max={MAX_PROPERTY_VALUE}
                step="100000"
                value={propertyValue}
                onChange={(e) => updatePropertyValue(Number(e.target.value))}
                className="w-full mt-4 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002B49]"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>₹5 Lakh</span>
                <span>₹50 Crore</span>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick:</span>
                {PRESET_VALUES.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => updatePropertyValue(preset.value)}
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
        <div className="md:col-span-5 px-0 p-6 sm:p-8 flex flex-col justify-between bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 order-1 lg:order-2">
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
                      {CATEGORY_ICONS[item.key]}
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