"use client";

import dynamic from "next/dynamic";
import { MortgageCalculatorSkeleton } from "@/src/app/(justflip)/components/Skelton/MortgageCalculatorSkeleton";

const MortgageCalculators = dynamic(
    () => import("./MortgageCalculators"),
    { 
        ssr: false,
        loading: () => <MortgageCalculatorSkeleton />
    }
);

export default function MortgageCalculatorsDynamic() {
    return <MortgageCalculators />;
}
