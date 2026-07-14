"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Reusable Modal — pure Tailwind, zero external libraries.
 *
 * Props
 * ─────
 * isOpen       boolean            Whether the modal is visible
 * onClose      () => void         Called when backdrop / Escape is pressed
 * children     ReactNode          Modal body content
 * maxWidth?    string             Tailwind max-w-* class   (default "max-w-4xl")
 * height?      string             Tailwind h-* / max-h-*   (default "h-[80vh] md:h-[95vh]")
 * className?   string             Extra classes on the panel
 * closeOnBackdrop?  boolean       Close when clicking backdrop (default true)
 */
export default function Modal({
    isOpen,
    onClose,
    children,
    maxWidth = "max-w-4xl",
    height = "h-[80vh] md:h-[95vh]",
    className = "",
    closeOnBackdrop = true,
}) {
    const panelRef = useRef(null);

    // Close on Escape
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") onClose?.();
        },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener("keydown", handleKeyDown);
        // Prevent body scroll while modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    // Click outside panel → close
    const handleBackdropClick = useCallback(
        (e) => {
            if (closeOnBackdrop && panelRef.current && !panelRef.current.contains(e.target)) {
                onClose?.();
            }
        },
        [closeOnBackdrop, onClose]
    );

    if (!isOpen) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
            className={`
                fixed inset-0 z-50
                flex items-center justify-center
                px-2 md:px-4
                bg-black/60 backdrop-blur-sm
                transition-opacity duration-200
            `}
        >
            <div
                ref={panelRef}
                className={`
                    relative bg-white rounded-2xl shadow-2xl outline-none
                    flex flex-col overflow-hidden
                    w-full ${maxWidth} ${height} ${className}
                `}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}