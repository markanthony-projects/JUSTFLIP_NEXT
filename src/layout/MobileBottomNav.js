"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HiHome, HiOutlineBookmark, HiOutlineChatAlt2, HiOutlineMenu, HiOutlineSearch } from "react-icons/hi";
import { TbCrown } from "react-icons/tb";
import { FiPlusSquare, FiUser } from "react-icons/fi";
import { useAuthStore } from "@/src/stores/auth.store";
import { useSlider, isOpen } from "@/src/context/SliderContext";
import UserSliderContent from "./Header/UserSliderContent";
import BrokerSliderContent from "./Header/BrokerSliderContent";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tab = searchParams.get("tab")

    const { isAuthenticated, user, authType } = useAuthStore();
    const { openSlider } = useSlider();

    const handleSliderOpen = () => {
        if (authType === "broker") {
            openSlider(<BrokerSliderContent />, { width: "w-72 md:w-80" });
        } else {
            openSlider(<UserSliderContent />, { width: "w-72 md:w-80" });
        }
    };

    console.log(user)
    console.log(authType)

    const MenuIcon = (props) => {
        if (isAuthenticated) {
            return user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className={`rounded-full object-cover w-6 h-6 ${props.className || ""}`} />
            ) : (
                <FiUser className={props.className} />
            );
        }
        return <FiUser className={props.className} />
    };

    const navItems = [
        {
            name: "Home",
            icon: HiHome,
            href: "/",
            isActive: pathname === "/",
        },
        {
            name: "Search",
            icon: HiOutlineSearch,
            href: "/search",
            isActive: pathname === "/search",
        },
        {
            name: "Sell/Rent",
            icon: FiPlusSquare,
            href: "/post-property",
            isActive: pathname.startsWith("/post-property"),
            badge: "FREE",
        },
        {
            name: "Saved",
            icon: HiOutlineBookmark,
            href: "/profile?tab=wishlist",
            isActive: pathname === "/profile" && tab === "wishlist",
        },
        {
            name: isAuthenticated ? "Profile" : "Login",
            icon: MenuIcon,
            href: "/login",
            action: isAuthenticated ? handleSliderOpen : undefined,
            isActive: pathname === "/login",
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] px-2 pt-2 pb-3 flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const content = (
                    <>
                        <div className="relative flex items-center justify-center">
                            <item.icon className="text-2xl" />
                            {item.badge && (
                                <div className="absolute -bottom-2 bg-green-500 text-white text-[8px] font-bold px-1 rounded-sm tracking-wider">
                                    {item.badge}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-medium leading-none mt-0.5">{item.name}</span>
                    </>
                );

                if (item.action) {
                    return (
                        <button
                            key={item.name}
                            onClick={item.action}
                            className={`flex flex-col items-center justify-center w-1/5 gap-1.5 ${
                                item.isActive ? "text-[#002B5B]" : "text-gray-500"
                            }`}
                        >
                            {content}
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center w-1/5 gap-1.5 ${
                            item.isActive ? "text-[#002B5B]" : "text-gray-500"
                        }`}
                    >
                        {content}
                    </Link>
                );
            })}
        </div>
    );
}
