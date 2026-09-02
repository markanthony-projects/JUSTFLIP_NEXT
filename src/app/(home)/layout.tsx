import Header from "@/src/layout/Header/Header.server";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {

    return (
        <div> 
            <link rel="preconnect" href="https://media.justflip.in" />
            <Header />
            {children}
        </div>
    );
}