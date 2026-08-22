"use client";

import dynamic from "next/dynamic";
import { MortgageCalculatorSkeleton } from "@/src/app/(justflip)/components/Skelton/MortgageCalculatorSkeleton";

const MortgageCalculators = dynamic(
    () => import("@/src/app/(justflip)/(tools)/mortgage-calculator/components/MortgageCalculator"),
    { 
        ssr: false,
        loading: () => <MortgageCalculatorSkeleton />
    }
);

export default function MortgageCalculatorsDynamic() {
    return <MortgageCalculators />;
}
