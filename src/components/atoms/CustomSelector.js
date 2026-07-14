import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiSearch } from "react-icons/fi";

const CustomSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Select Option",
    inputClass = "",
    error,
    searchable = false,
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        )
        : options;

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative" ref={ref}>
            {/* Select Box */}
            <div
                onClick={() => setOpen(!open)}
                className={`${inputClass} cursor-pointer flex justify-between items-center ${error ? "border-rose-400" : ""
                    }`}
            >
                <span className={value ? "text-black" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <FiChevronDown
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-[100] top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Search */}
                    {searchable && (
                        <div className="p-2 border-b flex items-center gap-2">
                            <FiSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-sm outline-none"
                            />
                        </div>
                    )}

                    {/* Options */}
                    <ul className="max-h-[200px] overflow-y-auto scrollbar-modern">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 flex justify-between items-center ${value === opt.value ? "bg-slate-100 font-semibold" : ""
                                        }`}
                                >
                                    <span>{opt.label}</span>
                                    {value === opt.value && (
                                        <FiCheck className="text-green-600" />
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-400">
                                No results found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;