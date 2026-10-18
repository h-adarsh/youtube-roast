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
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#ffe600] border-2 border-[#333333] p-4 sm:p-5 flex flex-col my-auto max-h-[96dvh]">
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
                ? "bg-[#007fff] text-[#ffffff]"
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
                ? "bg-[#007fff] text-[#ffffff]"
                : "bg-[#ffffff] text-[#333333] hover:bg-gray-50"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>Square (1:1)</span>
          </button>
        </div>

        {/* Card Canvas Container */}
        <div className="flex-1 flex items-center justify-center py-1 overflow-visible">
          {aspectRatio === "story" ? (
            /* 9:16 Vertical Story Card in Karl Style */
            <div
              ref={cardRef}
              className="w-[280px] sm:w-[295px] h-[495px] sm:h-[515px] p-4 bg-[#ffe600] border-2 border-[#333333] relative overflow-hidden flex flex-col justify-between text-left shrink-0 text-[#333333]"
            >
              {/* Top Watermark */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#333333] shrink-0">
                <span className="font-display text-[15px] uppercase tracking-normal">
                  YOUTUBE ROAST
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-[#ffffff] border border-[#333333]">
                  DOPAMINE AUDIT
                </span>
              </div>

              {/* Blue Globe Focal Emblem (1440px border-radius) */}
              <div className="text-center py-2 px-3 bg-[#007fff] border-2 border-[#333333] rounded-globe my-1 text-[#ffffff] shrink-0 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#ffffff]/90 block">
                  BRAINROT INDEX
                </span>
                <div className="font-display text-[46px] text-[#ffffff] leading-none my-0.5">
                  {facts.brainrotScore}
                  <span className="text-[16px] text-[#ffffff]/80 font-bold">/100</span>
                </div>
                <div className="text-[10px] font-bold text-[#333333] px-2 py-0.5 bg-[#ffe600] border border-[#333333] truncate max-w-[90%]">
                  &ldquo;{roast.archetype}&rdquo;
                </div>
              </div>

              {/* Savage Quote Card */}
              <div className="p-2.5 bg-[#ffffff] border-2 border-[#333333] my-1 shrink-0">
                <p className="text-[10.5px] italic text-[#333333] leading-snug line-clamp-3">
                  &ldquo;{roast.one_line_description}&rdquo;
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-1.5 my-1 text-center shrink-0">
                <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333]">
                  <span className="text-[8px] text-[#333333] uppercase block font-bold">Shorts Ratio</span>
                  <span className="text-[14px] font-black text-[#ef3b2c]">{facts.shortsPercentage}%</span>
                </div>
                <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333]">
                  <span className="text-[8px] text-[#333333] uppercase block font-bold">Top Addiction</span>
                  <span className="text-[11px] font-bold text-[#333333] truncate block">
                    {facts.topChannels[0]?.name || "N/A"}
                  </span>
                </div>
              </div>

              {/* Red Flags */}
              <div className="space-y-1 my-1 shrink-0">
                <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333] text-[9.5px] text-[#333333] flex items-start gap-1">
                  <span className="text-[#ef3b2c] font-black shrink-0">🚩</span>
                  <span className="line-clamp-2 leading-tight">{roast.red_flags[0]}</span>
                </div>
                {roast.red_flags[1] && (
                  <div className="p-1.5 bg-[#ffffff] border-2 border-[#333333] text-[9.5px] text-[#333333] flex items-start gap-1">
                    <span className="text-[#ef3b2c] font-black shrink-0">🚩</span>
                    <span className="line-clamp-1 leading-tight">{roast.red_flags[1]}</span>
                  </div>
                )}
              </div>

              {/* Bottom Clearance Watermark */}
              <div className="mt-auto pt-2 pb-1.5 px-2 text-center shrink-0 border-t-2 border-[#333333] bg-[#ffffff]">
                <div className="font-display text-[12px] uppercase">
                  HOW COOKED IS YOUR YOUTUBE?
                </div>
                <div className="text-[9px] font-bold text-[#ef3b2c] mt-0.5">
                  POP-UP STORYBOOK AUDIT
                </div>
              </div>
            </div>
          ) : (
            /* 1:1 Square Card in Karl Style */
            <div
              ref={cardRef}
              className="w-[280px] sm:w-[310px] aspect-square p-4 bg-[#ffe600] border-2 border-[#333333] relative overflow-hidden flex flex-col justify-between shrink-0 text-[#333333]"
            >
              <div className="flex items-center justify-between pb-1 border-b-2 border-[#333333] shrink-0">
                <span className="font-display text-[14px] uppercase">
                  YOUTUBE ROAST
                </span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#ffffff] border border-[#333333]">
                  AUDIT
                </span>
              </div>

              <div className="text-center py-2 bg-[#007fff] border-2 border-[#333333] rounded-globe my-1 text-[#ffffff] shrink-0">
                <div className="font-display text-[38px] text-[#ffffff] leading-none">
                  {facts.brainrotScore}
                  <span className="text-[15px] font-bold">/100</span>
                </div>
                <div className="text-[9px] uppercase font-bold tracking-wider">
                  BRAINROT INDEX
                </div>
              </div>

              <div className="p-2 bg-[#ffffff] border-2 border-[#333333] text-center my-1 shrink-0">
                <div className="font-display text-[13px] text-[#333333] truncate">
                  &ldquo;{roast.archetype}&rdquo;
                </div>
                <p className="text-[9.5px] italic text-[#333333] line-clamp-2 mt-0.5">
                  &ldquo;{roast.one_line_description}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1 text-center shrink-0">
                <div className="p-1 bg-[#ffffff] border-2 border-[#333333] text-[9px] font-bold">
                  SHORTS: <span className="text-[#ef3b2c]">{facts.shortsPercentage}%</span>
                </div>
                <div className="p-1 bg-[#ffffff] border-2 border-[#333333] text-[9px] font-bold truncate">
                  {facts.topChannels[0]?.name || "Creator"}
                </div>
              </div>

              <div className="pt-1.5 border-t-2 border-[#333333] text-center text-[10px] font-display uppercase shrink-0">
                HOW COOKED IS YOUR ATTENTION SPAN?
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
