import React from "react";
import Header from "@/src/layout/Header/Header.server";

export default async function JustflipLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Header />
            <div className="flex-1 w-full mx-auto px-4 lg:px-6 lg:max-w-310">
                {children}
            </div>
        </main>

    );
}