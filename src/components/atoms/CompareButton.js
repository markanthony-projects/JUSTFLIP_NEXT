"use client";

import { forwardRef, memo } from "react";
import { IoIosGitCompare } from "react-icons/io";
import clsx from "clsx";

const CompareButton = forwardRef(function CompareButton(
  {
    isActive = false,
    onClick,
    disabled = false,
    className = "",
    children,
    ...props
  },
  ref
) {
  const label = isActive ? "Remove from Compare" : "Add to Compare";

  return (
   <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={label}
      className={clsx(
        "relative cursor-pointer overflow-hidden group h-10 w-[200px] rounded-xl text-xs font-medium flex items-center justify-center",
        "border border-[#002B5B] text-[#002B5B]",
        "transition-all duration-300 ease-out",
        "active:scale-95 hover:scale-[1.03]", 
        isActive &&
          "bg-[#002B5B] text-white border-transparent hover:bg-[#093261]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* ✨ Shine Effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute -left-full top-0 h-full w-1/2 bg-white/20 skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700"></span>
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children || label}

        <IoIosGitCompare
          className={clsx(
            "w-5 h-5 transition-all duration-500",
            "group-hover:rotate-180 group-hover:scale-110", // rotate + bounce
            isActive && "rotate-180"
          )}
        />
      </span>
    </button>
  );
});

export default memo(CompareButton);