import React from "react";
import Header from "@/src/layout/Header/Header.server";

export default async function JustflipLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-gray-50 min-h-screen">
            <Header />
            <div className="flex-1 w-full mx-auto px-2 md:px-4 max-w-[1300px]">
                {children}
            </div>
        </main>

    );
}