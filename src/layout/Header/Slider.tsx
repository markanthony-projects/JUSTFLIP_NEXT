"use client";

import Button from "@/src/components/atoms/CloseButton";
import { useEffect, useState } from "react";

export interface SlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    side?: "left" | "right";
    width?: string;
}

export default function SlideOver({
    isOpen,
    onClose,
    children,
    side = "right",
    width = "w-80 sm:w-96",
}: SlideOverProps) {
    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);

    // Handle Initial Mount
    useEffect(() => setMounted(true), []);

    // Handle Animation Trigger
    useEffect(() => {
        if (isOpen) {
            // Tiny delay ensures the browser paints the starting position 
            // BEFORE applying the translate-x-0 class, triggering the animation.
            const timer = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    // Handle Body Scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Handle Esc Key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-1100 isolate transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 app-overlay transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`overflow-hidden absolute top-0 h-full flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${width} ${side === "left"
                    ? "left-0 rounded-r-2xl border-r border-gray-100"
                    : "right-0 rounded-l-2xl border-l border-gray-100"
                    } ${show
                        ? "translate-x-0"
                        : side === "left"
                            ? "-translate-x-full"
                            : "translate-x-full"
                    }`}
            >
                <div className="absolute top-4 right-4 z-20">
                    <Button onClick={onClose} />
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain h-full w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}