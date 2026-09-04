"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { BsBuildingFillGear } from "react-icons/bs";
import { PiBuildingApartment } from "react-icons/pi";
import { SlLocationPin } from "react-icons/sl";
import { fetchSuggestionsAction } from "@/src/components/SearchBar/search.actions"; // Adjust import path if needed
import { useCityStore } from "@/src/stores/city.store";
import { StepOneData, ReviewTargetEntity } from "@/src/types";

interface StepOneProps {
  onNext: (data: StepOneData) => void;
  initialData?: StepOneData | null;
}

const ROLES = ["Owner", "Tenant", "Former Resident", "Real Estate Agent"];

export default function StepOne({ onNext, initialData }: StepOneProps) {
  const { activeCity } = useCityStore();
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedTarget, setSelectedTarget] = useState<ReviewTargetEntity | null>(
    initialData
      ? {
          id: initialData.typeId,
          name: initialData.locationName,
          type: initialData.type as ReviewTargetEntity["type"],
        }
      : null
  );

  const [searchQuery, setSearchQuery] = useState(initialData?.locationName || "");
  const [suggestions, setSuggestions] = useState<{
    projects: any[];
    locations: any[];
  }>({ projects: [], locations: [] });
  const [isOpen, setIsOpen] = useState(false);

  const [userRole, setUserRole] = useState(initialData?.userRole || "");
  const [userName, setUserName] = useState(initialData?.userName || "");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API search matching SearchBarClient logic
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim() || selectedTarget?.name === searchQuery) {
      setSuggestions({ projects: [], locations: []});
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const res = await fetchSuggestionsAction(searchQuery, activeCity?.id);
        if (res) {
          setSuggestions(res);
          setIsOpen(true);
        }
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, activeCity?.id, selectedTarget]);

  // Flatten API results across types
  const flatSuggestions = [
    ...(suggestions.projects || []).map((p) => ({
      type: "project" as const,
      id: p.id,
      name: p.name,
      icon: <PiBuildingApartment className="text-[#002B5B] text-lg" />,
    })),
    ...(suggestions.locations || []).map((l) => ({
      type: "location" as const,
      id: l.id,
      name: l.name,
      icon: <SlLocationPin className="text-emerald-600 text-lg" />,
    })),
  ];

  const handleSelectEntity = (item: { id: string; name: string; type: "project" | "location" | "builder" }) => {
    setSelectedTarget({
      id: item.id,
      name: item.name,
      type: item.type === "builder" ? "project" : item.type,
    });
    setSearchQuery(item.name);
    setIsOpen(false);
  };

  const handleProceed = () => {
    if (!selectedTarget || !userRole || !userName.trim()) return;

    onNext({
      type: selectedTarget.type,
      typeId: selectedTarget.id,
      locationName: selectedTarget.name,
      userRole,
      userName: userName.trim(),
    });
  };

  return (
    <div className="bg-white  p-7 md:p-10 rounded-2xl border border-gray-100 shadow-md w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#002B5B] tracking-tight">
          Write a Review
        </h2>
        <p className="text-base text-gray-500 font-medium mt-1.5">
          Review your society/locality & help others make the right decision.
        </p>
      </div>

      {/* Autocomplete Search Bar */}
      <div className="mb-8 relative" ref={containerRef}>
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-2.5">
          ADD LOCATION / PROJECT <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Search projects, locations, or developers..."
          value={searchQuery}
          onFocus={() => flatSuggestions.length > 0 && setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedTarget(null);
          }}
          className={`w-full px-5 py-3.5 rounded-xl border text-base transition-all focus:outline-none ${
            selectedTarget
              ? "border-emerald-500 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900"
              : "border-gray-200 focus:ring-2 focus:ring-[#002B5B] focus:border-[#002B5B] text-gray-800"
          }`}
        />

        {selectedTarget && (
          <p className="text-sm text-emerald-700 font-semibold mt-2 flex items-center gap-1.5">
            ✓ Selected {selectedTarget.type}: <strong>{selectedTarget.name}</strong>
          </p>
        )}

        {/* Dropdown Menu */}
        {isOpen && flatSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-gray-100">
            {flatSuggestions.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => handleSelectEntity(item)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-base hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-semibold text-gray-800">{item.name}</span>
                <span className="flex items-center gap-2 text-gray-600 capitalize bg-slate-100 px-3 py-1 rounded-lg text-xs font-semibold">
                  {item.icon} {item.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role Selection */}
      <div className="mb-8">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
          YOU'RE BEST DESCRIBED AS... <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {ROLES.map((role) => {
            const isSelected = userRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setUserRole(role)}
                className={`px-6 py-3 rounded-xl text-base font-bold transition-all border flex items-center justify-center ${
                  isSelected
                    ? "bg-[#002B5B] text-white border-[#002B5B] shadow-md"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Identity Inputs */}
      <div className="mb-10">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-2.5">
          YOUR NAME
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-[#002B5B] text-base font-semibold text-gray-900 transition-all"
        />
      </div>

      <button
        type="button"
        disabled={!selectedTarget || !userRole || !userName.trim()}
        onClick={handleProceed}
        className="w-full py-4 bg-[#002B5B] hover:bg-[#001f42] disabled:bg-gray-200 disabled:text-gray-400 text-white text-lg font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        <span>Proceed to write review</span>
        <span className="text-xl">→</span>
      </button>
    </div>
  );
}