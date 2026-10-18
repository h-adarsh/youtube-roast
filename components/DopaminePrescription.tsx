"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { DopaminePrescription as PrescriptionType } from "@/lib/types";

interface DopaminePrescriptionProps {
  prescription?: PrescriptionType;
  patientName?: string;
  brainrotScore: number;
}

export function DopaminePrescription({
  prescription,
  patientName = "Patient",
  brainrotScore,
}: DopaminePrescriptionProps) {
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Fallback default prescription if not generated
  const rx = prescription || {
    diagnosis: "Stage 3 Acute Algorithmic Neuro-Degeneration",
    stage: `Stage ${Math.min(4, Math.max(1, Math.ceil(brainrotScore / 25)))} Brainrot`,
    dosages: [
      "45 minutes of mandatory barefoot exposure to direct soil/grass (Touch Grass Protocol)",
      "Strict 14-day quarantine from Subway Surfers split-screen gameplay and AI voiceovers",
      "Immediate unsubscription from creators watched after 1:30 AM",
      "Permanent deletion of all 954 untouched videos in 'Watch Later'",
    ],
    warning:
      "Failure to complete this regimen will result in irreversible attention span decay, causing inability to read books or look away from vertical scrolling.",
  };

  const handleDownload = async () => {
    if (!prescriptionRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(prescriptionRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `dopamine-prescription-${patientName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error("Prescription export error:", err);
      alert("Failed to export prescription image. Please take a screenshot!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 xs:p-5 sm:p-8 bg-[#ffffff] border-2 border-[#333333] my-5 sm:my-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 pb-3.5 sm:pb-4 border-b-2 border-[#333333]">
        <div>
          <h3 className="font-display text-[20px] xs:text-[22px] sm:text-[26px] text-[#333333] uppercase flex items-center gap-2">
            <span>DOPAMINE PRESCRIPTION</span>
            <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 bg-[#ffe600] border border-[#333333] text-[#333333] font-bold">
              OFFICIAL RX
            </span>
          </h3>
          <p className="text-[11px] sm:text-[12px] text-[#333333] font-bold uppercase tracking-wider">
            Department of Algorithmic Rehabilitation
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full sm:w-auto py-2.5 px-4 bg-[#333333] text-[#ffffff] hover:bg-[#333333]/90 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer text-center"
        >
          {downloaded ? "✓ DOWNLOADED RX!" : isExporting ? "PRINTING..." : "SAVE PRESCRIPTION PNG"}
        </button>
      </div>

      {/* The Printable Medical Pad */}
      <div className="flex justify-center w-full overflow-hidden">
        <div
          ref={prescriptionRef}
          className="w-full max-w-xl bg-[#ffffff] border-2 border-[#333333] p-4 xs:p-5 sm:p-7 relative text-left"
        >
          {/* Clinic Header */}
          <div className="flex flex-col xs:flex-row items-start justify-between gap-2 border-b-2 border-[#333333] pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div>
              <h4 className="font-display text-[18px] sm:text-[20px] text-[#333333] uppercase leading-tight">
                Dr. Neuro S. Croll, MD
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-[#333333] font-medium">
                Chair of Psychoneurological Attention Span Recovery
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-[#333333] font-bold">License #BR-99420-COOKED</p>
            </div>

            <div className="xs:text-right mt-1 xs:mt-0">
              <span className="font-display text-[20px] sm:text-[24px] text-[#ef3b2c] block leading-none">
                Rx #{((Math.abs(patientName.length * 137 + brainrotScore * 941 + 104231) % 900000) + 100000)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#333333]">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 pb-3 mb-3.5 sm:mb-4 border-b-2 border-[#333333] text-[12px]">
            <div>
              <span className="text-[#333333] block text-[9.5px] sm:text-[10px] uppercase font-bold">Patient Name:</span>
              <span className="text-[#333333] font-black text-[13px] sm:text-[14px] truncate block">{patientName}</span>
            </div>
            <div>
              <span className="text-[#333333] block text-[9.5px] sm:text-[10px] uppercase font-bold">Brainrot Index:</span>
              <span className="text-[#ef3b2c] font-black text-[13px] sm:text-[14px] block">
                {brainrotScore} / 100 <span className="text-[#007fff]">({rx.stage})</span>
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 bg-[#ffe600] border-2 border-[#333333]">
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider font-black text-[#333333] block mb-0.5">
              Clinical Diagnosis:
            </span>
            <p className="text-[12px] sm:text-[13px] font-bold text-[#333333] leading-snug">{rx.diagnosis}</p>
          </div>

          {/* Rx Instructions / Dosages */}
          <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
            <span className="text-[11px] sm:text-[12px] font-black text-[#333333] uppercase tracking-wider block">
              PRESCRIBED TREATMENT (DOSAGE):
            </span>
            <ul className="space-y-2">
              {rx.dosages.map((dosage, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 sm:gap-2.5 text-[11px] sm:text-[12px] text-[#333333] bg-[#ffffff] p-2 sm:p-2.5 border-2 border-[#333333]"
                >
                  <span className="font-bold text-[#ef3b2c] shrink-0">0{i + 1}.</span>
                  <span className="leading-snug">{dosage}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Note */}
          <div className="p-2.5 sm:p-3 bg-[#ffffff] border-2 border-[#ef3b2c] text-[11px] sm:text-[12px] text-[#333333] mb-5 sm:mb-6">
            <p className="leading-relaxed">
              <strong className="text-[#ef3b2c] uppercase font-black">Black Box Warning: </strong>
              {rx.warning}
            </p>
          </div>

          {/* Signature & Seal */}
          <div className="flex flex-col xs:flex-row items-start xs:items-end justify-between gap-3 pt-3.5 sm:pt-4 border-t-2 border-[#333333]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#ef3b2c] flex items-center justify-center -rotate-6 bg-[#ffffff]">
                <span className="text-[8px] sm:text-[9px] font-black text-[#ef3b2c] uppercase tracking-tighter text-center leading-tight">
                  SEVERELY<br />COOKED
                </span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] text-[#333333] font-bold uppercase">Hospital Verification Seal</span>
            </div>

            <div className="xs:text-right w-full xs:w-auto">
              <div className="font-display text-[15px] sm:text-[16px] text-[#333333]">
                Dr. N. S. Croll
              </div>
              <div className="w-24 sm:w-28 border-b-2 border-[#333333] my-0.5 xs:ml-auto" />
              <span className="text-[8.5px] sm:text-[9px] text-[#333333] uppercase font-bold">Attending Physician Sign</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
