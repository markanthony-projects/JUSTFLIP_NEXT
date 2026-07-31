"use client";

import dynamic from "next/dynamic";
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

const MortgageCalculators = dynamic(
    () => import("./MortgageCalculators"),
    { 
        ssr: false,
        loading: () => <SkeletonBlock className="h-64 w-full" />
    }
);

export default function MortgageCalculatorsDynamic() {
    return <MortgageCalculators />;
}
