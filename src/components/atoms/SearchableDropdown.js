import React, { useRef, useEffect } from "react";

const SearchDropdown = ({
    value,
    onChange,
    suggestions = [],
    onSelect,
    placeholder = "Search...",
    showSuggestions,
    setShowSuggestions,
    inputClass = "",
    error,
    displayKey = "name",
    subDisplayKey = "city",
    selected,
    disabled = false,
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions]);

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                type="text"
                placeholder={disabled ? "Select Previous Option first..." : placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => !disabled && suggestions.length > 0 && setShowSuggestions(true)}
                disabled={disabled}
                className={`${inputClass} ${error ? "border-rose-400" : ""} ${disabled ? "bg-slate-100 opacity-60 cursor-not-allowed border-slate-200" : ""}`}
            />


            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="max-h-[200px] overflow-y-auto scrollbar-modern">
                        {suggestions.map((item, idx) => (
                            <li
                                key={item?.id ?? item.value ?? idx}
                                onClick={() => {
                                    onSelect(item);
                                    setShowSuggestions(false);
                                }}
                                className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002B5B] cursor-pointer border-b border-slate-100 last:border-0 transition-colors flex justify-between"
                            >
                                <span className="font-bold">{item[displayKey]}</span>
                                <span className="text-[10px] text-slate-400">
                                    {item[subDisplayKey]?.name || ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {value && !showSuggestions && selected && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    Selected
                </span>
            )}
        </div>
    );
};

export default SearchDropdown;