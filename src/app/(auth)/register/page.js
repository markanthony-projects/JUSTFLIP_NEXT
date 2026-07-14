import Header from "@/src/layout/Header/Header.server";
import RegistrationSidebar from "./components/RegistrationSidebar";
import RegistrationForm from "./components/RegistrationForm";
import { constructMetadata } from "@/src/utils/seo";

export const metadata = constructMetadata({
    title: "Broker Registration | Justflip Real Estate",
    description: "Sign up as a real estate broker or agent on Justflip to list properties, manage leads, and grow your real estate business.",
    canonical: "/register",
});

export default function BrokerRegistrationPage() {
    return (
        <main className="min-h-screen bg-white w-full overflow-hidden">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] justify-center text-[#333] min-h-[calc(100vh-80px)]">
                <RegistrationSidebar />
                <RegistrationForm />
            </div>
        </main>
    );
}