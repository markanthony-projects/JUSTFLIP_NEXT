import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import Logo from "@/src/components/Logo/Logo";
import LoginTabs from "./components/LoginTabs";
import LoginPageBg from "@/public/assets/LoginPageBg.jpg";
import { constructMetadata } from "@/src/utils/seo";

export const metadata = constructMetadata({
    title: "Login | Justflip Real Estate",
    description: "Sign in to your Justflip account as a buyer, owner, or partner agent/broker to post properties, view listings, and manage your real estate matches.",
    canonical: "/login",
});

const LoginPage = () => {

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
                <Image src={LoginPageBg} alt="Background" fill priority className="object-cover brightness-[0.4] scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002b5b]/60 via-transparent to-transparent" />
            </div>

            <div className="absolute top-6 right-6 z-20">
                <Link href="/" className="flex items-center gap-2 py-2 px-5 text-sm font-medium text-white border border-white/20 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all active:scale-95">
                    <HiArrowLeft className="w-4 h-4" />
                    Back home
                </Link>
            </div>

            <div className="relative z-10 w-full  px-4 animate-in fade-in zoom-in mx-auto duration-700">
                <div className="flex justify-center">
                    <Logo className="w-48 h-16 md:w-56 md:h-20" />
                </div>
                <div className="flex items-start flex-1 min-h-[420px] w-full justify-center relative">
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-8 md:p-7 border border-white/20 w-[420px]">
                        <div className="mb-2">
                            <h1 className="text-3xl font-black text-[#002b5b] tracking-tight mb-2">
                                Welcome back
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Access your JustFlip account to manage properties.
                            </p>
                        </div>

                        <LoginTabs />
                    </div>
                </div>



                <div className="mt-8 text-center text-white/60 text-[11px] font-medium tracking-wide uppercase">
                    &copy; {new Date().getFullYear()} JustFlip Real Estate . Robust . Secure . Fast
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
