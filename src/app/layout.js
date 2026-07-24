import favicon from "@/public/icons/favicon.svg";

import "./globals.css";

import { SliderProvider } from "@/src/context/SliderContext";
import { buildOrganizationSchema } from "@/src/utils/schema";
import { constructMetadata } from "@/src/utils/seo";

// import CompareInitializer from "../components/molecules/CompareInitializer";
import ToastContainer from "../components/organisms/ToastContainer";
import Footer from "../layout/Footer";
import PreFooter from "../layout/PreFooter";
import MobileBottomNav from "../layout/MobileBottomNav";
// import MobileBottomNavGlass from "../layout/MobileBottomNavGlass";

import { firaSans } from "./fonts";

export const metadata = {
    metadataBase: new URL("https://justflip.in"),
    ...constructMetadata({}),
};

export default function RootLayout({ children }) {

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
                </SliderProvider>

                <PreFooter />

                <Footer />
                
                <MobileBottomNav />
                {/* <MobileBottomNavGlass /> */}

                <ToastContainer />
            </body>
        </html>
    );
}