"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { SlLocationPin } from "react-icons/sl";
import { JUSTFLIP } from "@/src/lib/axios/api";
import { fetchSuggestionsAction } from "@/src/components/SearchBar/search.actions";

export interface City {
  id: string;
  name: string;
}

export interface LocationSuggestion {
  id: string;
  name: string;
}

export interface Step2Data {
  cityId: string;
  cityName: string;
  locationQuery: string;
  locationId?: string;
  bhk: string;
  maxBudget: string;
}

interface Step2Props {
  data: Step2Data;
  onChange: (updated: Partial<Step2Data>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const BHK_OPTIONS = [
  { label: "1 BHK", value: "1BHK", desc: "Cozy & low maintenance" },
  { label: "2 BHK", value: "2BHK", desc: "Most popular choice" },
  { label: "3 BHK", value: "3BHK", desc: "Extra room for family/study" },
  { label: "4+ BHK", value: "4BHK", desc: "Luxurious & spacious" },
];

const BUDGET_OPTIONS = [
  { label: "Up to ₹50 Lakhs", value: "5000000", tag: "Budget-friendly" },
  { label: "₹50 Lakhs - ₹1 Crore", value: "10000000", tag: "Mid-range" },
  { label: "₹1 Crore - ₹2 Crore", value: "20000000", tag: "Premium" },
  { label: "₹2 Crore - ₹5 Crore", value: "50000000", tag: "Luxury" },
  { label: "Above ₹5 Crore", value: "100000000", tag: "Ultra-Luxury" },
];

export default function Step2LocationBudget({
  data,
  onChange,
  onBack,
  onSubmit,
}: Step2Props) {
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await JUSTFLIP.get("/city");
        const citiesList: City[] = response.data?.cities || response.data || [];
        setCities(citiesList);

        if (!data.cityId && citiesList.length > 0) {
          onChange({
            cityId: citiesList[0].id,
            cityName: citiesList[0].name,
          });
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (
      data.locationId ||
      !data.locationQuery.trim() ||
      data.locationQuery === data.cityName
    ) {
      setLocationSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetchSuggestionsAction(data.locationQuery, data.cityId);
          if (res?.locations) {
            const query = data.locationQuery.toLowerCase().trim();

            const sortedLocations = [...res.locations].sort(
              (a: LocationSuggestion, b: LocationSuggestion) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                const aExact = nameA === query;
                const bExact = nameB === query;
                if (aExact && !bExact) return -1;
                if (!aExact && bExact) return 1;

                const aStarts = nameA.startsWith(query);
                const bStarts = nameB.startsWith(query);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                return nameA.localeCompare(nameB);
              }
            );

            setLocationSuggestions(sortedLocations);
            setIsOpen(true);
          } else {
            setLocationSuggestions([]);
          }
        } catch (err) {
          console.error("Failed to fetch location suggestions:", err);
          setLocationSuggestions([]);
        }
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data.locationQuery, data.cityId, data.locationId || ""]);

  const handleCitySelect = (city: City) => {
    onChange({
      cityId: city.id,
      cityName: city.name,
      locationQuery: "",
      locationId: "",
    });
  };

  const handleLocationSelect = (loc: LocationSuggestion) => {
    onChange({
      locationQuery: loc.name,
      locationId: loc.id,
    });
    setIsOpen(false);
  };

  const isFormValid =
    Boolean(data.cityId) &&
    Boolean(data.locationQuery.trim()) &&
    Boolean(data.bhk) &&
    Boolean(data.maxBudget);

  return (
    <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-100 shadow-xl w-full">
      <div className="mb-8 pb-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 bg-sky-50 text-[#002B5B] text-xs font-extrabold tracking-wider uppercase rounded-md border border-sky-100">
              Step 2 of 2
            </span>
            <span className="text-xs font-semibold text-gray-400">100% Almost Done</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B5B] tracking-tight">
            Where should we look for your home?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            Select your target city, preferred locality, and budget parameters.
          </p>
        </div>

        <div className="w-full md:w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden self-center">
          <div className="bg-[#002B5B] h-full w-full rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase">
            CHOOSE YOUR CITY <span className="text-red-500">*</span>
          </label>
          <span className="text-xs font-semibold text-gray-400">
            {cities.length} Available
          </span>
        </div>

        {loadingCities ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="py-3 px-4 rounded-xl border border-gray-100 bg-gray-50/50 animate-pulse h-11"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {cities.map((city) => {
              const isSelected = data.cityId === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`py-2.5 px-3.5 rounded-xl border transition-all duration-200 flex items-center justify-center text-center group cursor-pointer ${
                    isSelected
                      ? "border-[#002B5B] bg-[#002B5B] text-white shadow-sm ring-2 ring-[#002B5B]/20"
                      : "border-gray-200/90 hover:border-gray-300 hover:bg-gray-50 bg-white text-gray-800 shadow-2xs"
                  }`}
                >
                  <span className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-800 group-hover:text-[#002B5B]"}`}>
                    {city.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-10 relative" ref={containerRef}>
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
          PREFERRED LOCALITY / AREA <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <SlLocationPin className="text-lg" />
          </span>
          <input
            type="text"
            placeholder={`Search localities in ${data.cityName || "your city"}...`}
            onFocus={() => !data.locationId && locationSuggestions.length > 0 && setIsOpen(true)}
            value={data.locationQuery}
            onChange={(e) =>
              onChange({ locationQuery: e.target.value, locationId: "" })
            }
            className={`w-full pl-12 pr-5 py-4 rounded-2xl border-2 text-base transition-all focus:outline-none ${
              data.locationId
                ? "border-emerald-500 bg-emerald-50/20 focus:ring-4 focus:ring-emerald-500/10 font-semibold text-gray-900 shadow-xs"
                : "border-gray-200 focus:ring-4 focus:ring-[#002B5B]/10 focus:border-[#002B5B] text-gray-800 bg-white"
            }`}
          />
        </div>

        {data.locationId && (
          <p className="text-sm text-emerald-700 font-semibold mt-2.5 flex items-center gap-1.5 animate-fadeIn">
            ✓ Selected locality: <strong>{data.locationQuery}</strong>
          </p>
        )}

        {isOpen && locationSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-gray-100">
            {locationSuggestions.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocationSelect(loc)}
                className="w-full flex items-center justify-between px-6 py-4 text-base hover:bg-slate-50 transition-colors text-left group cursor-pointer"
              >
                <span className="font-semibold text-gray-800 group-hover:text-[#002B5B]">{loc.name}</span>
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-semibold">
                  <SlLocationPin className="text-emerald-600 text-sm" /> Locality
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
            PREFERRED BHK <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {BHK_OPTIONS.map((opt) => {
              const isSelected = data.bhk === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ bhk: opt.value })}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-[#002B5B] bg-slate-50/80 ring-2 ring-[#002B5B]/20 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-base font-bold text-gray-900">{opt.label}</span>
                  <span className="text-xs text-gray-500 mt-1">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">
            TARGET BUDGET <span className="text-red-500">*</span>
          </label>
          <select
            value={data.maxBudget}
            onChange={(e) => onChange({ maxBudget: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#002B5B]/10 focus:border-[#002B5B] text-base font-semibold text-gray-900 bg-white transition-all shadow-xs cursor-pointer"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.tag})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">Choose the upper cap of your desired budget range.</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-4 border-2 border-gray-200 text-gray-600 hover:text-gray-900 font-bold rounded-2xl transition-all cursor-pointer hover:border-gray-300"
        >
          &larr; Back
        </button>
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onSubmit}
          className="flex-1 max-w-xs py-4 bg-[#002B5B] hover:bg-[#001f42] disabled:bg-gray-100 disabled:text-gray-400 text-white text-base sm:text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed group"
        >
          <span>Find Matches</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
