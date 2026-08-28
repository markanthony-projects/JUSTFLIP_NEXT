"use client"
import Link from "next/link";
import React from "react";
import logo from "@/public/assets/Justfliplogo.svg";
import Image from "next/image";

/**
 * Scales with the viewport by default (80 → 96 → 112px wide, keeping the
 * artwork's ~2.6:1 ratio). Pass `className` only where a deliberately different
 * size is needed, e.g. the auth pages.
 *
 * The wrapper must carry a real height — `next/image` with `fill` collapses to
 * zero against `h-auto`.
 */
export interface LogoProps {
  className?: string;
  priority?: boolean;
}

const Logo = ({
  className = "w-20 h-7.5 sm:w-24 sm:h-9 lg:w-28 lg:h-10.5",
  priority = true,
}: LogoProps) => {
  return (
    <Link href="/" aria-label="Go to homepage" className="inline-block shrink-0">
      <div className={`relative ${className}`}>
        <Image
          src={logo}
          alt="Justflip Logo"
          fill
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
          className="object-contain"
          priority={priority}
          fetchPriority="high"
        />
      </div>
    </Link>
  );
};

export default Logo;
