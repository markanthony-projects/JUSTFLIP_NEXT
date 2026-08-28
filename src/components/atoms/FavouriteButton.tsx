"use client";

import React, { memo, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { Project } from "@/src/types";
import clsx from "clsx";
import { useFavourite } from "@/src/hooks/useFavourite";

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
      aria-pressed={isFavourite}
      aria-label={isFavourite ? "Remove from saved properties" : "Save property"}
      title={isFavourite ? "Remove from saved properties" : "Save property"}
      onClick={handleClick}
      className={clsx(
        "relative flex cursor-pointer items-center justify-center gap-1 transition",
        variant === "button" &&
          "px-3 py-1 rounded-md border text-sm hover:bg-gray-50",
        className
      )}
    >
      {/* 💥 PARTICLE BURST */}
      {animate && (
        <span className="absolute inset-0 pointer-events-none">
          <style>{`
            @keyframes fav-burst {
              0% { opacity: 1; transform: translate(0, 0) scale(1); }
              100% { opacity: 0; transform: translate(30px, -30px) scale(0.5); }
            }
          `}</style>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
                animation: "fav-burst 0.6s ease-out forwards",
              }}
            />
          ))}
        </span>
      )}

      {/* ❤️ HEART */}
      <span
        className={clsx(
          "transition-transform duration-300",
          animate && "scale-125",
          iconClass
        )}
      >
        {isFavourite ? (
          <IoIosHeart className="text-red-500 text-lg" />
        ) : (
          <IoIosHeartEmpty color="red" className="text-lg" />
        )}
      </span>

      {/* Visually hidden text for screen readers to guarantee accessible name */}
      <span className="sr-only">
        {isFavourite ? "Remove from saved properties" : "Save property"}
      </span>

      {showLabel && (
        <span>{isFavourite ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

export default memo(FavouriteButton);