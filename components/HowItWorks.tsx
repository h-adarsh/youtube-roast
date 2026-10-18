"use client";

import Link from "next/link";
import { CartoonCloud } from "./KarlArtwork";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "READ-ONLY SYNC",
      tag: "100% PRIVATE",
      desc: "Connect your YouTube account via Google OAuth (or test instantly with a demo profile). We only request read-only access and immediately revoke tokens after analysis.",
      accent: "bg-[#ffe600]",
    },
    {
      step: "02",
      title: "DOPAMINE AUDIT",
      tag: "HARD NUMBERS",
      desc: "We analyze your sub-60s Shorts ratio, video durations, educational vs entertainment balance, and late-night creator obsessions.",
      accent: "bg-[#007fff] text-[#ffffff]",
    },
    {
      step: "03",
      title: "BRAINROT SCORE",
      tag: "DETERMINISTIC",
      desc: "A mathematical attention-span index from 0 (Pure Zen) to 100 (Terminally Cooked), calculated directly from your real viewing ratios.",
      accent: "bg-[#ffe600]",
    },
    {
      step: "04",
      title: "SAVAGE ROAST & RX",
      tag: "NO MERCY",
      desc: "Gemini 2.5 Flash assigns your archetype, lists your red flags, caught-in-4K habits, and issues a printable medical dopamine detox prescription.",
      accent: "bg-[#ef3b2c] text-[#ffffff]",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-10 w-full bg-[#ffe600] text-[#333333] py-10 sm:py-14 px-3 sm:px-6 relative overflow-hidden border-t-2 border-[#333333]"
    >
      {/* Floating Cartoon Clouds */}
      <div className="absolute top-6 right-10 w-28 pointer-events-none opacity-80 hidden md:block">
        <CartoonCloud className="w-full h-auto" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Signage Title */}
        <div className="inline-block px-3 py-1 bg-[#ffffff] border-2 border-[#333333] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2">
          HOW IT WORKS
        </div>

        <h2 className="font-display text-[26px] xs:text-[34px] sm:text-[46px] md:text-[54px] text-[#333333] leading-heading tracking-tight mb-2 -rotate-1">
          A POP-UP 4-STEP ALGORITHMIC AUTOPSY
        </h2>
        <p className="text-[13px] sm:text-[16px] text-[#333333] max-w-xl mx-auto font-medium mb-7 sm:mb-10 px-2">
          Everything you need to know about how we turn your late-night doomscrolling into cold, hard facts.
        </p>

        {/* 4 Step Cards (0px radius, 2px solid border) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-4 sm:p-5 bg-[#ffffff] border-2 border-[#333333] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className="font-display text-[28px] sm:text-[32px] text-[#333333] leading-none">
                    {item.step}
                  </span>
                  <span className={`text-[9.5px] sm:text-[10px] font-bold uppercase px-2 py-0.5 border border-[#333333] ${item.accent}`}>
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-display text-[16px] sm:text-[18px] text-[#333333] uppercase leading-snug mb-1.5 sm:mb-2">
                  {item.title}
                </h3>

                <p className="text-[11.5px] sm:text-[12px] text-[#333333] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-[#333333] text-[9.5px] sm:text-[10px] font-bold uppercase text-[#333333]/80">
                Step {item.step} of 04
              </div>
            </div>
          ))}
        </div>

        {/* Storybook Call to Action Banner */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-[#ffffff] border-2 border-[#333333] max-w-2xl mx-auto text-center">
          <div className="font-display text-[19px] xs:text-[22px] sm:text-[26px] text-[#333333] uppercase mb-1">
            READY TO FACE YOUR ALGORITHM?
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#333333] mb-3.5 sm:mb-4">
            It takes under 10 seconds. You can connect your Google account or run a demo character.
          </p>
          <Link
            href="/"
            className="inline-block w-full sm:w-auto py-2.5 px-6 bg-[#007fff] text-[#ffffff] hover:bg-[#007fff]/90 border-2 border-[#333333] font-bold text-[12px] sm:text-[13px] uppercase tracking-wider transition-transform active:translate-y-0.5 text-center"
          >
            ROAST MY ACCOUNT NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
