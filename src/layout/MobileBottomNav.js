"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiOutlineChatAlt2, HiOutlineMenu } from "react-icons/hi";
import { TbCrown } from "react-icons/tb";
import { FiPlusSquare } from "react-icons/fi";

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Home",
            icon: HiHome,
            href: "/",
            isActive: pathname === "/",
            activeColor: "text-orange-500",
        },
        {
            name: "Responses",
            icon: HiOutlineChatAlt2,
            href: "/responses",
            isActive: pathname === "/responses",
        },
        {
            name: "Sell/Rent",
            icon: FiPlusSquare,
            href: "/upload-a-property",
            isActive: pathname === "/upload-a-property",
            badge: "FREE",
            activeColor: "text-orange-500",
        },
        {
            name: "Upgrade",
            icon: TbCrown,
            href: "/upgrade",
            isActive: pathname === "/upgrade",
        },
        {
            name: "Menu",
            icon: HiOutlineMenu,
            href: "/menu",
            isActive: pathname === "/menu",
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] px-2 pt-2 pb-3 flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center justify-center w-1/5 gap-1.5 ${
                        item.isActive ? item.activeColor || "text-gray-900" : "text-gray-500"
                    } hover:text-orange-500 transition-colors`}
                >
                    <div className="relative flex items-center justify-center">
                        <item.icon className="text-2xl" />
                        {item.badge && (
                            <div className="absolute -bottom-2 bg-green-500 text-white text-[8px] font-bold px-1 rounded-sm tracking-wider">
                                {item.badge}
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium leading-none mt-0.5">{item.name}</span>
                </Link>
            ))}
        </div>
    );
}
