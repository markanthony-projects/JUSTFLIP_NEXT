"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiUser } from "react-icons/fi";
import { useAuthStore } from "@/src/stores/auth.store";
import { HiOutlineMenu, HiOutlineX, HiOutlineUserCircle } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import SearchBar from "@/src/components/SearchBar/SearchBar.server";
import { useSlider } from "@/src/context/SliderContext";
import UserSliderContent from "./UserSliderContent";
import BrokerSliderContent from "./BrokerSliderContent";
export default function BaseHeaderClient({ children, config, }) {
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

    const handleNavLinkClick = (to) => {
        setMobileMenuOpen(false);
    };

    const navigation = [
        {
            name: "Post Your Property",
            to: "/upload-a-property",
            current: "/upload-a-property",
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
        <header className={`${isHome ? (config.sticky ? "fixed " : "relative") : "sticky"} top-0 left-0 z-50 w-full py-4  ${config.bg} transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`} >
            <div className="flex gap-2 sm:gap-4 items-center justify-between flex-1 px-2 md:px-4 w-full mx-auto md:max-w-[1440px]">
                {children}

                <div className="">
                    <nav className="hidden lg:flex flex-1 items-center justify-end gap-4 text-xs text-white">
                        {!isAuthenticated &&
                            config.navItems.map(({ href, label }) => (
                                <Link key={href} href={href} className="relative overflow-hidden px-3 py-1 rounded-sm hover:bg-white/20" >
                                    {label}
                                </Link>
                            ))}

                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={handleSliderOpen}
                                    className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 overflow-hidden ring-2 ring-white/50 hover:ring-white transition-all"
                                >
                                    {user?.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <FiUser className="text-xl" />
                                    )}
                                </button>
                                <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-[#10B981] ring-2 ring-blue-900"></span>
                            </div>
                        )}
                    </nav>

                    <div className=" inset-y-0 right-2 flex items-center lg:hidden">
                        {isAuthenticated ? (
                            <div>
                                {isAuthenticated && (
                                    <div className="flex items-center justify-end ml-6 relative">
                                        <div className="relative">
                                            <button
                                                onClick={handleSliderOpen}
                                                className="h-10 w-10 flex items-center justify-center rounded-full text-white bg-white/20 overflow-hidden ring-2 ring-white/50 hover:ring-white transition-all"
                                            >
                                                {user?.profilePhoto ? (
                                                    <img src={user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <FiUser className="text-lg" />
                                                )}
                                            </button>
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#10B981] ring-2 ring-blue-900"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                aria-label="Menu"
                                onClick={toggleMobileMenu}
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                {isMobileMenuOpen ? (<>
                                    <HiOutlineX
                                        className=" text-white  block h-6 w-6"
                                        aria-hidden="true"
                                    /> <span className="sr-only">Menu</span>
                                </>
                                ) : (<>
                                    <HiOutlineMenu
                                        className="text-white block h-6 w-6"
                                        aria-hidden="true"
                                    /> <span className="sr-only">Menu</span>
                                </>
                                )}
                            </button>
                        )}
                    </div>


                    {isMobileMenuOpen && (
                        <div
                            className=""
                            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 30 }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className={`p-2 mb-19 transition-all duration-300 ease-in-out  ${config.showProfile ? "top-[99px] md:top-[55px]" : "top-[55px] md:top-[55px]"}  space-y-1 absolute left-0 w-full bg-gray-500/10 backdrop-blur-3xl`}
                            >
                                {navigation
                                    ?.filter((item) => item.show !== false)
                                    ?.map((item) =>
                                        item.action ? (
                                            <button
                                                type="button"
                                                key={item.name}
                                                onClick={() => {
                                                    item.action();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-2 rounded-md text-base text-white font-medium"
                                            >
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                href={item.to}
                                                onClick={() => {
                                                    handleNavLinkClick(item.to);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="block px-3 py-2 rounded-md text-base text-white font-medium"
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
            { config?.showSearch && (
                    <div className={`relative  md:hidden  w-full flex-1 px-2  pt-1  w-full  mx-auto md:max-w-[1440px] `}>
                        <SearchBar />
                    </div>
                )
            }
        </header>
    );
}
