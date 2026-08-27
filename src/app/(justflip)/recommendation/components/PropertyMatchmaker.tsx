"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JUSTFLIP } from "@/src/lib/axios/api";
import Step1GoalHousehold, { Step1Data } from "./Step1GoalHousehold";
import Step2LocationBudget, { Step2Data } from "./Step2LocationBudget";
import ResultGrid, { PropertyMatch } from "./ResultGrid";

export type MasterFormData = Step1Data & Step2Data;

export default function PropertyMatchmaker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read step from URL query params, default to 1
  const currentStep = Number(searchParams.get("step")) || 1;

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<PropertyMatch[]>([]);

  const [formData, setFormData] = useState<MasterFormData>({
    goal: searchParams.get("goal") || "ready",
    household: searchParams.get("household") || "just_me",
    cityId: searchParams.get("cityId") || "",
    cityName: searchParams.get("cityName") || "",
    locationQuery: searchParams.get("locationQuery") || "",
    locationId: searchParams.get("locationId") || "",
    bhk: searchParams.get("bhk") || "2BHK",
    maxBudget: searchParams.get("maxBudget") || "10000000",
  });

  // Helper to update URL query params when step or form data changes
  const updateUrlParams = (newStep: number, updatedData: MasterFormData) => {
    const params = new URLSearchParams();
    params.set("step", String(newStep));
    Object.entries(updatedData).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSetStep = (step: number) => {
    updateUrlParams(step, formData);
  };

  const handleUpdate = (updated: Partial<MasterFormData>) => {
    const newFormData = { ...formData, ...updated };
    setFormData(newFormData);
    updateUrlParams(currentStep, newFormData);
  };

  // Automatically re-run search if user hits back button and lands on step 3 with search criteria present
  useEffect(() => {
    if (currentStep === 3 && results.length === 0 && formData.locationQuery) {
      handleFindMatches(false);
    }
  }, [currentStep]);

  const handleFindMatches = async (shouldUpdateStep = true) => {
    if (shouldUpdateStep) {
      handleSetStep(3);
    }
    setIsSearching(true);

    try {
      const searchRes = await JUSTFLIP.get("/project/search", {
        params: {
          query: formData.locationQuery,
          ...(formData.locationId ? { locationId: formData.locationId } : {}),
        },
      });

      const searchProjects = searchRes.data?.projects || [];

      if (!searchProjects.length) {
        setResults([]);
        return;
      }

      const detailedProjects = await Promise.all(
        searchProjects.map(async (item: { id: string }) => {
          try {
            const detailRes = await JUSTFLIP.get(`/project/${item.id}`);
            return detailRes.data?.project || null;
          } catch (e) {
            return null;
          }
        })
      );

      const rawBudgetStr = String(formData.maxBudget || "").replace(/[^0-9]/g, "");
      const selectedBudget = rawBudgetStr ? Number(rawBudgetStr) : 10000000;
      const targetBhk = formData.bhk ? formData.bhk.replace(/\s+/g, "").toUpperCase() : "";
      const FIVE_CR_IN_INR = 50000000;
      const isAboveFiveCrSelected = selectedBudget >= FIVE_CR_IN_INR;

      const mappedResults: PropertyMatch[] = [];

      for (const p of detailedProjects) {
        if (!p || !Array.isArray(p.units)) continue;

        const matchingUnits = p.units.filter((u: any) => {
          const unitType = (u.type || "").replace(/\s+/g, "").toUpperCase();
          const matchesBhk = targetBhk ? unitType === targetBhk : true;
          const unitMinPrice = Number(u.minPrice) || 0;
          const unitMaxPrice = Number(u.maxPrice) || unitMinPrice;

          let matchesPrice = isAboveFiveCrSelected
            ? unitMaxPrice >= FIVE_CR_IN_INR || unitMinPrice >= FIVE_CR_IN_INR
            : unitMinPrice <= selectedBudget;

          return matchesBhk && matchesPrice;
        });

        if (matchingUnits.length === 0) continue;

        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let minArea = Infinity;
        let maxArea = -Infinity;
        const unitTypesSet = new Set<string>();

        p.units.forEach((u: any) => {
          if (u.type) unitTypesSet.add(u.type.replace(/\s+/g, "").toUpperCase());
          
          const uMin = Number(u.minPrice);
          const uMax = Number(u.maxPrice);
          if (uMin && uMin < minPrice) minPrice = uMin;
          if (uMax && uMax > maxPrice) maxPrice = uMax;

          // Extract area dynamically from interiorArea or exteriorArea
          const uArea = Number(u.interiorArea) || Number(u.exteriorArea) || 0;
          if (uArea > 0) {
            if (uArea < minArea) minArea = uArea;
            if (uArea > maxArea) maxArea = uArea;
          }
        });

        const formatCurrency = (amount: number) => {
          if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
          return `₹${(amount / 100000).toFixed(2)} L`;
        };

        let formattedPrice = `Up to ${formatCurrency(selectedBudget)}`;
        if (minPrice !== Infinity && maxPrice !== -Infinity) {
          formattedPrice = minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
        }

        // Format dynamic area range text
        let formattedArea = "Size on request";
        if (minArea !== Infinity && maxArea !== -Infinity) {
          formattedArea = minArea === maxArea 
            ? `${minArea.toLocaleString()} sq.ft` 
            : `${minArea.toLocaleString()} - ${maxArea.toLocaleString()} sq.ft`;
        }

        const bannerMedia = p.medias?.find((m: any) => m.title === "banner") || p.medias?.[0];
        const imageUrl = bannerMedia?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80";

        mappedResults.push({
          id: p.id,
          name: p.name,
          cityName: p.city?.name || formData.cityName || "Bengaluru",
          zoneName: p.zone?.name || p.location?.zone?.name || "Central",
          locationName: p.location?.name || formData.locationQuery,
          priceRange: formattedPrice,
          areaRange: formattedArea,
          bhkTypes: Array.from(unitTypesSet).join(", ") || formData.bhk,
          image: imageUrl,
          reasons: [
            `Matches locality: ${p.location?.name || formData.locationQuery}`,
            `Fits ${formData.bhk} preference`,
          ],
        });
      }

      setResults(mappedResults);
    } catch (err) {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProperty = (url: string) => {
    router.push(url);
  };

  return (
    <div className="w-full py-2 px-0 sm:px-8 lg:px-12">
      {currentStep < 3 ? (
        <div className="space-y-6">
          {currentStep === 1 && (
            <Step1GoalHousehold
              data={formData}
              onChange={handleUpdate}
              onNext={() => handleSetStep(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2LocationBudget
              data={formData}
              onChange={handleUpdate}
              onBack={() => handleSetStep(1)}
              onSubmit={() => handleFindMatches(true)}
            />
          )}
        </div>
      ) : (
        <ResultGrid
          results={results}
          isSearching={isSearching}
          onModify={() => handleSetStep(2)}
          onSelectProperty={handleSelectProperty}
        />
      )}
    </div>
  );
}