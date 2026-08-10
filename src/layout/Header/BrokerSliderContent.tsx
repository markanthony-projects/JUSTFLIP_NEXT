"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/auth.store';
import { useSlider } from '@/src/context/SliderContext';

import { useBrokerPropertyFormStore } from '@/src/stores/brokerPropertyForm.store';

import {
    HiOutlineLogout,
    HiOutlineUser,
    HiOutlineHome,
    HiOutlineCog,
    HiOutlineCollection,
    HiOutlineBell,
    HiOutlineShieldCheck,
    HiOutlineCloudUpload,
    HiOutlineHeart
} from 'react-icons/hi';
import Image from '@/src/components/atoms/Image';

export default function BrokerSliderContent() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { closeSlider } = useSlider();

    const handleLogout = async () => {
        await logout();

        // if(useBrokerPropertyFormStore.getState().clearStore){
        //     useBrokerPropertyFormStore.getState().clearStore()
        // }

        closeSlider();
        router.push("/");
    };

    const menuSections = [
        {
            label: "Account",
            items: [
                { name: 'My Profile', href: '/profile?tab=my-profile', icon: HiOutlineUser },
                { name: 'Broker Dashboard', href: '/profile?tab=dashboard', icon: HiOutlineCollection },
                { name: 'Post a Property', href: '/post-property', icon: HiOutlineCloudUpload },
            ]
        },
        {
            label: "Real Estate",
            items: [
                { name: 'Wishlist', href: '/profile?tab=wishlist', icon: HiOutlineHeart },
                { name: 'Compare', href: '/compare', icon: HiOutlineCollection },
            ]
        },
        {
            label: "System",
            items: [
                { name: 'Settings', href: '/settings', icon: HiOutlineCog },
            ]
        }
    ];

    const handleNavigate = (href: string) => {
        closeSlider();
        router.push(href);
    };

    return (
        <div className="flex flex-col h-full bg-white text-gray-900">
            <div className="px-6 pb-6 pt-10 border-b border-gray-100 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {user?.profilePhoto ? (
                        <Image
                            src={user?.profilePhoto}
                            alt={user?.name || "Profile"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-xl font-bold text-blue-600">
                            {user?.name?.[0]?.toUpperCase() || 'B'}
                        </span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 truncate">
                        {user?.name || user?.username || 'Welcome!'}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">
                        {user?.email || 'broker@domain.com'}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-modern px-4 py-6 space-y-6">
                {menuSections.map((section) => (
                    <div key={section.label} className="space-y-1">
                        <h3 className="px-3 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {section.label}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigate(item.href)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                                >
                                    <item.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 md:block hidden">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
                >
                    <HiOutlineLogout className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}