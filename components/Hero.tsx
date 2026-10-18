"use client";

import React, { useState } from "react";
import { DEMO_PROFILES, DemoProfile } from "@/lib/demo-data";
import { RoastLanguage, RoastSeverity } from "@/lib/types";
import { CartoonCloud, DutchCanalHouses } from "./KarlArtwork";

interface HeroProps {
  onStartGoogleAuth: (language: RoastLanguage, severity: RoastSeverity) => void;
  onSelectDemoProfile: (profile: DemoProfile, language: RoastLanguage, severity: RoastSeverity) => void;
  isLoading: boolean;
  onOpenPrivacy: () => void;
  authError?: string | null;
  onOpenSetupGuide: () => void;
}

export function Hero({
  onStartGoogleAuth,
  onSelectDemoProfile,
  isLoading,
  authError,
  onOpenSetupGuide,
}: HeroProps) {
  const [selectedDemoId, setSelectedDemoId] = useState<string>(DEMO_PROFILES[0].id);
  const [language, setLanguage] = useState<RoastLanguage>("hinglish");
  const [severity, setSeverity] = useState<RoastSeverity>("savage");

  const currentDemo = DEMO_PROFILES.find((p) => p.id === selectedDemoId) || DEMO_PROFILES[0];

  return (
    <div className="relative w-full bg-[#ffe600] text-[#333333] overflow-hidden pt-6 pb-12">
      {/* Cartoon Clouds Floating Across the Sunny Sky */}
      <div className="absolute top-2 left-6 w-28 sm:w-40 pointer-events-none opacity-90">
        <CartoonCloud className="w-full h-auto" />
      </div>
      <div className="absolute top-8 right-8 w-24 sm:w-36 pointer-events-none opacity-90 hidden sm:block">
        <CartoonCloud className="w-full h-auto" />
      </div>
      <div className="absolute top-36 left-1/4 w-20 pointer-events-none opacity-80 hidden md:block">
        <CartoonCloud className="w-full h-auto" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Floating Signage Headline in Changa One */}
        <div className="mb-2 -rotate-1 select-none">
          <span className="inline-block px-3 py-1 bg-[#ffffff] border-2 border-[#333333] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#333333]">
            POP-UP STORYBOOK AUDIT
          </span>
        </div>

        {/* Auth Error Banner if present */}
        {authError && (
          <div className="w-full max-w-md my-3 p-3.5 bg-[#ffffff] border-2 border-[#333333] text-left text-[13px] text-[#333333]">
            <div className="font-bold text-[#ef3b2c] uppercase tracking-wider mb-1">
              {authError === "missing_credentials"
                ? "⚠️ OAuth Keys Required"
                : authError === "youtube_scope_missing"
                ? "⚠️ YouTube Permission Checkbox Required"
                : authError === "state_mismatch"
                ? "⚠️ Session Expired"
                : "⚠️ Authentication Notice"}
            </div>
            <p className="leading-snug">
              {authError === "missing_credentials" ? (
                <>
                  Google Client ID is missing. Read the{" "}
                  <button onClick={onOpenSetupGuide} className="underline font-bold text-[#333333]">
                    setup guide
                  </button>{" "}
                  or pick a <strong>Demo Profile</strong> below!
                </>
              ) : authError === "youtube_scope_missing" ? (
                <>
                  Google signed in, but the <strong>YouTube access checkbox</strong> wasn&apos;t ticked. Make sure to check &quot;View your YouTube account&quot; on the consent screen.
                </>
              ) : (
                `${authError}. You can test instantly with a Demo Profile below.`
              )}
            </p>
          </div>
        )}

        {/* Self-Intro Statement on Yellow */}
        <p className="text-[13px] xs:text-[14px] sm:text-[15px] text-[#333333] max-w-lg font-medium leading-[20px] mb-4 sm:mb-6 px-3">
          A savage dopamine diagnosis grounded in your real YouTube watch history, sub-60s shorts addiction, and late-night subscriptions.
        </p>

        {/* Rising Globe Focal Element with Overprinted Curved White Headlines */}
        <div className="relative w-full max-w-xl mx-auto bg-[#007fff] border-2 border-[#333333] rounded-[48px] sm:rounded-globe pt-8 sm:pt-10 pb-7 sm:pb-9 px-4 xs:px-6 sm:px-8 text-[#ffffff] flex flex-col items-center">
          {/* Massive Stacked Curved Display Headline (White on Azure Globe) */}
          <div className="mb-4 sm:mb-5 select-none text-center">
            <div className="font-display text-[38px] xs:text-[48px] sm:text-[62px] text-[#ffffff] leading-display -rotate-2 tracking-normal">
              HOW COOKED
            </div>
            <div className="font-display text-[36px] xs:text-[46px] sm:text-[59px] text-[#ffffff] leading-display rotate-1 tracking-normal">
              IS YOUR TASTE?
            </div>
          </div>

          <p className="text-[11.5px] sm:text-[13px] text-[#ffffff] max-w-xs sm:max-w-sm text-center opacity-95 mb-4 px-1">
            Pick your language &amp; severity, then roast your YouTube habits.
          </p>

          {/* Config Controls inside Globe (Flat, 0px radius, 2px solid borders) */}
          <div className="w-full max-w-sm bg-[#ffffff] border-2 border-[#333333] p-3 sm:p-4 text-[#333333] text-left space-y-2.5">
            {/* Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <span className="font-bold text-[11px] sm:text-[12px] uppercase tracking-wider">Language:</span>
              <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLanguage("hinglish")}
                  className={`py-1.5 px-2 text-[10.5px] sm:text-[11.5px] font-bold uppercase border-2 border-[#333333] transition-colors text-center cursor-pointer ${
                    language === "hinglish"
                      ? "bg-[#ffe600] text-[#333333]"
                      : "bg-[#ffffff] text-[#333333] hover:bg-[#ffe600]/40"
                  }`}
                >
                  🇮🇳 Desi / Hinglish
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-1.5 px-2 text-[10.5px] sm:text-[11.5px] font-bold uppercase border-2 border-[#333333] transition-colors text-center cursor-pointer ${
                    language === "en"
                      ? "bg-[#ffe600] text-[#333333]"
                      : "bg-[#ffffff] text-[#333333] hover:bg-[#ffe600]/40"
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Severity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pt-2 border-t border-[#333333]/20">
              <span className="font-bold text-[11px] sm:text-[12px] uppercase tracking-wider">Severity:</span>
              <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
                {(["mild", "savage", "nuclear"] as RoastSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 px-1 text-[10px] sm:text-[11px] font-bold uppercase border-2 border-[#333333] transition-colors text-center truncate cursor-pointer ${
                      severity === sev
                        ? "bg-[#ef3b2c] text-[#ffffff]"
                        : "bg-[#ffffff] text-[#333333] hover:bg-gray-100"
                    }`}
                  >
                    {sev === "nuclear" ? "💥 Nuclear" : sev === "savage" ? "🔥 Savage" : "☕ Mild"}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onStartGoogleAuth(language, severity)}
              disabled={isLoading}
              className="w-full mt-1.5 py-3 px-4 bg-[#ffe600] hover:bg-[#ffe600]/90 text-[#333333] border-2 border-[#333333] font-display text-[18px] xs:text-[20px] sm:text-[22px] uppercase tracking-normal transition-transform active:translate-y-0.5 disabled:opacity-50 cursor-pointer text-center"
            >
              {isLoading ? "AUDITING YOUR DOPAMINE..." : "ROAST ME WITH GOOGLE"}
            </button>
          </div>
        </div>

        {/* Hand-Drawn Dutch Canal Houses Anchoring the Globe Base */}
        <div className="w-full max-w-xl mx-auto -mt-2 sm:-mt-4 relative z-0">
          <DutchCanalHouses className="w-full h-auto" />
        </div>

        {/* Demo Profiles Section */}
        <div className="w-full max-w-xl mx-auto mt-6 sm:mt-8 mb-4 text-center">
          <div className="font-display text-[19px] sm:text-[23px] text-[#333333] uppercase mb-1">
            OR TEST A DEMO CHARACTER
          </div>
          <p className="text-[12px] text-[#333333] mb-3.5">
            Instant sample data — no Google login required.
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-left mb-3">
            {DEMO_PROFILES.map((profile) => {
              const isSelected = selectedDemoId === profile.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedDemoId(profile.id)}
                  className={`p-2.5 sm:p-3 border-2 border-[#333333] cursor-pointer transition-all ${
                    isSelected ? "bg-[#ffffff]" : "bg-[#ffffff]/60 hover:bg-[#ffffff]"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-[#ef3b2c] mb-0.5 truncate">
                    {profile.handle}
                  </div>
                  <div className="font-display text-[13px] sm:text-[14px] text-[#333333] leading-snug mb-1 truncate">
                    {profile.name}
                  </div>
                  <p className="text-[10.5px] text-[#333333] line-clamp-2 leading-tight">
                    {profile.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <button
              onClick={() => onSelectDemoProfile(currentDemo, language, severity)}
              disabled={isLoading}
              className="w-full sm:w-auto py-2 px-5 bg-[#333333] text-[#ffffff] hover:bg-[#333333]/90 border-2 border-[#333333] font-bold text-[12px] uppercase tracking-wider transition-transform active:translate-y-0.5 cursor-pointer truncate max-w-full text-center"
            >
              RUN DEMO AS &ldquo;{currentDemo.displayName}&rdquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
