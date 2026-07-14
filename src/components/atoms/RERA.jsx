"use client";
import { memo, useState, useCallback } from "react";
import { AiFillSafetyCertificate } from "react-icons/ai";

const RERA = memo(({ rera, labelClass = "px-2 py-1" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (!rera) return;
        navigator.clipboard.writeText(rera);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [rera]);

    if (!rera) return null;

    return (
        <div className="relative inline-block group">

            {/* Button */}
            <div
                onClick={handleCopy}
                className={`cursor-pointer bg-green-200 flex items-center gap-1 text-xs rounded-md ${labelClass}`}
            // className={`cursor-pointer bg-gradient-to-b from-green-400 to-transparent flex items-center gap-1 text-xs border border-gray-200 rounded-md ${labelClass}`}
            >
                <AiFillSafetyCertificate /> RERA
            </div>

            {/* Popup */}
            <div className="absolute left-0 top-full mt-2 w-max bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50 text-xs
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-200 ease-out">

                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">ID:</span>
                    <span className="text-gray-800">{rera}</span>
                </div>

                <button
                    onClick={handleCopy}
                    className="mt-2 w-full text-left text-blue-600 hover:underline"
                >
                    {copied ? "Copied ✓" : "Copy RERA"}
                </button>
            </div>
        </div>
    );
});

export default RERA;