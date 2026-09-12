"use client";

import React, { memo, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { Project } from "@/src/types";
import clsx from "clsx";
import { useFavourite } from "@/src/hooks/useFavourite";
import { useAuthStore } from "@/src/stores/auth.store";

export interface FavouriteButtonProps {
  project: Project;
  className?: string;
  iconClass?: string;
  showLabel?: boolean;
  variant?: "icon" | string;
  onAuthRequired?: () => void;
}

function FavouriteButton({
  project,
  className = "",
  iconClass = "",
  showLabel = false,
  variant = "icon",
  onAuthRequired,
}: FavouriteButtonProps) {

  const {user} = useAuthStore();

  const { isFavourite, toggleFavourite } = useFavourite(project);
  const [animate, setAnimate] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const res = await toggleFavourite(e);

    if (res?.requiresAuth && onAuthRequired) {
      return onAuthRequired();
    }

    if (!isFavourite) { 
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  };

  return (
    <button
      type="button"
      key={user?.id}
      aria-pressed={isFavourite}
      aria-label={isFavourite ? "Remove from saved properties" : "Save property"}
      title={isFavourite ? "Remove from saved properties" : "Save property"}
      onClick={handleClick}
      className={clsx(
        "group relative flex items-center justify-center select-none transition-all duration-300 ease-out active:scale-90",
        variant === "button"
          ? "gap-1.5 sm:gap-2 rounded-full border border-gray-200/80 bg-white/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-xs hover:border-red-100 hover:bg-red-50/50 hover:text-red-600"
          : "rounded-full p-1.5 sm:p-2 bg-white/90 backdrop-blur-md border border-white/80 shadow-sm hover:scale-101",
        isFavourite && variant === "button" && "border-red-200 bg-red-50/60 text-red-600",
        className
      )}
    >
      {/* 💥 PARTICLE BURST */}
      {animate && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <style>{`
            @keyframes fav-burst {
              0% { opacity: 1; transform: translate(0, 0) scale(1); }
              25% { opacity: 0.8; transform: translate(10px, -10px) scale(0.8); }
              50% { opacity: 0.6; transform: translate(15px, -15px) scale(0.6); }
              75% { opacity: 0.4; transform: translate(20px, -20px) scale(0.4); }
              100% { opacity: 0; transform: translate(30px, -30px) scale(0.2); }
            }
          `}</style>
          {[...Array(8)].map((_, i) => (  
            <span
              key={i}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
                animation: "fav-burst 0.8s ease-out forwards",
              }}
            />
          ))}
        </span>
      )}

      {/* ❤️ HEART */}
      <span
        className={clsx(
          "relative flex items-center justify-center transition-all duration-300 ease-spring",
          animate && "scale-105",
          iconClass
        )}
      >
        {/* Soft Ambient Glow when Favourited */}
        {isFavourite && (
          <span className="absolute inset-0 rounded-full bg-red-500/20 blur-sm scale-105 transition-opacity" />
        )}

        {isFavourite ? (
          <IoIosHeart className= "relative z-10 text-[16px] sm:text-xl text-red-500 drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)] transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <IoIosHeartEmpty color="red" className="relative z-10 text-[16px] sm:text-xl text-gray-400 transition-colors duration-200 " />
        )}
      </span>

      {/* Visually hidden text for screen readers to guarantee accessible name */}
      <span className="sr-only">
        {isFavourite ? "Remove from saved properties" : "Save property"}
      </span>

      {showLabel && (
        <span className="relative z-10 font-medium tracking-tight text-[11px] sm:text-xs">{isFavourite ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

export default memo(FavouriteButton);