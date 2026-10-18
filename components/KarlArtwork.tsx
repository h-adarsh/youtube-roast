"use client";

import React from "react";

/**
 * Puffy cartoon cloud in Karl's storybook style (Cloud White #ffffff with Charcoal #333333 linework).
 */
export function CartoonCloud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 70"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 55 H115 C126 55 135 46 135 35 C135 24 125 16 114 17 C110 8 98 2 85 2 C74 2 64 8 60 16 C55 12 47 10 40 13 C30 17 25 26 26 36 C14 37 5 45 5 55 Z"
        fill="#ffffff"
        stroke="#333333"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-illustrated Dutch canal houses with coral roofs (#ef3b2c), muted facades, and white windows.
 */
export function DutchCanalHouses({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 210"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House 1 - Stepped Gable */}
      <g>
        {/* Facade */}
        <rect x="10" y="80" width="75" height="130" fill="#e5e5dc" stroke="#333333" strokeWidth="2.5" />
        {/* Stepped Gable Roof */}
        <path
          d="M10 80 H20 V65 H30 V50 H47.5 V35 H57.5 V50 H65 V65 H75 V80 H85 Z"
          fill="#ef3b2c"
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Windows */}
        <rect x="25" y="95" width="16" height="20" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <line x1="33" y1="95" x2="33" y2="115" stroke="#333333" strokeWidth="1.5" />
        <line x1="25" y1="105" x2="41" y2="105" stroke="#333333" strokeWidth="1.5" />

        <rect x="54" y="95" width="16" height="20" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <line x1="62" y1="95" x2="62" y2="115" stroke="#333333" strokeWidth="1.5" />
        <line x1="54" y1="105" x2="70" y2="105" stroke="#333333" strokeWidth="1.5" />

        <rect x="25" y="130" width="16" height="20" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="54" y="130" width="16" height="20" fill="#ffffff" stroke="#333333" strokeWidth="2" />

        {/* Door */}
        <path d="M38 175 H57 V210 H38 Z" fill="#333333" />
      </g>

      {/* House 2 - Bell Gable (Coral Facade Accent) */}
      <g>
        {/* Facade */}
        <rect x="90" y="60" width="85" height="150" fill="#d8d5cb" stroke="#333333" strokeWidth="2.5" />
        {/* Bell Gable */}
        <path
          d="M90 60 Q110 60 115 45 Q125 20 132.5 15 Q140 20 150 45 Q155 60 175 60 Z"
          fill="#ef3b2c"
          stroke="#333333"
          strokeWidth="2.5"
        />
        {/* Top hoist beam */}
        <line x1="132.5" y1="35" x2="132.5" y2="25" stroke="#333333" strokeWidth="3" />
        <circle cx="132.5" cy="22" r="3" fill="#333333" />

        {/* Windows */}
        <rect x="105" y="75" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <line x1="114" y1="75" x2="114" y2="97" stroke="#333333" strokeWidth="1.5" />
        <line x1="105" y1="86" x2="123" y2="86" stroke="#333333" strokeWidth="1.5" />

        <rect x="142" y="75" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <line x1="151" y1="75" x2="151" y2="97" stroke="#333333" strokeWidth="1.5" />
        <line x1="142" y1="86" x2="160" y2="86" stroke="#333333" strokeWidth="1.5" />

        <rect x="105" y="115" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="142" y="115" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />

        {/* Arched Door */}
        <path d="M120 170 C120 162 145 162 145 170 V210 H120 Z" fill="#ef3b2c" stroke="#333333" strokeWidth="2" />
      </g>

      {/* House 3 - Triangle Gable with Tall Windows */}
      <g>
        <rect x="180" y="75" width="80" height="135" fill="#f0ede4" stroke="#333333" strokeWidth="2.5" />
        {/* Triangular Roof */}
        <polygon points="175,75 220,25 265,75" fill="#ef3b2c" stroke="#333333" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Circular attic window */}
        <circle cx="220" cy="55" r="7" fill="#ffffff" stroke="#333333" strokeWidth="2" />

        {/* Windows */}
        <rect x="195" y="90" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="230" y="90" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="195" y="125" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="230" y="125" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />

        <rect x="210" y="172" width="20" height="38" fill="#333333" />
      </g>

      {/* House 4 - Slender Canal House */}
      <g>
        <rect x="265" y="50" width="95" height="160" fill="#e0ddd4" stroke="#333333" strokeWidth="2.5" />
        {/* Stepped roof with chimney */}
        <path
          d="M265 50 H278 V38 H295 V25 H330 V38 H347 V50 H360 Z"
          fill="#ef3b2c"
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="335" y="12" width="8" height="16" fill="#333333" />

        {/* Windows array */}
        <rect x="282" y="65" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="325" y="65" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="282" y="100" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="325" y="100" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="282" y="135" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="325" y="135" width="16" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />

        <rect x="300" y="175" width="24" height="35" fill="#ef3b2c" stroke="#333333" strokeWidth="2" />
      </g>

      {/* House 5 - Corner Gable */}
      <g>
        <rect x="365" y="85" width="85" height="125" fill="#d4d1c5" stroke="#333333" strokeWidth="2.5" />
        <polygon points="360,85 407.5,45 455,85" fill="#ef3b2c" stroke="#333333" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="380" y="102" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="415" y="102" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="380" y="136" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <rect x="415" y="136" width="18" height="22" fill="#ffffff" stroke="#333333" strokeWidth="2" />
        <path d="M395 175 H418 V210 H395 Z" fill="#333333" />
      </g>

      {/* Street ground line */}
      <line x1="0" y1="209" x2="460" y2="209" stroke="#333333" strokeWidth="3" />
    </svg>
  );
}
