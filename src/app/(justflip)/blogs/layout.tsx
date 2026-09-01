import React from "react";
import { constructMetadata } from "@/src/utils/seo";

export const metadata = constructMetadata({
    title: "Real Estate News, Insights & Guides | JustFlip Blogs",
    description: "Read the latest real estate trends, home buying guides, property market insights, and investment tips on JustFlip.",
    canonical: "/blogs",
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://media.justflip.in" />
            {children}
        </>
    );
}
