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
    <header className="w-full pt-3 sm:pt-4 pb-2 bg-[#ffe600] z-50 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4">
        {/* Brand Logo Link */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 group select-none no-underline shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ef3b2c] border-2 border-[#333333] rounded-[8px] flex items-center justify-center shadow-[2px_2px_0px_#333333] transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_#333333] active:translate-y-0.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#ffe600] fill-current" stroke="#333333" strokeWidth="1">
              <path d="M12 2C12 2 15 6 15 9C15 10.5 16 11 17 11C19.5 11 21 13.5 21 17C21 21.5 17 22 12 22C7 22 3 21.5 3 17C3 12.5 7.5 8 9.5 6C9.5 8.5 10.5 10 12 10C12.8 10 13 9 13 8C13 5.5 12 2 12 2Z" />
              <polygon points="11,14 11,18 15,16" fill="#ffffff" stroke="#333333" strokeWidth="0.8"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display text-[17px] sm:text-[20px] text-[#333333] uppercase leading-none tracking-tight group-hover:text-[#ef3b2c] transition-colors">
              YOUTUBE ROAST
            </span>
            <span className="text-[9px] font-bold text-[#333333]/70 uppercase tracking-wider leading-none mt-0.5">
              AI Dopamine Teardown
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center font-nav max-w-full overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap gap-0.5 sm:gap-1">
          {/* HOME */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`relative block py-1.5 sm:py-2 px-2 xs:px-2.5 sm:px-4 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
              activeTab === "HOME" ? "karl-nav-active" : ""
            }`}
          >
            HOME
          </Link>

          {/* HOW IT WORKS */}
          <Link
            href="/#how-it-works"
            onClick={handleHowItWorksClick}
            className={`relative block py-1.5 sm:py-2 px-2 xs:px-2.5 sm:px-4 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
              activeTab === "HOW IT WORKS" ? "karl-nav-active" : ""
            }`}
          >
            HOW IT WORKS
          </Link>

          {/* DUEL / PLAY */}
          <Link
            href="/duel"
            onClick={() => setActiveTab("PLAY")}
            className={`relative block py-1.5 sm:py-2 px-2 xs:px-2.5 sm:px-4 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 ${
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
            className={`relative block py-1.5 sm:py-2 px-2 xs:px-2.5 sm:px-4 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#333333] uppercase no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 bg-transparent border-0 cursor-pointer ${
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
              className={`relative block py-1.5 sm:py-2 px-2 xs:px-2.5 sm:px-4 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-[#ef3b2c] uppercase no-underline tracking-normal select-none whitespace-nowrap transition-opacity hover:opacity-75 bg-transparent border-0 cursor-pointer ${
                activeTab === "RESET" ? "karl-nav-active" : ""
              }`}
            >
              RESET
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
