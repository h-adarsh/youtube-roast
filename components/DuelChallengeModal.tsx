"use client";

import React, { useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import { RoastResult } from "@/lib/types";

interface DuelChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RoastResult;
}

export function DuelChallengeModal({ isOpen, onClose, result }: DuelChallengeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const name = result.userDisplayName || "A Friend";
  const score = result.facts.brainrotScore;
  const archetype = result.roast.archetype;

  const duelUrl = `${origin}/duel?challengerName=${encodeURIComponent(name)}&challengerScore=${score}&challengerArchetype=${encodeURIComponent(
    archetype
  )}&challengerId=${result.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(duelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `I got a Brainrot Score of ${score}/100 ("${archetype}") on YouTube Roast! 🔥\n\nI challenge you to a Duel: Can your attention span beat mine?`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
      duelUrl
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#333333]/70">
      <div className="relative w-full max-w-md bg-[#ffffff] border-2 border-[#333333] p-4 sm:p-6 text-left max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#333333]">
          <h3 className="font-display text-[20px] text-[#333333] uppercase">
            CHALLENGE A FRIEND (DUEL)
          </h3>
          <button
            onClick={onClose}
            className="p-1 bg-[#ffffff] border-2 border-[#333333] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#333333]" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3.5 text-[13px] text-[#333333]">
          <p className="leading-snug">
            See whose brain is more terminally cooked! Send your unique duel battle link to a friend.
          </p>

          <div className="p-3.5 bg-[#ffe600] border-2 border-[#333333] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase">Your Current Score:</span>
              <span className="font-display text-[20px] text-[#ef3b2c]">{score} / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase">Your Archetype:</span>
              <span className="font-bold text-[#333333]">&ldquo;{archetype}&rdquo;</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase block mb-1">
              Your Duel Challenge Link
            </label>
            <div className="flex items-center gap-1.5 p-1.5 bg-[#ffffff] border-2 border-[#333333]">
              <input
                type="text"
                readOnly
                value={duelUrl}
                className="w-full bg-transparent text-[12px] text-[#333333] font-mono focus:outline-none select-all truncate px-1"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#007fff] text-[#ffffff] font-bold text-[12px] uppercase shrink-0 flex items-center gap-1 hover:bg-[#007fff]/90 border border-[#333333] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "COPIED!" : "COPY"}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#ffffff] border-2 border-[#333333] text-[12px] leading-relaxed">
            When your friend opens this link, a side-by-side <strong>Versus Battle Card</strong> will reveal who has the healthier attention span!
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t-2 border-[#333333] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-[#ffffff] text-[#333333] hover:bg-gray-100 border-2 border-[#333333] font-bold text-[12px] uppercase cursor-pointer"
          >
            CLOSE
          </button>
          <button
            onClick={handleShareTwitter}
            className="py-2 px-4 bg-[#ef3b2c] text-[#ffffff] hover:bg-[#ef3b2c]/90 border-2 border-[#333333] font-bold text-[12px] uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <span>TWEET CHALLENGE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
