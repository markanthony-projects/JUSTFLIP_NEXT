import Header from "@/src/layout/Header/Header.server";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { City } from "@/src/types";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const activeCityRaw = cookieStore.get("activeCity")?.value;
    let initialCity: City | undefined = undefined;

    if (activeCityRaw) {
        try {
            initialCity = JSON.parse(decodeURIComponent(activeCityRaw));
        } catch (e) {
            initialCity = undefined;
        }
    }

    return (
        <div> 
            <link rel="preconnect" href="https://media.justflip.in" />
            <Header initialCity={initialCity} />
            {children}
        </div>
    );
}