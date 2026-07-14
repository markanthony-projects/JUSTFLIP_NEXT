"use client";

import React, { memo, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import clsx from "clsx";
import { useFavourite } from "@/src/hooks/useFavourite";

function FavouriteButton({
  project,
  className = "",
  iconClass = "",
  showLabel = false,
  variant = "icon",
  onAuthRequired,
}) {
  const { isFavourite, toggleFavourite } = useFavourite(project);
  const [animate, setAnimate] = useState(false);

  const handleClick = async (e) => {
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
          {[...Array(8)].map((_, i) => (
            <span key={i} className={`fav-particle fav-p-${i}`} />
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
          <IoIosHeartEmpty className="text-lg" />
        )}
      </span>

      {showLabel && (
        <span>{isFavourite ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

export default memo(FavouriteButton);