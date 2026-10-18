"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onOpenPrivacy: () => void;
  onOpenDelete: () => void;
  hasActiveResult?: boolean;
  onNavigateHowItWorks?: () => void;
  onGoHome?: () => void;
}

export function Navbar({
  onOpenPrivacy,
  onOpenDelete,
  hasActiveResult,
  onNavigateHowItWorks,
  onGoHome,
}: NavbarProps) {
  const [activeTab, setActiveTab] = useState<string>("HOME");

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveTab("HOME");
    if (onGoHome) {
      e.preventDefault();
      onGoHome();
      return;
    }
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveTab("HOW IT WORKS");
    if (onNavigateHowItWorks) {
      e.preventDefault();
      onNavigateHowItWorks();
      return;
    }
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("how-it-works");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#how-it-works");
      }
    }
  };

  return (
    <nav className="w-full pt-3 sm:pt-4 pb-2 flex items-center justify-center bg-[#ffe600] z-50 px-1">
      <div className="flex items-center justify-center font-nav max-w-full overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap gap-0.5 sm:gap-0">
        {/* HOME */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className={`relative block py-2 px-2 xs:px-3 sm:px-4 md:px-5 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
            activeTab === "HOME" ? "karl-nav-active" : ""
          }`}
        >
          HOME
        </Link>

        {/* HOW IT WORKS */}
        <Link
          href="/#how-it-works"
          onClick={handleHowItWorksClick}
          className={`relative block py-2 px-2 xs:px-3 sm:px-4 md:px-5 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
            activeTab === "HOW IT WORKS" ? "karl-nav-active" : ""
          }`}
        >
          HOW IT WORKS
        </Link>

        {/* DUEL / PLAY */}
        <Link
          href="/duel"
          onClick={() => setActiveTab("PLAY")}
          className={`relative block py-2 px-2 xs:px-3 sm:px-4 md:px-5 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
            activeTab === "PLAY" ? "karl-nav-active" : ""
          }`}
        >
          PLAY
        </Link>


        {/* PRIVACY / CONTACT */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("PRIVACY");
            onOpenPrivacy();
          }}
          className={`relative block py-2 px-2 xs:px-3 sm:px-4 md:px-5 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] uppercase no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 bg-transparent border-0 cursor-pointer ${
            activeTab === "PRIVACY" ? "karl-nav-active" : ""
          }`}
        >
          PRIVACY
        </button>

        {/* DELETE MY DATA (if active result) */}
        {hasActiveResult && (
          <button
            type="button"
            onClick={() => {
              setActiveTab("RESET");
              onOpenDelete();
            }}
            className={`relative block py-2 px-2 xs:px-3 sm:px-4 md:px-5 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#ef3b2c] uppercase no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 bg-transparent border-0 cursor-pointer ${
              activeTab === "RESET" ? "karl-nav-active" : ""
            }`}
          >
            RESET
          </button>
        )}
      </div>
    </nav>
  );
}
