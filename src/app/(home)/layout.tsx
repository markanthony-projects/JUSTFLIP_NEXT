import Header from "@/src/layout/Header/Header.server";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {

    return (
        <div> 
        <Header />
            {children}
        </div>
    );
}