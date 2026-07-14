"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------
   Utility
-------------------------------------------------- */
const cx = (...classes) => classes.filter(Boolean).join(" ");

/* -------------------------------------------------
   Base Wrapper (Label + Error)
-------------------------------------------------- */
const FieldWrapper = ({ label, error, required, children }) => {
    return (
        <div className="flex flex-col gap-0.5 w-full">
            {label && (
                <label className="text-xs font-medium text-black">
                    {label}
                    {required && <span className="text-red-700 ml-1">*</span>}
                </label>
            )}

            {children}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

/* -------------------------------------------------
   Shared Base Input Styles
-------------------------------------------------- */
const baseInputStyles = `
    bg-white/50 h-10 px-3 rounded-md
    text-black text-sm outline-none transition
    border border-transparent
    focus:border-blue-500 focus:ring-0.5 focus:ring-blue-500
`;

/* -------------------------------------------------
   Text Input
-------------------------------------------------- */
export const TextField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    required,
    disabled,
    className,
    inputClassName,
}) => {
    return (
        <FieldWrapper label={label} error={error} required={required}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cx(
                    baseInputStyles,
                    disabled && "bg-gray-100 cursor-not-allowed text-xs",
                    error && "border-red-500 focus:ring-red-500",
                    inputClassName,
                    className
                )}
            />
        </FieldWrapper>
    );
};

/* -------------------------------------------------
   TextArea
-------------------------------------------------- */
export const TextArea = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
    required,
    disabled,
    className,
}) => {
    return (
        <FieldWrapper label={label} error={error} required={required}>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cx(
                    "bg-white/50 px-3 py-2 rounded-md text-black text-sm resize-none outline-none transition",
                    "border border-transparent focus:border-blue-500 focus:ring-0.5 focus:ring-blue-500",
                    disabled && "bg-gray-100 cursor-not-allowed",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
            />
        </FieldWrapper>
    );
};

/* -------------------------------------------------
   Dropdown / Select
-------------------------------------------------- */
export const Dropdown = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select option",
    error,
    required,
    disabled,
    className,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = options.find((o) => o.value === value);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <FieldWrapper label={label} error={error} required={required}>
            <div ref={ref} className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpen((v) => !v)}
                    className={cx(
                        baseInputStyles,
                        "w-full flex items-center justify-between cursor-pointer",
                        disabled && "bg-gray-100 cursor-not-allowed",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                >
                    <span className={cx("truncate", !selected && "text-gray-400")}>
                        {selected ? selected.label : placeholder}
                    </span>

                    {/* Chevron */}
                    <svg
                        className={cx("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                    className={cx(
                        "absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg",
                        "border border-gray-200",
                        "origin-top transition-all duration-150 ease-out",
                        open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
                    )}
                >
                    <ul className="max-h-60 overflow-auto py-1 text-sm">
                        {options.map((opt) => {
                            const active = opt.value === value;

                            return (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onChange({ target: { value: opt.value } });
                                        setOpen(false);
                                    }}
                                    className={cx(
                                        "mx-1 rounded-md px-2 py-2 cursor-pointer transition-colors text-[10px] md:text-sm",
                                        active ? "bg-black/15 text-blue-600 font-medium" : "hover:bg-gray-100 text-gray-700"
                                    )}
                                >
                                    {opt.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </FieldWrapper>
    );
};

/* -------------------------------------------------
   Checkbox
-------------------------------------------------- */
export const Checkbox = ({
    label,
    checked,
    onChange,
    disabled,
    error,
    required,
    className,
}) => {
    return (
        <FieldWrapper label={label} error={error} required={required}>
            <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={cx(
                        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                        disabled && "cursor-not-allowed",
                        className
                    )}
                />
                <span>{label}</span>
            </label>
        </FieldWrapper>
    );
};

/* -------------------------------------------------
   Radio Group
-------------------------------------------------- */
export const RadioGroup = ({
    label,
    value,
    onChange,
    options = [],
    error,
    required,
}) => {
    return (
        <FieldWrapper label={label} error={error} required={required}>
            <div className="flex flex-col gap-2">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className="flex items-center gap-2 text-sm text-black cursor-pointer"
                    >
                        <input
                            type="radio"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={onChange}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        {opt.label}
                    </label>
                ))}
            </div>
        </FieldWrapper>
    );
};
