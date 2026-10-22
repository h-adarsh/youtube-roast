"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Skull,
  AlertTriangle,
  Brain,
  Share2,
  Swords,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Flame,
  Activity,
  Layers,
  FileWarning,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutGrid,
  FileText,
  Bookmark,
} from "lucide-react";
import { RoastResult } from "@/lib/types";
import { DopaminePrescription } from "./DopaminePrescription";
import { DuelChallengeModal } from "./DuelChallengeModal";

interface RoastResultViewProps {
  result: RoastResult;
  onRoastAgain: () => void;
  onOpenShareModal: () => void;
  onOpenDelete: () => void;
}

/**
 * Web Audio synthesizer for dramatic sound effect upon viewing roast
 */
function playDramaticSting() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // Sub-bass hit
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(110, now);
    osc1.frequency.exponentialRampToValueAtTime(35, now + 0.8);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Glitch beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.1);
    osc2.frequency.setValueAtTime(440, now + 0.25);
    osc2.frequency.setValueAtTime(220, now + 0.4);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.1);
    osc1.stop(now + 0.85);
    osc2.stop(now + 0.65);
  } catch {
    // Ignore audio permission or browser restriction errors
  }
}

/**
 * Smartly highlights channel names, quoted titles, and stats to break up long text
 */
function HighlightedText({
  text,
  channelNames = [],
}: {
  text: string;
  channelNames?: string[];
}) {
  const elements = useMemo(() => {
    if (!text) return null;

    // Deduplicate and filter channel names (longest first to match specific sub-names correctly)
    const uniqueChannels = Array.from(
      new Set(channelNames.map((c) => c?.trim()).filter(Boolean))
    )
      .filter((c) => c.length >= 3)
      .sort((a, b) => b.length - a.length);

    const validChannelsEscaped = uniqueChannels.map((c) =>
      c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    // CRITICAL: Use non-capturing group (?:...) inside the regex so String.prototype.split does NOT duplicate captured tokens!
    const channelPattern =
      validChannelsEscaped.length > 0 ? `|(?:${validChannelsEscaped.join("|")})` : "";
    const regex = new RegExp(
      `(['"][^'"\\n]{3,60}['"]|\\b\\d+%(?:\\s+Shorts)?\\b|\\b\\d+\\s+(?:videos|channels|saal|hours|minute|ghante)\\b${channelPattern})`,
      "gi"
    );

    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
      // Check for quoted video / playlist title
      if (/^['"][^'"]+['"]$/.test(part)) {
        return (
          <mark
            key={index}
            className="bg-[#ffe600] text-[#333333] font-bold px-1.5 py-0.5 border border-[#333333] inline-block my-0.5 mx-0.5 text-[12.5px] sm:text-[14px]"
          >
            {part}
          </mark>
        );
      }

      // Check for percentage or duration
      if (/^\d+%(?:\s+Shorts)?$/i.test(part) || /^\d+\s+(?:videos|channels|saal|hours|minute|ghante)$/i.test(part)) {
        return (
          <span key={index} className="text-[#ef3b2c] font-black underline decoration-2 decoration-[#ef3b2c] mx-0.5">
            {part}
          </span>
        );
      }

      // Check for channel name match
      const matchedChannel = uniqueChannels.find(
        (c) => c.toLowerCase() === part.toLowerCase()
      );
      if (matchedChannel) {
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-[#ffffff] text-[#007fff] border border-[#007fff] font-bold px-1.5 py-0.2 mx-0.5 text-[11.5px] sm:text-[13px] shadow-[1px_1px_0px_#007fff]"
          >
            📺 {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  }, [text, channelNames]);

  return <span className="leading-relaxed">{elements}</span>;
}

interface ParsedAct {
  actNumber: number;
  title: string;
  punchline: string;
  sentences: string[];
  fullBody: string;
}

export function RoastResultView({
  result,
  onRoastAgain,
  onOpenShareModal,
  onOpenDelete,
}: RoastResultViewProps) {
  const [copiedRoast, setCopiedRoast] = useState(false);
  const [copiedDread, setCopiedDread] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"cards" | "all">("cards");

  const { facts, roast } = result;
  const existential = roast.existential_profile;

  // Extract channel names for highlighter
  const channelNames = useMemo(
    () => facts.topChannels.map((c) => c.name),
    [facts.topChannels]
  );

  // Parse roast report into structured acts with extracted punchlines
  const parsedActs = useMemo<ParsedAct[]>(() => {
    const rawParagraphs = roast.roast_report
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const defaultTitles = [
      "ACT 1: THE DOPAMINE TRAP",
      "ACT 2: THE SUBSCRIPTIONS HYPOCRISY",
      "ACT 3: THE PLAYLIST GRAVEYARD",
    ];

    return rawParagraphs.map((para, i) => {
      // Check for "ACT 1: ..." header
      const match = para.match(/^(ACT\s*\d+:?\s*[^:\n]+):?\s*([\s\S]*)$/i);
      const title = match ? match[1].trim() : (defaultTitles[i] || `ACT ${i + 1}`);
      const body = match ? match[2].trim() : para;

      // Split into sentences
      const sentences = body
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Extract best punchline (sentence with question, exclamation, or contrast)
      let punchline = "";
      const candidates = sentences.filter((s) => s.includes("?") || s.includes("!") || s.length > 30);
      if (candidates.length > 0) {
        punchline = candidates[candidates.length > 1 ? 1 : 0];
      } else if (sentences.length > 0) {
        punchline = sentences[0];
      }

      return {
        actNumber: i + 1,
        title,
        punchline,
        sentences,
        fullBody: body,
      };
    });
  }, [roast.roast_report]);

  // Trigger confetti and initial audio sting
  useEffect(() => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#ef3b2c", "#007fff", "#ffe600", "#333333"],
      });
      if (soundEnabled) {
        playDramaticSting();
      }
    } catch {
      // ignore
    }
  }, []);

  const getScoreLabel = useCallback((score: number) => {
    if (score >= 85) return "Terminally Cooked";
    if (score >= 70) return "Chronic Dopamine Sepsis";
    if (score >= 50) return "Moderate Brainrot";
    if (score >= 30) return "Mild Attention Span";
    return "Surprisingly Sane";
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playDramaticSting();
    }
  };

  const handleCopyRoast = () => {
    const textToCopy =
      `🔥 YOUTUBE ROAST FOR ${result.userDisplayName || "ME"} 🔥\n\n` +
      `🧠 Brainrot Score: ${facts.brainrotScore}/100 (${getScoreLabel(facts.brainrotScore)})\n` +
      `🏷️ Archetype: "${roast.archetype}"\n` +
      `💬 "${roast.one_line_description}"\n\n` +
      `💀 Existential Dread Quote:\n"${existential?.existential_dread_quote || "You will die with thousands of unwatched videos in your library."}"\n\n` +
      `🚩 Red Flags:\n` +
      roast.red_flags.map((rf) => `• ${rf}`).join("\n") +
      `\n\nGet roasted at: ${typeof window !== "undefined" ? window.location.origin : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  const handleCopyDreadQuote = () => {
    const dreadText = `"${existential?.existential_dread_quote || roast.one_line_description}"\n\n— YouTube Psychological Autopsy (${result.userDisplayName || "Anonymous"})`;
    navigator.clipboard.writeText(dreadText);
    setCopiedDread(true);
    setTimeout(() => setCopiedDread(false), 2000);
  };

  const currentAct = parsedActs[activeActIndex] || parsedActs[0];

  return (
    <div className="w-full bg-[#ffe600] text-[#333333] py-5 sm:py-10 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">

        {/* Hazard Alert Banner */}
        <div className="p-3 bg-[#333333] border-2 border-[#333333] text-[#ffffff] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef3b2c] opacity-75 gpu-accel"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef3b2c]"></span>
            </span>
            <div className="font-mono text-[11px] sm:text-[12px] font-bold tracking-wider uppercase">
              <span className="text-[#ffe600]">CASE #YT-{result.id.slice(0, 8).toUpperCase()}</span> // NEURAL AUTOPSY COMPLETE // STATUS:{" "}
              <span className="text-[#ef3b2c]">{getScoreLabel(facts.brainrotScore).toUpperCase()}</span>
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] hover:bg-[#222222] text-[#ffe600] text-[11px] font-bold border border-[#ffe600]/40 transition-colors cursor-pointer shrink-0"
            title="Toggle Dramatic Audio"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            <span>{soundEnabled ? "Audio Active" : "Muted"}</span>
          </button>
        </div>

        {/* Top Hero Dossier Card */}
        <div className="p-4 xs:p-5 sm:p-8 bg-[#ffffff] border-2 border-[#333333]">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 sm:gap-6">
            {/* User & Archetype Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="px-3 py-1 bg-[#ffe600] border-2 border-[#333333] text-[11px] sm:text-[12px] font-bold uppercase tracking-wider">
                  👤 {result.userDisplayName || "Anonymous Explorer"}
                </span>
                {result.isDemo && (
                  <span className="px-2.5 py-1 bg-[#ef3b2c] text-[#ffffff] border-2 border-[#333333] text-[11px] font-black uppercase tracking-wider">
                    Demo Dossier
                  </span>
                )}
                {result.language === "hinglish" && (
                  <span className="px-2.5 py-1 bg-[#007fff] text-[#ffffff] border-2 border-[#333333] text-[11px] font-black uppercase tracking-wider">
                    Desi Mode 🔥
                  </span>
                )}
                {result.severity === "nuclear" && (
                  <span className="px-2.5 py-1 bg-[#333333] text-[#ef3b2c] border-2 border-[#ef3b2c] text-[11px] font-black uppercase tracking-wider">
                    ☢️ Nuclear Teardown
                  </span>
                )}
              </div>

              <h1 className="font-display text-[28px] xs:text-[34px] sm:text-[48px] md:text-[54px] leading-heading text-[#333333] tracking-tight mb-3">
                &ldquo;{roast.archetype}&rdquo;
              </h1>

              <div className="p-3.5 sm:p-4 bg-[#ffe600]/25 border-l-4 border-[#ef3b2c] my-3">
                <p className="text-[14px] sm:text-[17px] text-[#333333] font-semibold italic leading-relaxed text-balance">
                  &ldquo;{roast.one_line_description}&rdquo;
                </p>
              </div>
            </div>

            {/* Brainrot Score Globe */}
            <div className="flex flex-col items-center justify-center shrink-0 my-1 md:my-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-globe bg-[#007fff] border-2 border-[#333333] flex flex-col items-center justify-center text-center p-3 text-[#ffffff] shadow-inner relative overflow-hidden group">
                <div className="font-display text-[44px] sm:text-[58px] text-[#ffffff] leading-none tracking-tight">
                  {facts.brainrotScore}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase font-black tracking-widest text-[#ffe600] mt-0.5">
                  BRAINROT SCORE
                </div>
                <div className="text-[11px] sm:text-[12px] font-bold text-center leading-tight px-1.5 mt-1 max-w-[95%] text-[#ffffff] truncate">
                  {getScoreLabel(facts.brainrotScore)}
                </div>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase text-[#333333] mt-2 px-3 py-1 bg-[#ffe600] border-2 border-[#333333] text-center">
                Scale: 0 (Ascetic Zen) to 100 (Cooked)
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="mt-6 pt-5 border-t-2 border-[#333333] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenShareModal}
                className="py-2.5 px-3 bg-[#ef3b2c] hover:bg-[#ef3b2c]/90 text-[#ffffff] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setShowDuelModal(true)}
                className="py-2.5 px-3 bg-[#007fff] hover:bg-[#007fff]/90 text-[#ffffff] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Swords className="w-4 h-4" />
                <span>Duel</span>
              </button>

              <button
                onClick={handleCopyRoast}
                className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 truncate"
              >
                {copiedRoast ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRoast ? "Copied!" : "Copy Roast"}</span>
              </button>

              <button
                onClick={onRoastAgain}
                className="py-2.5 px-3 bg-[#ffffff] hover:bg-gray-100 text-[#333333] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Again</span>
              </button>
            </div>

            <button
              onClick={onOpenDelete}
              className="py-2 px-3 text-[11px] sm:text-[12px] font-bold uppercase text-[#ef3b2c] bg-[#ffffff] hover:bg-red-50 border-2 border-[#ef3b2c] transition-colors w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Data</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Vital Signs Dashboard: 4 High-Impact Live Meters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Attention Span Half-Life */}
          <div className="p-3.5 sm:p-4 bg-[#ffffff] border-2 border-[#333333] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase text-[#333333]">
              <Zap className="w-3.5 h-3.5 text-[#ef3b2c]" />
              <span>Attention Span</span>
            </div>
            <div className="font-display text-[26px] sm:text-[32px] text-[#ef3b2c] leading-none my-1">
              {existential?.attention_half_life || `${facts.attentionSpanSeconds || 14}s`}
            </div>
            <div className="text-[10px] text-[#333333] font-semibold leading-tight">
              Micro-burst retention window
            </div>
            <div className="w-full h-1.5 bg-gray-200 border border-[#333333] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#ef3b2c]"
                style={{ width: `${Math.min(100, Math.max(10, (facts.attentionSpanSeconds || 14) * 2))}%` }}
              />
            </div>
          </div>

          {/* The Delusion Index */}
          <div className="p-3.5 sm:p-4 bg-[#ffffff] border-2 border-[#333333] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase text-[#333333]">
              <Target className="w-3.5 h-3.5 text-[#007fff]" />
              <span>Delusion Index</span>
            </div>
            <div className="font-display text-[26px] sm:text-[32px] text-[#007fff] leading-none my-1">
              {typeof existential?.delusion_index === "number"
                ? `${existential.delusion_index}%`
                : existential?.delusion_index || `${facts.delusionScore || 85}%`}
            </div>
            <div className="text-[10px] text-[#333333] font-semibold leading-tight">
              Saved playlists vs actual views
            </div>
            <div className="w-full h-1.5 bg-gray-200 border border-[#333333] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#007fff]"
                style={{ width: `${facts.delusionScore || 85}%` }}
              />
            </div>
          </div>

          {/* Sensory Overdrive (Shorts) */}
          <div className="p-3.5 sm:p-4 bg-[#ffffff] border-2 border-[#333333] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase text-[#333333]">
              <Flame className="w-3.5 h-3.5 text-[#ef3b2c]" />
              <span>Shorts Ratio</span>
            </div>
            <div className="font-display text-[26px] sm:text-[32px] text-[#333333] leading-none my-1">
              {facts.shortsPercentage}%
            </div>
            <div className="text-[10px] text-[#333333] font-semibold leading-tight">
              Sub-60s dopamine injections
            </div>
            <div className="w-full h-1.5 bg-gray-200 border border-[#333333] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#ef3b2c]"
                style={{ width: `${facts.shortsPercentage}%` }}
              />
            </div>
          </div>

          {/* Cognitive Sepsis Stage */}
          <div className="p-3.5 sm:p-4 bg-[#ffffff] border-2 border-[#333333] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase text-[#333333]">
              <Activity className="w-3.5 h-3.5 text-[#333333]" />
              <span>Dopamine Sepsis</span>
            </div>
            <div className="font-display text-[26px] sm:text-[32px] text-[#333333] leading-none my-1">
              Stage {Math.min(4, Math.max(1, Math.ceil(facts.brainrotScore / 25)))}
            </div>
            <div className="text-[10px] text-[#333333] font-semibold leading-tight">
              Receptor fatigue level
            </div>
            <div className="w-full h-1.5 bg-gray-200 border border-[#333333] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#333333]"
                style={{ width: `${(Math.min(4, Math.max(1, Math.ceil(facts.brainrotScore / 25))) / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 💀 THE EXISTENTIAL DREAD & PSYCHOLOGICAL AUTOPSY (Black-Box Dossier) */}
        <div className="cv-auto p-5 sm:p-8 bg-[#111111] border-3 border-[#ef3b2c] text-[#ffffff] relative overflow-hidden shadow-2xl">
          {/* Watermark badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#ef3b2c]/40">
            <div className="flex items-center gap-2">
              <Skull className="w-6 h-6 text-[#ef3b2c] animate-pulse gpu-accel" />
              <div>
                <div className="font-display text-[18px] sm:text-[22px] tracking-wide text-[#ef3b2c] uppercase leading-none">
                  CLASSIFIED PSYCHOLOGICAL AUTOPSY
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] text-[#ffe600] uppercase tracking-wider mt-0.5">
                  DOCUMENT: {existential?.title || "WHO YOU ACTUALLY ARE WHEN THE SCREEN TURNS BLACK"}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyDreadQuote}
              className="py-1.5 px-3 bg-[#ef3b2c] hover:bg-[#ef3b2c]/90 text-[#ffffff] text-[11px] font-bold uppercase tracking-wider border border-[#ffffff]/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copiedDread ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDread ? "Copied Dread!" : "Copy 3 AM Quote"}</span>
            </button>
          </div>

          {/* Core Escapism Mechanism Callout */}
          <div className="mb-6 p-4 bg-[#1f1f1f] border-l-4 border-[#ffe600] border-y border-r border-[#333333]">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase font-black tracking-widest text-[#ffe600] mb-1">
              [PRIMARY ESCAPISM MECHANISM IDENTIFIED]
            </div>
            <p className="text-[13px] sm:text-[15px] font-medium text-gray-200 leading-snug">
              {existential?.core_escapism_mechanism ||
                "Preemptive intellectual hoarding—stockpiling ambitious videos and tutorials to construct a protective psychological fortress against the terrifying reality of your own inaction."}
            </p>
          </div>

          {/* The Uncomfortable Truth: 2 Deep Paragraphs */}
          <div className="space-y-4 text-gray-300 text-[13px] sm:text-[15.5px] leading-relaxed font-normal">
            {(
              existential?.the_uncomfortable_truth ||
              `You are deeply terrified of actually trying, because as long as your saved playlists remain unstarted, your potential remains theoretically limitless. If you actually sit down and face the friction of deep work, your self-image as a 'gifted underachiever who just needs to apply themselves' instantly evaporates.\n\nYou cannot stand thirty seconds of silence in a room without pulling out your glass rectangle to inject sensory stimulation into your nervous system. The algorithm didn't steal your attention span; you willingly handed it over so you would never have to be alone with your own thoughts.`
            )
              .split("\n\n")
              .map((para, i) => (
                <p key={i} className="border-l-2 border-[#ef3b2c]/30 pl-3">
                  {para}
                </p>
              ))}
          </div>

          {/* The 3 AM Existential Dread Quote Card */}
          <div className="mt-7 pt-5 border-t border-[#333333] relative">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ef3b2c] font-black mb-1.5 flex items-center gap-1.5">
              <FileWarning className="w-3.5 h-3.5" />
              <span>THE 3:45 AM CEILING STARE:</span>
            </div>
            <blockquote className="p-4 sm:p-5 bg-[#1a0505] border-2 border-[#ef3b2c] text-[#ffe600] font-display text-[17px] sm:text-[22px] leading-snug italic tracking-tight">
              &ldquo;{existential?.existential_dread_quote || "You will die with thousands of unwatched videos in your library, having traded your youth for 45-second split-screen clips."}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Main Grid: Savage Breakdown & Real Numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Left Column (2 cols): Savage Breakdown, Red Flags, Habits */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            {/* ✨ RE-DESIGNED: THE SAVAGE BREAKDOWN (Bite-Sized, Interactive & Eye-Catching) */}
            <div className="cv-auto p-4 xs:p-5 sm:p-7 bg-[#ffffff] border-2 border-[#333333]">
              {/* Header with View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b-2 border-[#333333] gap-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#ef3b2c]" />
                  <h2 className="font-display text-[22px] xs:text-[24px] sm:text-[28px] text-[#333333] uppercase leading-none">
                    THE SAVAGE BREAKDOWN
                  </h2>
                </div>

                {/* View Mode Toggle: Interactive Story Cards vs Show All */}
                <div className="flex items-center gap-1 bg-[#ffe600] border-2 border-[#333333] p-0.5 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                      viewMode === "cards"
                        ? "bg-[#333333] text-[#ffffff] shadow-sm"
                        : "text-[#333333] hover:bg-yellow-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Story Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all flex items-center gap-1 ${
                      viewMode === "all"
                        ? "bg-[#333333] text-[#ffffff] shadow-sm"
                        : "text-[#333333] hover:bg-yellow-200"
                    }`}
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>View All</span>
                  </button>
                </div>
              </div>

              {/* TL;DR Quick-Scan Pills Bar (For instant 3-second comprehension) */}
              <div className="mb-5 p-2.5 bg-[#ffe600]/30 border-2 border-[#333333] grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#333333]">
                  <span className="w-2 h-2 rounded-full bg-[#ef3b2c] shrink-0" />
                  <span className="truncate">
                    <strong>Act 1:</strong> Liked Videos & Dopamine
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#333333]">
                  <span className="w-2 h-2 rounded-full bg-[#007fff] shrink-0" />
                  <span className="truncate">
                    <strong>Act 2:</strong> Subscriptions Masquerade
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#333333]">
                  <span className="w-2 h-2 rounded-full bg-[#333333] shrink-0" />
                  <span className="truncate">
                    <strong>Act 3:</strong> Playlists Graveyard
                  </span>
                </div>
              </div>

              {/* MODE 1: INTERACTIVE STORY CARDS (One Act at a Time - Low Cognitive Load) */}
              {viewMode === "cards" && currentAct && (
                <div className="space-y-4">
                  {/* Segmented Progress Bar & Act Tabs */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      {parsedActs.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveActIndex(idx)}
                          className={`h-2 border border-[#333333] transition-all cursor-pointer ${
                            idx === activeActIndex
                              ? "bg-[#ef3b2c]"
                              : idx < activeActIndex
                              ? "bg-[#333333]"
                              : "bg-gray-200"
                          }`}
                          title={`Jump to Act ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] font-mono font-black uppercase text-[#ef3b2c]">
                        <span>ACT {currentAct.actNumber} OF {parsedActs.length}:</span>
                        <span className="text-[#333333] truncate max-w-[200px] xs:max-w-none">
                          {currentAct.title.replace(/^ACT\s*\d+:?\s*/i, "")}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-500 font-mono">
                        {activeActIndex + 1}/{parsedActs.length}
                      </div>
                    </div>
                  </div>

                  {/* Active Card Body */}
                  <div
                    className={`p-4 sm:p-5 border-2 border-[#333333] transition-all ${
                      currentAct.actNumber === 1
                        ? "bg-red-50/40 border-t-6 border-t-[#ef3b2c]"
                        : currentAct.actNumber === 2
                        ? "bg-blue-50/40 border-t-6 border-t-[#007fff]"
                        : "bg-gray-50 border-t-6 border-t-[#333333]"
                    }`}
                  >
                    {/* Standout Hero Punchline Box */}
                    {currentAct.punchline && (
                      <div className="p-3 bg-[#ffffff] border-2 border-[#333333] mb-3.5 shadow-sm">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#ef3b2c] mb-1">
                          <Flame className="w-3.5 h-3.5" />
                          <span>PUNCHLINE OF THE ACT</span>
                        </div>
                        <p className="font-display text-[15px] sm:text-[18px] text-[#333333] leading-snug italic">
                          &ldquo;{currentAct.punchline}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Highlighted Bite-Sized Sentences */}
                    <div className="text-[#333333] text-[13.5px] sm:text-[15px] leading-relaxed space-y-3">
                      {currentAct.sentences.map((sentence, sIdx) => (
                        <p key={sIdx} className="pl-2 border-l-2 border-[#333333]/30">
                          <HighlightedText text={sentence} channelNames={channelNames} />
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Card Navigation Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveActIndex((prev) => Math.max(0, prev - 1))}
                      disabled={activeActIndex === 0}
                      className={`px-3 py-2 border-2 border-[#333333] font-bold text-[12px] uppercase tracking-wider flex items-center gap-1 ${
                        activeActIndex === 0
                          ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-[#ffffff] hover:bg-gray-100 text-[#333333] cursor-pointer"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev Act</span>
                    </button>

                    <div className="flex gap-1.5">
                      {parsedActs.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setActiveActIndex(dotIdx)}
                          className={`w-2.5 h-2.5 rounded-full border border-[#333333] transition-all cursor-pointer ${
                            dotIdx === activeActIndex ? "bg-[#ef3b2c] scale-125" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {activeActIndex < parsedActs.length - 1 ? (
                      <button
                        onClick={() => setActiveActIndex((prev) => Math.min(parsedActs.length - 1, prev + 1))}
                        className="px-3.5 py-2 bg-[#ef3b2c] hover:bg-[#ef3b2c]/90 text-[#ffffff] border-2 border-[#333333] font-bold text-[12px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-transform active:translate-y-0.5"
                      >
                        <span>Next Act</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewMode("all")}
                        className="px-3 py-2 bg-[#007fff] hover:bg-[#007fff]/90 text-[#ffffff] border-2 border-[#333333] font-bold text-[12px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <span>Show All Acts</span>
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* MODE 2: SHOW ALL ACTS (Clean distinct mini-cards with breathing room) */}
              {viewMode === "all" && (
                <div className="space-y-4">
                  {parsedActs.map((act, i) => (
                    <div
                      key={i}
                      className={`p-4 sm:p-5 border-2 border-[#333333] ${
                        i === 0
                          ? "bg-red-50/30 border-l-6 border-l-[#ef3b2c]"
                          : i === 1
                          ? "bg-blue-50/30 border-l-6 border-l-[#007fff]"
                          : "bg-gray-50 border-l-6 border-l-[#333333]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#333333]/20">
                        <span className="text-[11px] font-mono font-black uppercase text-[#ef3b2c]">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                          ACT {i + 1} OF {parsedActs.length}
                        </span>
                      </div>

                      {/* Pull-quote for scannability */}
                      {act.punchline && (
                        <div className="p-2.5 bg-[#ffffff] border border-[#333333] mb-3 text-[13px] sm:text-[14px] italic font-semibold text-[#ef3b2c]">
                          &ldquo;{act.punchline}&rdquo;
                        </div>
                      )}

                      <div className="text-[#333333] text-[13.5px] sm:text-[15px] leading-relaxed space-y-2">
                        {act.sentences.map((sentence, sIdx) => (
                          <p key={sIdx}>
                            <HighlightedText text={sentence} channelNames={channelNames} />
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setViewMode("cards");
                        setActiveActIndex(0);
                      }}
                      className="px-3.5 py-1.5 bg-[#ffffff] hover:bg-gray-100 text-[#333333] border-2 border-[#333333] font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                    >
                      Switch to Step-by-Step Card Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Brainrot Clinical Neurological Diagnosis */}
              {roast.brainrot_analysis && (
                <div className="mt-6 p-4 bg-[#ffe600] border-2 border-[#333333] text-[13px] sm:text-[14px] text-[#333333]">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1.5 text-[11px] sm:text-[12px]">
                    <Brain className="w-4 h-4 text-[#333333]" />
                    <span>Clinical Neurological Diagnosis:</span>
                  </div>
                  <p className="leading-relaxed">
                    <HighlightedText text={roast.brainrot_analysis} channelNames={channelNames} />
                  </p>
                </div>
              )}
            </div>

            {/* Forensic Receipts of Shame */}
            <div className="cv-auto p-4 xs:p-5 sm:p-7 bg-[#ffffff] border-2 border-[#333333]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 pb-2.5 border-b-2 border-[#333333]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#ef3b2c]" />
                  <h2 className="font-display text-[20px] xs:text-[22px] sm:text-[26px] text-[#ef3b2c] uppercase leading-none">
                    FORENSIC RECEIPTS OF SHAME ({roast.red_flags.length})
                  </h2>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-[#333333] bg-[#ffe600] px-2 py-0.5 border border-[#333333] w-fit">
                  EXHIBIT A – {String.fromCharCode(64 + Math.min(26, roast.red_flags.length))} // NO BAIL
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12.5px] text-[#555555] font-medium italic mb-4">
                &ldquo;Itemized algorithmic evidence submitted directly to dopamine court without parole.&rdquo;
              </p>

              <div className="space-y-3">
                {roast.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-3 p-3 bg-[#ffffff] border-2 border-[#333333] text-[13px] sm:text-[14px] text-[#333333] hover:bg-yellow-50/50 transition-colors"
                  >
                    <span className="text-[10px] sm:text-[11px] font-black text-[#ffffff] px-2 py-0.5 bg-[#ef3b2c] border border-[#333333] shrink-0 self-start font-mono">
                      RECEIPT #{idx + 1}
                    </span>
                    <span className="leading-snug font-medium">
                      <HighlightedText text={flag} channelNames={channelNames} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pathological Coping Rituals */}
            {roast.habits_exposed && roast.habits_exposed.length > 0 && (
              <div className="cv-auto p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 pb-2.5 border-b-2 border-[#333333]">
                  <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#007fff]" />
                    <span>PATHOLOGICAL COPING RITUALS</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-[#ffffff] bg-[#007fff] px-2 py-0.5 border border-[#333333] w-fit">
                    SURVEILLANCE WIRETAP
                  </span>
                </div>
                <p className="text-[11.5px] sm:text-[12.5px] text-[#555555] font-medium italic mb-4">
                  &ldquo;The involuntary mental gymnastics you run on autopilot to escape your actual life.&rdquo;
                </p>
                <ul className="space-y-3">
                  {roast.habits_exposed.map((habit, idx) => (
                    <li key={idx} className="text-[13px] sm:text-[14px] text-[#333333] flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-[#ef3b2c]/10 text-[#ef3b2c] border border-[#ef3b2c]/40 font-mono text-[10px] font-black uppercase shrink-0 mt-0.5">
                        LOOP #{idx + 1}
                      </span>
                      <span className="leading-snug font-medium">
                        <HighlightedText text={habit} channelNames={channelNames} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (1 col): The Raw Data Dossier */}
          <div className="space-y-5 sm:space-y-6">

            {/* Key Facts Summary */}
            <div className="cv-auto p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[20px] sm:text-[24px] text-[#333333] uppercase mb-4">
                THE RAW EVIDENCE
              </div>

              {/* Ghost Profile Banner if 0 public liked videos */}
              {(facts.hasNoLikedVideos || facts.totalVideosAnalyzed === 0) && (
                <div className="mb-4 p-3 bg-[#ffe600] border-2 border-[#333333] text-left">
                  <div className="flex items-center gap-1.5 font-bold text-[12px] text-[#333333] uppercase">
                    <span>👻 GHOST PROFILE DETECTED</span>
                  </div>
                  <p className="text-[11px] text-[#333333] mt-1 leading-snug">
                    Found <strong>0 public liked videos</strong>! Your likes are likely set to <strong>Private</strong> in YouTube Settings (Settings &gt; Privacy). We roasted your digital secrecy instead!
                  </p>
                </div>
              )}

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
                    ? "⚠️ Severe short-form (<60s) dependence"
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
                <p className="text-[11px] text-[#333333] mt-1.5 leading-snug">
                  {facts.educationalPercentage > facts.entertainmentPercentage
                    ? "📚 Strong preference for educational content"
                    : "🍿 Dominant pop-culture & entertainment intake"}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t-2 border-[#333333]">
                <div className="p-2.5 sm:p-3 bg-[#ffe600] border-2 border-[#333333] flex flex-col justify-between min-h-[84px]">
                  <div className="text-[10px] xs:text-[11px] font-bold text-[#333333] uppercase leading-tight">
                    Videos Analyzed
                  </div>
                  <div className="font-display text-[28px] sm:text-[32px] text-[#333333] leading-none mt-auto pt-1">
                    {facts.totalVideosAnalyzed}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-[#ffe600] border-2 border-[#333333] flex flex-col justify-between min-h-[84px]">
                  <div className="text-[10px] xs:text-[11px] font-bold text-[#333333] uppercase leading-tight">
                    Subscriptions
                  </div>
                  <div className="font-display text-[28px] sm:text-[32px] text-[#333333] leading-none mt-auto pt-1">
                    {facts.totalSubscriptions}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Addicted Channels */}
            <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
              <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase mb-3 sm:mb-4">
                TOP ADDICTED CREATORS
              </div>

              <div className="space-y-2">
                {facts.topChannels.slice(0, 6).map((channel, i) => (
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

            {/* Abandoned Playlists Graveyard */}
            {facts.samplePlaylists.length > 0 && (
              <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
                <div className="font-display text-[18px] xs:text-[20px] sm:text-[22px] text-[#333333] uppercase mb-2.5 flex items-center justify-between">
                  <span>PLAYLISTS GRAVEYARD</span>
                  <span className="text-[10px] font-mono text-[#ef3b2c] font-black">
                    {facts.totalPlaylists} SAVED
                  </span>
                </div>
                <div className="space-y-1.5">
                  {facts.samplePlaylists.slice(0, 5).map((pl, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 border border-[#333333] text-[11px] sm:text-[12px] font-semibold text-[#333333] truncate flex items-center gap-1.5"
                    >
                      <span className="text-gray-400">📁</span>
                      <span className="truncate">{pl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Categories */}
            {facts.categoryDistribution.length > 0 && (
              <div className="p-4 xs:p-5 sm:p-6 bg-[#ffffff] border-2 border-[#333333]">
                <div className="font-display text-[18px] xs:text-[20px] sm:text-[24px] text-[#333333] uppercase mb-2.5">
                  CATEGORIES CONSUMED
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {facts.categoryDistribution.slice(0, 6).map((cat, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase bg-[#ffe600] border-2 border-[#333333] text-[#333333]"
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
