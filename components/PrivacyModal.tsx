"use client";

import React from "react";
import { X, ExternalLink } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#333333]/70">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border-2 border-[#333333] p-4 sm:p-8 text-left max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#333333]">
          <div>
            <h3 className="font-display text-[19px] sm:text-[26px] text-[#333333] uppercase leading-tight">
              PRIVACY &amp; TRANSPARENCY
            </h3>
            <p className="text-[10.5px] sm:text-[12px] text-[#333333] font-bold uppercase tracking-wider mt-0.5">
              Google API Services User Data &amp; DPDP Compliance Notice
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-[#ffffff] border-2 border-[#333333] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#333333]" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-[13px] text-[#333333] leading-relaxed">
          <div className="p-4 bg-[#ffe600] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1">Minimal, Read-Only Permission</h4>
            <p>
              We only request the <code className="bg-[#ffffff] px-1 py-0.5 border border-[#333333] font-mono">youtube.readonly</code> scope.
              We cannot like, comment, upload, delete, subscribe, or modify anything on your YouTube account.
            </p>
          </div>

          <div className="p-4 bg-[#ffffff] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1">Automatic Token Revocation</h4>
            <p>
              We do not request offline access (no refresh tokens are created). As soon as your roast report is compiled, our backend immediately calls Google&apos;s revoke endpoint (<code className="bg-[#ffe600] px-1 py-0.5 border border-[#333333] font-mono">oauth2.googleapis.com/revoke</code>) to permanently deactivate the access token.
            </p>
          </div>

          <div className="p-4 bg-[#ffffff] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1">Zero Permanent Video Storage (24h TTL)</h4>
            <p>
              Your raw liked videos and playlists are NEVER written to a permanent database. Only the anonymized roast facts and score are kept in a temporary 24-hour cache so you can view and share your card. After 24 hours, all cached records are automatically and irreversibly purged.
            </p>
          </div>

          <div className="p-4 bg-[#ffe600] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1">Gemini AI Data Transparency &amp; Guardrails</h4>
            <p className="mb-2">
              Video titles and channel names are strictly sanitized to prevent prompt injections. Gemini receives only aggregated numbers and sanitized titles. Gemini does NOT receive your email, phone number, address, or billing details.
            </p>
            <p className="text-[12px] opacity-90 border-t border-[#333333]/30 pt-2">
              <strong>Free vs Paid API Notice:</strong> Under Google&apos;s standard terms for free-tier Gemini API keys, prompts may be sampled by Google to improve its models. To ensure 100% zero-retention/no-training processing, use a paid tier Gemini API key or Google Cloud Vertex AI.
            </p>
          </div>

          {/* User Control & Google Link */}
          <div className="pt-2">
            <h4 className="font-bold text-[14px] uppercase mb-1.5">Manage Your Google Permissions Anytime</h4>
            <p className="text-[12px] text-[#333333] mb-3">
              You maintain 100% control over your account. You can verify and remove third-party access anytime directly inside your Google Account:
            </p>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007fff] text-[#ffffff] font-bold text-[12px] uppercase border-2 border-[#333333] hover:bg-[#007fff]/90 transition-colors"
            >
              <span>GOOGLE ACCOUNT SECURITY PERMISSIONS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t-2 border-[#333333] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#333333] text-[#ffffff] hover:bg-[#333333]/90 font-bold text-[12px] uppercase border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}
