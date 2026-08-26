"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { JUSTFLIP } from "@/src/lib/axios/api";
import Step1GoalHousehold, { Step1Data } from "./Step1GoalHousehold";
import Step2LocationBudget, { Step2Data } from "./Step2LocationBudget";
import ResultGrid, { PropertyMatch } from "./ResultGrid";

export type MasterFormData = Step1Data & Step2Data;

export default function PropertyMatchmaker() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<PropertyMatch[]>([]);

  const [formData, setFormData] = useState<MasterFormData>({
    goal: "ready",
    household: "just_me",
    cityId: "",
    cityName: "",
    locationQuery: "",
    locationId: "",
    bhk: "2BHK",
    maxBudget: "10000000",
  });

  const handleUpdate = (updated: Partial<MasterFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleFindMatches = async () => {
    setIsSearching(true);
    setCurrentStep(3);

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
            console.error(`Failed to fetch details for project ${item.id}`, e);
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

          let matchesPrice = false;
          if (isAboveFiveCrSelected) {
            matchesPrice = unitMaxPrice >= FIVE_CR_IN_INR || unitMinPrice >= FIVE_CR_IN_INR;
          } else {
            matchesPrice = unitMinPrice <= selectedBudget;
          }

          return matchesBhk && matchesPrice;
        });

        if (matchingUnits.length === 0) continue;

        let minPrice = Infinity;
        let maxPrice = -Infinity;
        const unitTypesSet = new Set<string>();

        p.units.forEach((u: any) => {
          if (u.type) unitTypesSet.add(u.type.replace(/\s+/g, "").toUpperCase());
          const uMin = Number(u.minPrice);
          const uMax = Number(u.maxPrice);
          if (uMin && uMin < minPrice) minPrice = uMin;
          if (uMax && uMax > maxPrice) maxPrice = uMax;
        });

        const formatCurrency = (amount: number) => {
          if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
          }
          return `₹${(amount / 100000).toFixed(2)} L`;
        };

        let formattedPrice = `Up to ${formatCurrency(selectedBudget)}`;
        if (minPrice !== Infinity && maxPrice !== -Infinity) {
          formattedPrice =
            minPrice === maxPrice
              ? formatCurrency(minPrice)
              : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
        }

        const bannerMedia = p.medias?.find((m: any) => m.title === "banner") || p.medias?.[0];
        const imageUrl = bannerMedia?.url
        

        mappedResults.push({
          id: p.id,
          name: p.name,
          cityName: p.city?.name || formData.cityName || "Bengaluru",
          zoneName: p.zone?.name || p.location?.zone?.name || "Central", 
          locationName: p.location?.name || formData.locationQuery,
          priceRange: formattedPrice,
          areaRange: "925 - 1,445 sq.ft",
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
      console.error("Failed to fetch property match results:", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProperty = (url: string) => {
    router.push(url);
  };

  return (
    <div className="w-full  px-0 sm:px-8 lg:px-12">
      {currentStep < 3 ? (
        <div className="space-y-6">
          {currentStep === 1 && (
            <Step1GoalHousehold
              data={formData}
              onChange={handleUpdate}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <Step2LocationBudget
              data={formData}
              onChange={handleUpdate}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleFindMatches}
            />
          )}
        </div>
      ) : (
        <ResultGrid
          results={results}
          isSearching={isSearching}
          onModify={() => setCurrentStep(2)}
          onSelectProperty={handleSelectProperty}
        />
      )}
    </div>
  );
}