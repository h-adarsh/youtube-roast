"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { DEMO_PROFILES, DemoProfile } from "@/lib/demo-data";
import { RoastResult } from "@/lib/types";
import { CartoonCloud } from "@/components/KarlArtwork";

function DuelArena() {
  const searchParams = useSearchParams();
  const duelCardRef = useRef<HTMLDivElement>(null);

  const challengerNameParam = searchParams.get("challenger_name");
  const challengerScoreParam = searchParams.get("challenger_score");
  const challengerArchetypeParam = searchParams.get("challenger_archetype");

  const challengerName = challengerNameParam ? decodeURIComponent(challengerNameParam) : "Mystery Scroller";
  const challengerScore = challengerScoreParam ? parseInt(challengerScoreParam, 10) || 85 : 85;
  const challengerArchetype = challengerArchetypeParam ? decodeURIComponent(challengerArchetypeParam) : "Shorts Addict";

  const [myResult, setMyResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGoogleAuth = () => {
    setIsLoading(true);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/api/auth/google";
  };

  const handleSelectDemoProfile = async (profile: DemoProfile) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoProfileId: profile.id }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setMyResult(data.result);
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Duel demo error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDuelCard = async () => {
    if (!duelCardRef.current) return;
    try {
      const dataUrl = await toPng(duelCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `youtube-roast-duel-${challengerName.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Failed to export card directly. Please take a screenshot!");
    }
  };

  const myScore = myResult?.facts.brainrotScore;
  const myName = myResult?.userDisplayName || "You";
  const myArchetype = myResult?.roast.archetype || "";

  const isChallengerWinner = myScore !== undefined && challengerScore < myScore;
  const isTie = myScore !== undefined && challengerScore === myScore;
  const winnerName = isTie ? "Tie" : isChallengerWinner ? challengerName : myName;
  const scoreDiff = myScore !== undefined ? Math.abs(challengerScore - myScore) : 0;

  return (
    <div className="min-h-screen bg-[#ffe600] text-[#333333] py-6 sm:py-8 px-3 sm:px-6 max-w-4xl mx-auto flex flex-col justify-between text-center relative overflow-hidden">
      {/* Cartoon Cloud */}
      <div className="absolute top-4 left-8 w-28 pointer-events-none opacity-80 hidden sm:block">
        <CartoonCloud className="w-full h-auto" />
      </div>

      {/* Top Banner */}
      <div>
        <Link href="/" className="inline-block mb-3 sm:mb-4 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-[#333333] hover:underline">
          ← BACK TO HOME
        </Link>

        <div className="inline-block px-3 py-1 bg-[#ffffff] border-2 border-[#333333] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2">
          ⚔️ BRAINROT DUEL ARENA
        </div>

        <h1 className="font-display text-[28px] xs:text-[36px] sm:text-[56px] text-[#333333] leading-heading tracking-tight mb-2 -rotate-1">
          WHO IS MORE COOKED?
        </h1>
        <p className="text-[12px] sm:text-[15px] text-[#333333] max-w-lg mx-auto font-medium px-2">
          <strong>{challengerName}</strong> scored{" "}
          <strong className="text-[#ef3b2c]">{challengerScore}/100</strong> and challenged you to prove your attention span is healthier.
        </p>
      </div>

      {/* Versus Arena View (Flat 0px card, 2px solid border) */}
      <div className="my-5 sm:my-6">
        <div
          ref={duelCardRef}
          className="p-3.5 xs:p-5 sm:p-8 bg-[#ffffff] border-2 border-[#333333] relative"
        >
          {/* Winner Banner if battle concluded */}
          {myScore !== undefined && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-[#ffe600] border-2 border-[#333333] text-center">
              <div className="font-display text-[15px] xs:text-[18px] sm:text-[22px] text-[#333333] uppercase leading-tight">
                {isTie ? (
                  <span>BOTH OF YOU ARE EQUALLY COOKED ({challengerScore}/100)!</span>
                ) : (
                  <span>
                    🏆 {winnerName} WINS! {isChallengerWinner ? myName : challengerName} IS {scoreDiff} POINTS MORE BRAINROTTED!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Duel Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative items-center">
            {/* Left: Challenger */}
            <div className="p-4 sm:p-6 bg-[#ffe600] border-2 border-[#333333] text-center flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
              <div>
                <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest text-[#333333] block mb-1">
                  CHALLENGER
                </span>
                <h3 className="font-display text-[19px] sm:text-[22px] text-[#333333] truncate">{challengerName}</h3>
                <p className="text-[11px] sm:text-[12px] text-[#333333] italic mt-0.5 truncate">&ldquo;{challengerArchetype}&rdquo;</p>
              </div>

              <div className="my-3 sm:my-4">
                <div className="font-display text-[44px] sm:text-[54px] text-[#ef3b2c] leading-none">
                  {challengerScore}
                  <span className="text-[18px] sm:text-[20px] text-[#333333] font-bold">/100</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#333333]">BRAINROT INDEX</span>
              </div>

              {myScore !== undefined && (
                <div className="text-[11px] sm:text-[12px] font-bold uppercase">
                  {isChallengerWinner ? (
                    <span className="text-[#007fff]">👑 Healthier Attention Span</span>
                  ) : (
                    <span className="text-[#ef3b2c]">💀 More Cooked</span>
                  )}
                </div>
              )}
            </div>

            {/* Central VS Badge (Mobile divider + Desktop centered badge) */}
            <div className="md:hidden flex items-center justify-center my-0.5">
              <span className="w-8 h-8 rounded-globe bg-[#ef3b2c] text-[#ffffff] font-display text-[13px] flex items-center justify-center border-2 border-[#333333]">
                VS
              </span>
            </div>

            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-globe bg-[#ef3b2c] text-[#ffffff] font-display text-[20px] items-center justify-center border-2 border-[#333333] z-10 select-none">
              VS
            </div>

            {/* Right: Opponent (You) */}
            <div className="p-4 sm:p-6 bg-[#ffffff] border-2 border-[#333333] text-center flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
              <div>
                <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest text-[#333333] block mb-1">
                  YOU (DEFENDER)
                </span>
                <h3 className="font-display text-[19px] sm:text-[22px] text-[#333333] truncate">{myName}</h3>
                {myScore !== undefined ? (
                  <p className="text-[11px] sm:text-[12px] text-[#333333] italic mt-0.5 truncate">&ldquo;{myArchetype}&rdquo;</p>
                ) : (
                  <p className="text-[11px] sm:text-[12px] text-[#333333] mt-0.5 font-bold">Ready to face the audit?</p>
                )}
              </div>

              {myScore !== undefined ? (
                <>
                  <div className="my-3 sm:my-4">
                    <div className="font-display text-[44px] sm:text-[54px] text-[#007fff] leading-none">
                      {myScore}
                      <span className="text-[18px] sm:text-[20px] text-[#333333] font-bold">/100</span>
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#333333]">BRAINROT INDEX</span>
                  </div>

                  <div className="text-[11px] sm:text-[12px] font-bold uppercase">
                    {!isChallengerWinner && !isTie ? (
                      <span className="text-[#007fff]">👑 Healthier Attention Span</span>
                    ) : (
                      <span className="text-[#ef3b2c]">💀 More Cooked</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="my-3 sm:my-4 space-y-2.5 sm:space-y-3">
                  <button
                    onClick={handleStartGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#007fff] hover:bg-[#007fff]/90 text-[#ffffff] font-display text-[15px] sm:text-[16px] uppercase tracking-normal border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer"
                  >
                    ACCEPT WITH GOOGLE
                  </button>

                  <div className="text-[10px] sm:text-[11px] font-bold text-[#333333] uppercase">OR TEST SAMPLE PROFILE:</div>

                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-1.5">
                    {DEMO_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectDemoProfile(p)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-[#ffe600] hover:bg-[#ffe600]/80 border-2 border-[#333333] text-[9.5px] sm:text-[10px] text-[#333333] font-bold uppercase transition-colors truncate"
                      >
                        {p.displayName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Watermark in Versus Card */}
          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-[#333333] text-center flex items-center justify-between text-[10px] sm:text-[11px] text-[#333333] font-bold uppercase">
            <span>YOUTUBE ROAST DUEL</span>
            <span>POP-UP DIORAMA ARENA</span>
          </div>
        </div>

        {/* Duel Actions Toolbar if battle concluded */}
        {myScore !== undefined && (
          <div className="mt-4 flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full">
            <button
              onClick={handleDownloadDuelCard}
              className="w-full xs:w-auto py-2.5 px-5 bg-[#333333] hover:bg-[#333333]/90 text-[#ffffff] font-bold text-[12px] uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center"
            >
              SAVE VERSUS CARD PNG
            </button>

            <Link
              href="/"
              className="w-full xs:w-auto py-2.5 px-5 bg-[#ffffff] hover:bg-gray-100 text-[#333333] font-bold text-[12px] uppercase tracking-wider border-2 border-[#333333] transition-colors text-center"
            >
              GO TO FULL ROAST VIEW
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-[11px] text-[#333333] font-bold uppercase pt-4">
        YouTube Roast Duel • Compare attention spans with friends
      </footer>
    </div>
  );
}

export default function DuelPage() {
  return (
    <Suspense fallback={<div className="text-[#333333] text-center py-20 font-bold">LOADING DUEL ARENA...</div>}>
      <DuelArena />
    </Suspense>
  );
}
