"use client";

import React, { useState } from "react";
import { X, Check, Copy, ExternalLink } from "lucide-react";

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupGuideModal({ isOpen, onClose }: SetupGuideModalProps) {
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envTemplate = `# Google OAuth 2.0 Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Gemini API Key (from Google AI Studio - free)
GEMINI_API_KEY=your-gemini-api-key

# Session secret (used for AES-256 encryption)
SESSION_SECRET=super-secret-random-key-at-least-32-chars-long!
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#333333]/70">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border-2 border-[#333333] p-4 sm:p-8 text-left max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-[#333333]">
          <div>
            <h3 className="font-display text-[19px] sm:text-[26px] text-[#333333] uppercase leading-tight">
              OAUTH &amp; GEMINI SETUP
            </h3>
            <p className="text-[10.5px] sm:text-[12px] text-[#333333] font-bold uppercase tracking-wider mt-0.5">
              Run live Google OAuth &amp; Gemini 2.5 Flash on your own keys
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
        <div className="py-4 space-y-4 text-[13px] text-[#333333]">
          <div className="p-4 bg-[#ffe600] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1 flex items-center gap-1.5">
              <span>Step 1: Get Google Cloud OAuth Credentials</span>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[#007fff] inline-flex items-center gap-0.5 hover:underline"
              >
                (Console <ExternalLink className="w-3 h-3" />)
              </a>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[12px] text-[#333333] mt-2">
              <li>Create or select a Google Cloud project.</li>
              <li>Go to <strong>APIs &amp; Services &gt; Library</strong> and enable <strong>YouTube Data API v3</strong>.</li>
              <li>Go to <strong>OAuth consent screen</strong>, select <strong>External</strong>, and add your email under <strong>Test Users</strong>.</li>
              <li>Add scope: <code className="bg-[#ffffff] px-1 py-0.5 border border-[#333333]">https://www.googleapis.com/auth/youtube.readonly</code>.</li>
              <li>Go to <strong>Credentials &gt; Create Credentials &gt; OAuth client ID</strong>.</li>
              <li>Application type: <strong>Web application</strong>.</li>
              <li>
                Authorized redirect URI:
                <code className="bg-[#ffffff] px-1.5 py-0.5 border border-[#333333] block mt-1 font-mono">
                  http://localhost:3000/api/auth/callback
                </code>
              </li>
            </ol>
          </div>

          <div className="p-4 bg-[#ffffff] border-2 border-[#333333]">
            <h4 className="font-bold text-[14px] uppercase mb-1 flex items-center gap-1.5">
              <span>Step 2: Get Free Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#007fff] inline-flex items-center gap-0.5 hover:underline"
              >
                (Google AI Studio <ExternalLink className="w-3 h-3" />)
              </a>
            </h4>
            <p className="text-[12px] text-[#333333] mt-1">
              Create a free API key with one click in Google AI Studio. The app uses <strong>Gemini 2.5 Flash</strong> with structured JSON mode.
            </p>
          </div>

          <div className="p-4 bg-[#ffffff] border-2 border-[#333333]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[14px] uppercase">Step 3: Add to .env.local</h4>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-[#333333] text-[#ffffff] font-bold text-[11px] uppercase border border-[#333333] flex items-center gap-1 cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? "Copied" : "Copy Template"}</span>
              </button>
            </div>
            <pre className="bg-[#ffe600] border-2 border-[#333333] p-3 text-[11px] font-mono overflow-x-auto text-[#333333]">
              {envTemplate}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t-2 border-[#333333] flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#333333] text-[#ffffff] hover:bg-[#333333]/90 font-bold text-[12px] uppercase border-2 border-[#333333] transition-transform active:translate-y-0.5 cursor-pointer"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
