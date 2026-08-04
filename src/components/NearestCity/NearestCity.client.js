"use client";

import { useCityStore } from "@/src/stores/city.store";
import { useEffect, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import CitySelectorModal from "./CitySelectorModal";
import { ensureNearestCity } from "./nearest-city.resolver";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function NearestCityClient({
    initialCity,
    placeholder = "Near Me",
    className = "relative w-full max-w-[120px]",
    /* Size and skin come from the caller — the base classes below are layout
       only, so a caller can hand it the header pill without fighting defaults. */
    buttonClassName = "h-[25px] px-2 rounded-md text-xs bg-transparent text-white border border-white/40 active:scale-[0.96]"
}) {
    const activeCity = useCityStore((s) => s.activeCity);
    const [open, setOpen] = useState(false);

    /* ---------------- Resolve active city ---------------- */
    /* Deduped at module level: every mounted instance shares one request. */
    useEffect(() => {
        ensureNearestCity(initialCity);
    }, [initialCity]);

    const label = activeCity?.name || placeholder;

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title={`${label} — tap to change city`}
                aria-haspopup="dialog"
                aria-expanded={open}
                className={cx(
                    "group relative w-full cursor-pointer",
                    "flex items-center gap-1 overflow-hidden",
                    "transition-all duration-200 ease-out",
                    buttonClassName
                )}
            >
                {/* Hover wash. bg-current inherits the button's own text colour,
                    so it works on both the dark header and the white search bar. */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-10"
                />

                <HiOutlineLocationMarker
                    aria-hidden="true"
                    className="relative shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:scale-110"
                />

                <span className="relative truncate">{label}</span>
            </button>

            <CitySelectorModal isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
}
