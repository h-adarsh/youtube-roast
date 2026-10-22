"use client";

import React, { useRef, useState } from "react";
import { X, Download, Copy, Share2, Smartphone, Square } from "lucide-react";
import { toPng } from "html-to-image";
import { RoastResult } from "@/lib/types";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RoastResult;
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Terminally Cooked";
  if (score >= 70) return "Chronic Dopamine Sepsis";
  if (score >= 50) return "Moderate Brainrot";
  if (score >= 30) return "Mild Fatigue";
  return "Ascetic Zen";
}

export function ShareCardModal({ isOpen, onClose, result }: ShareCardModalProps) {
  const [aspectRatio, setAspectRatio] = useState<"story" | "square">("story");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const { facts, roast } = result;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const link = document.createElement("a");
      link.download = `youtube-roast-${aspectRatio}-${result.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate share image:", err);
      alert("Unable to generate image directly. You can take a screenshot or copy the text!");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?roast_id=${result.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareTwitter = () => {
    const tweetText = `My YouTube attention span got roasted: Brainrot Score ${facts.brainrotScore}/100 ("${roast.archetype}") 🔥\n\n"${roast.one_line_description}"\n\nFind out how cooked you are:`;
    const shareUrl = `${window.location.origin}/?roast_id=${result.id}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#333333]/70 overflow-y-auto">
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] bg-[#ffe600] border-2 border-[#333333] shadow-[6px_6px_0px_#333333] p-4 sm:p-5 flex flex-col my-auto max-h-[96dvh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#333333] shrink-0">
          <h3 className="font-display text-[20px] text-[#333333] uppercase">
            SHARE RESULT CARD
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-[#ffffff] border-2 border-[#333333] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#333333]" />
          </button>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center justify-center gap-2 my-3 shrink-0">
          <button
            type="button"
            onClick={() => setAspectRatio("story")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase border-2 border-[#333333] transition-all flex items-center gap-1.5 cursor-pointer ${
              aspectRatio === "story"
                ? "bg-[#007fff] text-[#ffffff] shadow-[2px_2px_0px_#333333]"
                : "bg-[#ffffff] text-[#333333] hover:bg-gray-50"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Story (9:16)</span>
          </button>

          <button
            type="button"
            onClick={() => setAspectRatio("square")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase border-2 border-[#333333] transition-all flex items-center gap-1.5 cursor-pointer ${
              aspectRatio === "square"
                ? "bg-[#007fff] text-[#ffffff] shadow-[2px_2px_0px_#333333]"
                : "bg-[#ffffff] text-[#333333] hover:bg-gray-50"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>Square (1:1)</span>
          </button>
        </div>

        {/* Card Canvas Container with smooth scroll for small screens */}
        <div className="flex-1 flex items-center justify-center py-2 px-1 overflow-y-auto min-h-0">
          {aspectRatio === "story" ? (
            /* 9:16 Vertical Story Card in Karl Style */
            <div
              ref={cardRef}
              className="w-[290px] sm:w-[315px] h-[520px] sm:h-[555px] p-3.5 sm:p-4 bg-[#ffe600] border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative overflow-hidden flex flex-col justify-between text-left shrink-0 text-[#333333] gap-2"
            >
              {/* Top Watermark */}
              <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#333333] shrink-0">
                <span className="font-display text-[15px] sm:text-[16px] uppercase tracking-normal">
                  YOUTUBE ROAST
                </span>
                <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 bg-[#ffffff] border border-[#333333]">
                  DOPAMINE AUDIT
                </span>
              </div>

              {/* Blue Score Globe (1440px border-radius) */}
              <div className="text-center py-2 px-3 bg-[#007fff] border-2 border-[#333333] rounded-globe text-[#ffffff] shrink-0 flex flex-col items-center justify-center shadow-[2px_2px_0px_#333333]">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-[#ffffff]/90 block">
                  BRAINROT INDEX
                </span>
                <div className="font-display text-[38px] sm:text-[42px] text-[#ffffff] leading-none my-0.5">
                  {facts.brainrotScore}
                  <span className="text-[15px] text-[#ffffff]/80 font-bold">/100</span>
                </div>
                <span className="text-[9px] font-mono font-black uppercase text-[#ffffff] px-2 py-0.5 bg-[#111111]/30 rounded">
                  {getScoreLabel(facts.brainrotScore)}
                </span>
              </div>

              {/* Official Archetype Card (No truncation!) */}
              <div className="p-2 sm:p-2.5 bg-[#ffffff] border-2 border-[#333333] shadow-[2px_2px_0px_#333333] text-center shrink-0">
                <span className="text-[8px] font-mono font-black uppercase text-[#ef3b2c] tracking-wider block mb-0.5">
                  OFFICIAL ARCHETYPE
                </span>
                <div className="font-display text-[13px] sm:text-[14px] text-[#333333] uppercase leading-snug whitespace-normal break-words">
                  &ldquo;{roast.archetype}&rdquo;
                </div>
              </div>

              {/* Savage Quote Card (Clean, complete text) */}
              <div className="p-2.5 sm:p-3 bg-[#ffffff] border-2 border-[#333333] shadow-[2px_2px_0px_#333333] shrink-0">
                <p className="text-[10.5px] sm:text-[11px] italic text-[#333333] leading-snug font-medium">
                  &ldquo;{roast.one_line_description}&rdquo;
                </p>
              </div>

              {/* Quick Stats Grid with breathing room */}
              <div className="grid grid-cols-2 gap-2 text-center shrink-0">
                <div className="p-1.5 sm:p-2 bg-[#ffffff] border-2 border-[#333333] shadow-[2px_2px_0px_#333333]">
                  <span className="text-[8px] sm:text-[8.5px] text-[#555555] uppercase block font-bold">Shorts Ratio</span>
                  <span className="text-[14px] sm:text-[15px] font-black text-[#ef3b2c]">{facts.shortsPercentage}%</span>
                </div>
                <div className="p-1.5 sm:p-2 bg-[#ffffff] border-2 border-[#333333] shadow-[2px_2px_0px_#333333]">
                  <span className="text-[8px] sm:text-[8.5px] text-[#555555] uppercase block font-bold">Top Sink</span>
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-[#333333] truncate block" title={facts.topChannels[0]?.name}>
                    {facts.topChannels[0]?.name || "N/A"}
                  </span>
                </div>
              </div>

              {/* Single Top Forensic Receipt (NO half-lines, NO truncation!) */}
              <div className="p-2 sm:p-2.5 bg-[#ffffff] border-2 border-[#333333] shadow-[2px_2px_0px_#333333] shrink-0 text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] font-mono font-black text-[#ffffff] px-1.5 py-0.5 bg-[#ef3b2c] border border-[#333333] uppercase">
                    FORENSIC RECEIPT
                  </span>
                </div>
                <p className="text-[9.5px] sm:text-[10px] font-medium text-[#333333] leading-tight">
                  {roast.red_flags[0]}
                </p>
              </div>

              {/* Bottom Clearance Watermark */}
              <div className="pt-2 pb-1 px-2 text-center shrink-0 border-t-2 border-[#333333] bg-[#ffffff] border-2 shadow-[2px_2px_0px_#333333]">
                <div className="font-display text-[11px] sm:text-[12px] uppercase tracking-wide">
                  HOW COOKED IS YOUR YOUTUBE?
                </div>
                <div className="text-[8.5px] sm:text-[9px] font-mono font-black text-[#ef3b2c]">
                  YOUTUBEROAST.VERCEL.APP
                </div>
              </div>
            </div>
          ) : (
            /* 1:1 Square Card in Karl Style */
            <div
              ref={cardRef}
              className="w-[290px] sm:w-[325px] aspect-square p-3.5 sm:p-4 bg-[#ffe600] border-2 border-[#333333] shadow-[4px_4px_0px_#333333] relative overflow-hidden flex flex-col justify-between shrink-0 text-[#333333]"
            >
              <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#333333] shrink-0">
                <span className="font-display text-[14px] uppercase">
                  YOUTUBE ROAST
                </span>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-[#ffffff] border border-[#333333]">
                  DOPAMINE AUDIT
                </span>
              </div>

              {/* Blue Score Globe */}
              <div className="text-center py-2 px-3 bg-[#007fff] border-2 border-[#333333] rounded-globe text-[#ffffff] shrink-0 my-0.5 shadow-[2px_2px_0px_#333333]">
                <span className="text-[8px] uppercase font-bold tracking-wider text-[#ffffff]/90 block">
                  BRAINROT INDEX
                </span>
                <div className="font-display text-[34px] sm:text-[38px] text-[#ffffff] leading-none my-0.5">
                  {facts.brainrotScore}
                  <span className="text-[14px] font-bold">/100</span>
                </div>
                <span className="text-[8.5px] font-mono font-bold uppercase text-[#ffffff] px-1.5 py-0.5 bg-[#111111]/30 rounded">
                  {getScoreLabel(facts.brainrotScore)}
                </span>
              </div>

              {/* Archetype & Savage Quote (No cutoffs) */}
              <div className="p-2 bg-[#ffffff] border-2 border-[#333333] text-center shrink-0 my-0.5 shadow-[2px_2px_0px_#333333]">
                <div className="font-display text-[12px] sm:text-[13px] text-[#333333] uppercase leading-tight whitespace-normal break-words">
                  &ldquo;{roast.archetype}&rdquo;
                </div>
                <p className="text-[9.5px] sm:text-[10px] italic text-[#555555] font-medium leading-tight mt-1 line-clamp-2">
                  &ldquo;{roast.one_line_description}&rdquo;
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-1.5 text-center shrink-0">
                <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333] text-[9.5px] font-bold">
                  SHORTS: <span className="text-[#ef3b2c] font-black">{facts.shortsPercentage}%</span>
                </div>
                <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333] text-[9.5px] font-bold truncate">
                  {facts.topChannels[0]?.name || "Creator"}
                </div>
              </div>

              {/* Bottom URL */}
              <div className="pt-1.5 border-t-2 border-[#333333] text-center text-[9px] font-mono font-black uppercase text-[#ef3b2c] shrink-0">
                GET ROASTED AT YOUTUBEROAST.VERCEL.APP
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-3 pt-3 border-t-2 border-[#333333] flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex-1 py-2.5 px-3 bg-[#007fff] text-[#ffffff] hover:bg-[#007fff]/90 border-2 border-[#333333] font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "EXPORTING..." : "SAVE PNG"}</span>
          </button>

          <button
            onClick={handleShareTwitter}
            className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] border-2 border-[#333333] font-bold text-[12px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>X</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] border-2 border-[#333333] font-bold text-[12px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? "COPIED" : "LINK"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
