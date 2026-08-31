import React from "react";

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <link rel="preconnect" href="https://media.justflip.in" crossOrigin="anonymous" />
            {children}
        </>
    );
}
