import React from "react";

const SimpleButton = ({ label = "Click Me", onClick, type = "button", loading = false, disabled = false, className = "", iconStart = false, }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`group relative w-full flex justify-center items-center py-3.5 px-4 border-10 border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className || "bg-[#002B5B] hover:bg-[#001D3D]"}`}
        >
            {loading ? "Loading..." : label}

            {!loading && iconStart && (
                <span className="absolute right-4 group-hover:translate-x-1 transition-transform">
                    →
                </span>
            )}
        </button>
    );
};

export default SimpleButton;