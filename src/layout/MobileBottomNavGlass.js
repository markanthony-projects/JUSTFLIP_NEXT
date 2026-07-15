"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiOutlineSearch, HiOutlineBookmark, HiOutlineCog, HiOutlineSwitchHorizontal } from "react-icons/hi";

export default function MobileBottomNavGlass() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Home",
            icon: HiHome, // The screenshot shows a filled home icon
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
            name: "Post",
            icon: HiOutlineSwitchHorizontal,
            href: "/post-property",
            isActive: pathname === "/search",
        },
        {
            name: "Saved",
            icon: HiOutlineBookmark,
            href: "/saved",
            isActive: pathname === "/saved",
        },
        {
            name: "Settings",
            icon: HiOutlineCog,
            href: "/settings",
            isActive: pathname === "/settings",
        },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100]">
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-[32px] px-6 py-3 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${item.isActive ? "text-blue-900 font-semibold" : "text-gray-500 font-medium"
                            }`}
                    >
                        <item.icon className={`text-[26px] ${item.isActive ? "text-blue-900" : "text-gray-500"}`} />
                        <span className="text-[10px] leading-none tracking-wide">{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
