
"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, } from "react";
import { createPortal } from "react-dom";

const GAP = 8;

const FilterPopover = ({
    label,
    active,
    width = 320,
    buttonPrefixIcon = null,
    buttonClass = "px-2 py-1.5 text-xs rounded-sm",
    children,
    showDropdownArrow = true,
}) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const wrapperRef = useRef(null);
    const panelRef = useRef(null);

    /* ==============================
       Close on outside click
    ============================== */
    useEffect(() => {
        const handleClickOutside = (e) => {
            const wrapper = wrapperRef.current;
            const panel = panelRef.current;

            if (!wrapper || !panel) return;

            if (
                !wrapper.contains(e.target) &&
                !panel.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    /* ==============================
       Calculate position BEFORE paint
    ============================== */
    useLayoutEffect(() => {
        if (!open || !wrapperRef.current) return;

        const rect = wrapperRef.current.getBoundingClientRect();

        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + GAP;

        // Prevent right overflow
        if (left + width > window.innerWidth) {
            left = window.innerWidth - width - 12;
        }

        // Prevent left overflow
        if (left < 12) {
            left = 12;
        }

        setPosition({
            top,
            left,
            arrowLeft:
                rect.left +
                rect.width / 2 -
                left,
        });
    }, [open, width]);

    /* ==============================
       Recalculate on resize/scroll
    ============================== */
    useEffect(() => {
        if (!open) return;

        const handleUpdate = () => {
            if (!wrapperRef.current) return;
            const rect = wrapperRef.current.getBoundingClientRect();

            let left = rect.left + window.scrollX;
            let top = rect.bottom + window.scrollY + GAP;

            if (left + width > window.innerWidth) {
                left = window.innerWidth - width - 12;
            }

            if (left < 12) {
                left = 12;
            }

            setPosition({
                top,
                left,
                arrowLeft:
                    rect.left +
                    rect.width / 2 -
                    left,
            });
        };

        window.addEventListener("resize", handleUpdate);
        window.addEventListener("scroll", handleUpdate, true);

        return () => {
            window.removeEventListener("resize", handleUpdate);
            window.removeEventListener("scroll", handleUpdate, true);
        };
    }, [open, width]);

    return (
        <div ref={wrapperRef} className="relative inline-block">
            {/* Trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center justify-between gap-1 border transition
                    ${active ? "border-[#002a5b67] text-[#002B5B] bg-[#74b5ff3f]" : "border-gray-300"}
                    ${buttonClass}`}
            >
                {buttonPrefixIcon}

                {label}
                {/* <span className="truncate flex-shrink-0 flex-1">
                </span> */}

                {showDropdownArrow && <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180 text-[#002B5B]" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>}
            </button>

            {/* Portal Panel */}
            {open &&
                position &&
                createPortal(
                    <div
                        ref={panelRef}
                        style={{
                            position: "absolute",
                            top: position.top,
                            left: position.left,
                            width,
                        }}
                        className="z-[9999] bg-white shadow-full border border-gray-200 rounded-md mt-1"
                    >
                        {/* Arrow */}
                        <div
                            style={{
                                left: position.arrowLeft,
                            }}
                            className="absolute -top-2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"
                        />

                        {/* Content */}
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default FilterPopover;