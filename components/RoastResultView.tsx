"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { RoastResult } from "@/lib/types";
import { DopaminePrescription } from "./DopaminePrescription";
import { DuelChallengeModal } from "./DuelChallengeModal";

interface RoastResultViewProps {
  result: RoastResult;
  onRoastAgain: () => void;
  onOpenShareModal: () => void;
  onOpenDelete: () => void;
}

export function RoastResultView({
  result,
  onRoastAgain,
  onOpenShareModal,
  onOpenDelete,
}: RoastResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const { facts, roast } = result;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ef3b2c", "#007fff", "#ffe600", "#333333"],
      });
    } catch {
      // ignore
    }
  }, []);

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Terminally Cooked";
    if (score >= 70) return "Chronic Doomscroller";
    if (score >= 50) return "Moderate Brainrot";
    if (score >= 30) return "Mild Attention Span";
    return "Surprisingly Sane";
  };

  const handleCopyRoast = () => {
    const textToCopy = `🔥 YouTube Roast for ${result.userDisplayName || "Me"} 🔥\n\n` +
      `🧠 Brainrot Score: ${facts.brainrotScore}/100 (${getScoreLabel(facts.brainrotScore)})\n` +
      `🏷️ Archetype: "${roast.archetype}"\n` +
      `💬 "${roast.one_line_description}"\n\n` +
      `🚩 Red Flags:\n` +
      roast.red_flags.map((rf) => `• ${rf}`).join("\n") +
      `\n\nGet roasted at: ${typeof window !== "undefined" ? window.location.origin : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#ffe600] text-[#333333] py-5 sm:py-10 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Header Card (Flat 0px card, 2px solid charcoal border) */}
        <div className="p-4 xs:p-5 sm:p-8 bg-[#ffffff] border-2 border-[#333333]">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 sm:gap-6">
            {/* User & Archetype Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffe600] border-2 border-[#333333] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
                <span className="truncate max-w-[180px] xs:max-w-none">{result.userDisplayName || "Anonymous"}</span>
                {result.isDemo && <span className="text-[#ef3b2c] font-black">(Demo)</span>}
                {result.language === "hinglish" && (
                  <span className="text-[#007fff] font-black">
                    Desi Mode
                  </span>
                )}
              </div>

              <h1 className="font-display text-[26px] xs:text-[32px] sm:text-[46px] md:text-[52px] leading-heading text-[#333333] tracking-tight mb-2">
                &ldquo;{roast.archetype}&rdquo;
              </h1>

              <p className="text-[13px] sm:text-[16px] text-[#333333] font-medium italic border-l-4 border-[#ef3b2c] pl-3 my-2 leading-relaxed text-balance">
                &ldquo;{roast.one_line_description}&rdquo;
              </p>
            </div>

            {/* Brainrot Score Globe (1440px border-radius, pure #007fff) */}
            <div className="flex flex-col items-center justify-center shrink-0 my-1 md:my-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-globe bg-[#007fff] border-2 border-[#333333] flex flex-col items-center justify-center text-center p-2.5 sm:p-3 text-[#ffffff]">
                <div className="font-display text-[38px] sm:text-[52px] text-[#ffffff] leading-none">
                  {facts.brainrotScore}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#ffffff]/90 mt-0.5">
                  BRAINROT
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-center leading-tight px-1 mt-0.5 max-w-[90%] text-[#ffffff] truncate">
                  {getScoreLabel(facts.brainrotScore)}
                </div>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase text-[#333333] mt-2 px-2.5 py-1 bg-[#ffe600] border-2 border-[#333333] text-center">
                Scale: 0 (Zen) to 100 (Cooked)
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar (Responsive Grid on Mobile) */}
          <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t-2 border-[#333333] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenShareModal}
                className="py-2.5 px-3 bg-[#ef3b2c] hover:bg-[#ef3b2c]/90 text-[#ffffff] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center"
              >
                📸 Share
              </button>

              <button
                onClick={() => setShowDuelModal(true)}
                className="py-2.5 px-3 bg-[#007fff] hover:bg-[#007fff]/90 text-[#ffffff] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center"
              >
                ⚔️ Duel
              </button>

              <button
                onClick={handleCopyRoast}
                className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center truncate"
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>

              <button
                onClick={onRoastAgain}
                className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center"
              >
                🔄 Again
              </button>
            </div>

            <button
              onClick={onOpenDelete}
              className="py-2 px-3 text-[11px] sm:text-[12px] font-bold uppercase text-[#ef3b2c] bg-[#ffffff] hover:bg-red-50 border-2 border-[#ef3b2c] transition-colors w-full sm:w-auto text-center cursor-pointer"
            >
              🗑️ Delete Data
            </button>
          </div>
        </div>

        {/* Main Grid: Roast Report & Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Left Column (2 cols): Roast Report & Red Flags */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Detailed Roast Report */}
            <div className="p-4 xs:p-5 sm:p-7 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[20px] xs:text-[22px] sm:text-[26px] text-[#333333] uppercase mb-3 sm:mb-4">
                THE SAVAGE BREAKDOWN
              </div>

              <div className="text-[#333333] text-[13px] sm:text-[15px] leading-relaxed space-y-3.5 sm:space-y-4">
                {roast.roast_report.split("\n\n").map((para, i) => (
                  <p key={i}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Brainrot analysis diagnosis */}
              {roast.brainrot_analysis && (
                <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 bg-[#ffe600] border-2 border-[#333333] text-[13px] sm:text-[14px] text-[#333333]">
                  <span className="font-bold uppercase tracking-wider block mb-1 text-[11px] sm:text-[12px]">
                    🧠 Clinical Brainrot Diagnosis:
                  </span>
                  {roast.brainrot_analysis}
                </div>
              )}
            </div>

            {/* Red Flags List */}
            <div className="p-4 xs:p-5 sm:p-7 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[20px] xs:text-[22px] sm:text-[26px] text-[#ef3b2c] uppercase mb-3 sm:mb-4">
                RED FLAGS DETECTED
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {roast.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col xs:flex-row xs:items-start gap-1.5 xs:gap-3 p-2.5 sm:p-3 bg-[#ffffff] border-2 border-[#333333] text-[13px] sm:text-[14px] text-[#333333]"
                  >
                    <span className="text-[10px] sm:text-[11px] font-black text-[#ffffff] px-2 py-0.5 bg-[#ef3b2c] border border-[#333333] shrink-0 self-start">
                      FLAG #{idx + 1}
                    </span>
                    <span className="leading-snug">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Habits Exposed */}
            {roast.habits_exposed && roast.habits_exposed.length > 0 && (
              <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
                <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase mb-2.5 sm:mb-3">
                  CAUGHT IN 4K: VIEWING HABITS
                </div>
                <ul className="space-y-2">
                  {roast.habits_exposed.map((habit, idx) => (
                    <li key={idx} className="text-[13px] sm:text-[14px] text-[#333333] flex items-start gap-2">
                      <span className="text-[#ef3b2c] font-bold shrink-0">•</span>
                      <span className="leading-snug">{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (1 col): The Raw Data & Numbers */}
          <div className="space-y-5 sm:space-y-6">
            {/* Key Facts Summary */}
            <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[20px] sm:text-[24px] text-[#333333] uppercase mb-4">
                YOUR REAL NUMBERS
              </div>

              {/* Shorts vs Longform Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[12px] font-bold uppercase mb-1.5">
                  <span className="text-[#ef3b2c]">Shorts ({facts.shortsPercentage}%)</span>
                  <span className="text-[#007fff]">Longform ({100 - facts.shortsPercentage}%)</span>
                </div>
                <div className="w-full h-4 bg-[#ffffff] border-2 border-[#333333] overflow-hidden flex">
                  <div
                    className="h-full bg-[#ef3b2c]"
                    style={{ width: `${facts.shortsPercentage}%` }}
                  />
                  <div
                    className="h-full bg-[#007fff]"
                    style={{ width: `${100 - facts.shortsPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#333333] mt-1.5 leading-snug">
                  {facts.shortsPercentage > 50
                    ? "⚠️ Over 50% short-form (<60s) content"
                    : "Balanced video length distribution"}
                </p>
              </div>

              {/* Educational vs Entertainment vs Other */}
              <div className="mb-5">
                <div className="flex justify-between text-[12px] font-bold uppercase mb-1.5">
                  <span className="text-[#10b981]">Edu ({facts.educationalPercentage}%)</span>
                  <span className="text-[#8b5cf6]">Ent ({facts.entertainmentPercentage}%)</span>
                  {Math.max(0, 100 - facts.educationalPercentage - facts.entertainmentPercentage) > 0 && (
                    <span className="text-[#64748b]">
                      Other ({Math.max(0, 100 - facts.educationalPercentage - facts.entertainmentPercentage)}%)
                    </span>
                  )}
                </div>
                <div className="w-full h-4 bg-[#ffffff] border-2 border-[#333333] overflow-hidden flex">
                  <div
                    className="h-full bg-[#10b981]"
                    style={{ width: `${facts.educationalPercentage}%` }}
                  />
                  <div
                    className="h-full bg-[#8b5cf6]"
                    style={{ width: `${facts.entertainmentPercentage}%` }}
                  />
                  {Math.max(0, 100 - facts.educationalPercentage - facts.entertainmentPercentage) > 0 && (
                    <div
                      className="h-full bg-[#64748b]"
                      style={{
                        width: `${Math.max(0, 100 - facts.educationalPercentage - facts.entertainmentPercentage)}%`,
                      }}
                    />
                  )}
                </div>
                <p className="text-[11px] text-[#333333] mt-1.5 leading-snug text-balance">
                  {facts.educationalPercentage > facts.entertainmentPercentage
                    ? "📚 Strong preference for educational content"
                    : "🍿 High entertainment & pop-culture intake"}
                </p>
              </div>

              {/* Stats row - Strictly Aligned Baselines in Storybook Karl Style */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-[#333333]">
                <div className="p-3 bg-[#ffe600] border-2 border-[#333333] flex flex-col justify-between min-h-[88px]">
                  <div className="text-[11px] font-bold text-[#333333] uppercase tracking-wider leading-tight min-h-[28px] flex items-start">
                    Videos Studied
                  </div>
                  <div className="font-display text-[32px] text-[#333333] leading-none mt-auto pt-1">
                    {facts.totalVideosAnalyzed}
                  </div>
                </div>

                <div className="p-3 bg-[#ffe600] border-2 border-[#333333] flex flex-col justify-between min-h-[88px]">
                  <div className="text-[11px] font-bold text-[#333333] uppercase tracking-wider leading-tight min-h-[28px] flex items-start">
                    Subscriptions
                  </div>
                  <div className="font-display text-[32px] text-[#333333] leading-none mt-auto pt-1">
                    {facts.totalSubscriptions}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Addicted Channels */}
            <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase mb-3 sm:mb-4">
                MOST WATCHED CREATORS
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {facts.topChannels.slice(0, 5).map((channel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 sm:p-2.5 bg-[#ffffff] border-2 border-[#333333] text-[12px] sm:text-[13px]"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 truncate pr-2">
                      <span className="font-black text-[#ef3b2c] w-4 sm:w-5 text-[11px] sm:text-[13px]">#{i + 1}</span>
                      <span className="font-bold text-[#333333] truncate">{channel.name}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 bg-[#ffe600] border border-[#333333] text-[#333333] shrink-0">
                      {channel.count} vids
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            {facts.categoryDistribution.length > 0 && (
              <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
                <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase mb-2.5 sm:mb-3">
                  CATEGORIES
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {facts.categoryDistribution.slice(0, 5).map((cat, i) => (
                    <div
                      key={i}
                      className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase bg-[#ffe600] border-2 border-[#333333] text-[#333333]"
                    >
                      {cat.category} ({cat.percentage}%)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Teaser Component */}
        <DopaminePrescription
          prescription={roast.prescription}
          patientName={result.userDisplayName}
          brainrotScore={facts.brainrotScore}
        />
      </div>

      {/* Duel Challenge Modal */}
      <DuelChallengeModal
        isOpen={showDuelModal}
        onClose={() => setShowDuelModal(false)}
        result={result}
      />
    </div>
  );
}
