"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiUser } from "react-icons/fi";
import { useAuthStore } from "@/src/stores/auth.store";
import { useSlider } from "@/src/context/SliderContext";
import { HEADER_PILL, HeaderVariantConfig } from "./header.config";
import dynamic from "next/dynamic";
import Image from "next/image";

const UserSliderContent = dynamic(() => import("./UserSliderContent"));
const BrokerSliderContent = dynamic(() => import("./BrokerSliderContent"));

export interface BaseHeaderClientProps {
    children: React.ReactNode;
    config: HeaderVariantConfig;
}

export default function BaseHeaderClient({ children, config }: BaseHeaderClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, authType, user } = useAuthStore();
    const { openSlider } = useSlider();
    const isHome = pathname === "/";
    const [visible, setVisible] = useState(!isHome);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);


    useEffect(() => {
        if (!config.sticky || !isHome) {
            setVisible(true);
            return;
        }

        const target = document.getElementById("banner-end");
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(!entry.isIntersecting),
            { threshold: 0 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [isHome, config.sticky]);

    const handleSliderOpen = () => {
        if (authType === "broker") {
            openSlider(<BrokerSliderContent />, { width: "w-72 md:w-80" });
        } else {
            openSlider(<UserSliderContent />, { width: "w-72 md:w-80" });
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = (to: string) => {
        setMobileMenuOpen(false);
    };

    const navigation: Array<{ name: string; to?: string; current?: string; show?: boolean; action?: () => void }> = [
        {
            name: "Post Your Property",
            to: "/post-property",
            current: "/post-property",
            show: !authType,
        },
        {
            name: "Log In",
            to: "/login",
            current: "/login",
            show: !authType,
        },
    ];

    return (
        <header className={`${isHome ? (config.sticky ? "fixed " : "relative") : "sticky"} top-0 left-0 z-50 w-full h-15 flex items-center ${config.bg} transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`} >
            {/* `relative` anchors the absolutely-centred search bar slot. */}
            <div className="relative flex h-full flex-1 gap-2 sm:gap-4 items-center justify-between px-2 md:px-4 w-full mx-auto md:max-w-[1440px]">
                {children}

                <div className="shrink-0">
                    {/* Mobile CTA — the desktop nav below carries the same link
                        from `lg` up, so this is hidden there to avoid a duplicate. */}
                    {config.mobileCta && (
                        <Link href={config.mobileCta.href} className={`lg:hidden ${HEADER_PILL}`}>
                            {config.mobileCta.label}
                        </Link>
                    )}

                    <nav className="hidden lg:flex flex-1 items-center justify-end gap-3 text-white">
                        {!isAuthenticated &&
                            config.navItems.map(({ href, label }) => (
                                <Link key={href} href={href} className={HEADER_PILL}>
                                    {label}
                                </Link>
                            ))}

                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={handleSliderOpen}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 overflow-hidden ring-2 ring-white/50 hover:ring-white transition-all"
                                >
                                    {user?.profilePhoto ? (
                                        <Image src={user.profilePhoto} alt="Profile" width={40} height={40} className="h-full w-full object-cover" />
                                    ) : (
                                        <FiUser className="text-xl" />
                                    )}
                                </button>
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#10B981] ring-2 ring-blue-900"></span>
                            </div>
                        )}
                    </nav>




                    {isMobileMenuOpen && (
                        <div
                            className=""
                            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 30 }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 mb-19 transition-all duration-300 ease-in-out top-15 space-y-1 absolute left-0 w-full bg-gray-500/10 backdrop-blur-3xl"
                            >
                                {navigation
                                    ?.filter((item) => item.show !== false)
                                    ?.map((item) =>
                                        item.action ? (
                                            <button
                                                type="button"
                                                key={item.name}
                                                onClick={() => {
                                                    item.action?.();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`w-full ${HEADER_PILL}`}
                                            >
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                href={item.to || "#"}
                                                onClick={() => {
                                                    if (item.to) handleNavLinkClick(item.to);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`w-full ${HEADER_PILL}`}
                                            >
                                                {item.name}
                                            </Link>
                                        )
                                    )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </header>
    );
}
