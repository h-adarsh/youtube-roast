"use client";

import React, { useEffect, useState } from "react";
import { CartoonCloud } from "./KarlArtwork";

const FUNNY_MESSAGES = [
  "Connecting to YouTube API with read-only access...",
  "Infiltrating your 2:00 AM watch history...",
  "Counting how many hours you spent watching Subway Surfers splitscreens...",
  "Calculating your Shorts-to-Longform ratio...",
  "Cataloging videos in your 'Watch Later' graveyard...",
  "Sending sanitized facts to Gemini for maximum emotional damage...",
  "Computing deterministic Brainrot Score...",
  "Generating red flags and finalizing your roast...",
];

export function LoadingRoast() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center max-w-xl mx-auto bg-[#ffe600] text-[#333333] relative">
      <div className="w-28 mb-4">
        <CartoonCloud className="w-full h-auto" />
      </div>

      {/* Blue Globe Loading Emblem (1440px border-radius) */}
      <div className="w-24 h-24 rounded-globe bg-[#007fff] border-2 border-[#333333] flex items-center justify-center text-[#ffffff] font-display text-[32px] mb-6">
        ⏳
      </div>

      <div className="p-2 border-2 border-[#333333] bg-[#ffffff] text-[11px] font-bold uppercase tracking-wider mb-4">
        STEP {stepIndex + 1} OF {FUNNY_MESSAGES.length}
      </div>

      <h3 className="font-display text-[22px] sm:text-[28px] text-[#333333] leading-snug min-h-[70px] flex items-center justify-center max-w-md">
        &ldquo;{FUNNY_MESSAGES[stepIndex]}&rdquo;
      </h3>

      {/* Storybook Progress Bar: 0px radius, 2px solid border, flat #007fff fill */}
      <div className="w-full bg-[#ffffff] border-2 border-[#333333] h-4 mt-6 overflow-hidden">
        <div
          className="h-full bg-[#007fff] transition-all duration-500"
          style={{ width: `${Math.min(100, ((stepIndex + 1) / FUNNY_MESSAGES.length) * 100)}%` }}
        />
      </div>

      <p className="text-[12px] text-[#333333] mt-4 font-bold uppercase tracking-wider">
        Hang tight — preparing your storybook roast...
      </p>
    </div>
  );
}
