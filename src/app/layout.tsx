import favicon from "@/public/icons/favicon.svg";

import "./globals.css";

import { SliderProvider } from "@/src/context/SliderContext";
import { buildOrganizationSchema } from "@/src/utils/schema";
import { constructMetadata } from "@/src/utils/seo";

import dynamic from "next/dynamic";

const ToastContainer = dynamic(() => import("../components/organisms/ToastContainer"));
import Footer from "../layout/Footer";
import PreFooter from "../layout/PreFooter";
const MobileBottomNav = dynamic(() => import("../layout/MobileBottomNav"));

import { firaSans } from "./fonts";

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    metadataBase: new URL("https://justflip.in"),
    ...constructMetadata({}),
};

export default function RootLayout({ children }: { children: ReactNode }) {

    const orgSchema = buildOrganizationSchema();

    return (
        <html lang="en">
            <head>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href={favicon.src}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(orgSchema),
                    }}
                />
            </head>

            <body
                className={`
                    ${firaSans.className}
                    min-h-screen
                    flex
                    flex-col
                    overflow-x-hidden
                    antialiased
                    pb-16 md:pb-0
                `}
            >
                {/* <CompareInitializer /> */}

                <SliderProvider>
                    {children}

                    <PreFooter />

                    <Footer />
                    
                    <MobileBottomNav />
                    {/* <MobileBottomNavGlass /> */}

                    <ToastContainer />
                </SliderProvider>
            </body>
        </html>
    );
}