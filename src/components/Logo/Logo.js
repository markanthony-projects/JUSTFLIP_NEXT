"use client"
import Link from "next/link";
import React from "react";
import logo from "@/public/assets/Justfliplogo.svg";
import Image from "next/image";

const Logo = ({ className = "w-26 h-10" }) => {
  return (
    <Link href="/" aria-label="Go to homepage" className="inline-block">
      <div className={`relative ${className}`}>
        <Image
          src={logo}
          alt="Justflip Logo"
          fill
          className="object-contain"
          priority={true}
        />
      </div>
    </Link>
  );
};

export default Logo;