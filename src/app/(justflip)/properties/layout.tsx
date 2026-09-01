import React from "react";
import { constructMetadata } from "@/src/utils/seo";

export const metadata = constructMetadata({
    title: "Explore Properties Across India & Dubai | JustFlip",
    description: "Browse verified residential properties, flats, apartments, and villas. View floor plans, photos, pricing, and reviews on JustFlip.",
    canonical: "/properties",
});

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://media.justflip.in" />
            {children}
        </>
    );
}
