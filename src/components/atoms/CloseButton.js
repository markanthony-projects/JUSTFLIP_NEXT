"use client";

import { forwardRef } from "react";
import { IoClose } from "react-icons/io5";

const Button = forwardRef(function Button({ onClick }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label="Remove from compare"
      className="
        group absolute top-2 right-2 cursor-pointer
        flex items-center justify-center
        w-7 h-7 rounded-full

        bg-white/80 backdrop-blur-md
        border border-gray-200/70

        text-gray-500
        shadow-sm

        transition-all duration-200 ease-out

        hover:bg-red-500 hover:text-white hover:border-red-500
        hover:shadow-md hover:scale-110

        active:scale-95 active:shadow-sm

        focus:outline-none focus:ring-2 focus:ring-red-400/40
      "
    >
      <IoClose
        className="
          w-4 h-4
          transition-transform duration-200 ease-out
          group-hover:rotate-90
        "
      />
    </button>
  );
});

export default Button;