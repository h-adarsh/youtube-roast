"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LoadingRoast } from "@/components/LoadingRoast";
import { RoastResultView } from "@/components/RoastResultView";
import { ShareCardModal } from "@/components/ShareCardModal";
import { PrivacyModal } from "@/components/PrivacyModal";
import { DeleteDataModal } from "@/components/DeleteDataModal";
import { SetupGuideModal } from "@/components/SetupGuideModal";
import { HowItWorks } from "@/components/HowItWorks";
import { DemoProfile } from "@/lib/demo-data";
import { RoastLanguage, RoastResult, RoastSeverity } from "@/lib/types";

function YouTubeRoastApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [result, setResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => searchParams.get("auth_error"));

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Fetch an existing cached roast by ID
  const fetchCachedRoast = React.useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/roast/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setResult(data.result);
        }
      }
    } catch (err) {
      console.error("Error fetching cached roast:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger roast from active Google OAuth session
  const triggerLiveRoast = React.useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
        router.replace("/");
      } else {
        setAuthError(data.error || "Failed to process YouTube roast.");
      }
    } catch (err) {
      console.error("Error in live roast:", err);
      setAuthError("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Handle URL parameters on initial load
  useEffect(() => {
    const roastId = searchParams.get("roast_id");
    const action = searchParams.get("action");

    if (roastId) {
      const timer = setTimeout(() => {
        void fetchCachedRoast(roastId);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (action === "generate_roast") {
      const timer = setTimeout(() => {
        void triggerLiveRoast();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, fetchCachedRoast, triggerLiveRoast]);

  // Trigger roast from selected Demo Profile with language and severity
  const handleSelectDemoProfile = async (
    profile: DemoProfile,
    language: RoastLanguage,
    severity: RoastSeverity
  ) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demoProfileId: profile.id,
          language,
          severity,
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
      } else {
        setAuthError(data.error || "Failed to generate demo roast.");
      }
    } catch (err) {
      console.error("Error in demo roast:", err);
      setAuthError("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGoogleAuth = (language: RoastLanguage, severity: RoastSeverity) => {
    setIsLoading(true);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/api/auth/google?lang=${encodeURIComponent(language)}&severity=${encodeURIComponent(
      severity
    )}`;
  };

  const handleRoastAgain = () => {
    setResult(null);
    router.replace("/");
  };

  const handleDataDeleted = () => {
    setResult(null);
    router.replace("/");
  };

  // Scroll to #how-it-works if hash is present on mount or state change
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#how-it-works" && !result && !isLoading) {
      const timer = setTimeout(() => {
        const el = document.getElementById("how-it-works");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [result, isLoading]);

  const handleNavigateHowItWorks = () => {
    if (result) {
      setResult(null);
    }
    setTimeout(() => {
      const el = document.getElementById("how-it-works");
      el?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#how-it-works");
    }, 80);
  };

  const handleGoHome = () => {
    if (result) {
      setResult(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-roast-fire selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenDelete={() => setShowDeleteModal(true)}
        hasActiveResult={!!result}
        onNavigateHowItWorks={handleNavigateHowItWorks}
        onGoHome={handleGoHome}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {isLoading ? (
          <LoadingRoast />
        ) : result ? (
          <RoastResultView
            result={result}
            onRoastAgain={handleRoastAgain}
            onOpenShareModal={() => setShowShareModal(true)}
            onOpenDelete={() => setShowDeleteModal(true)}
          />
        ) : (
          <>
            <Hero
              onStartGoogleAuth={handleStartGoogleAuth}
              onSelectDemoProfile={handleSelectDemoProfile}
              isLoading={isLoading}
              onOpenPrivacy={() => setShowPrivacyModal(true)}
              authError={authError}
              onOpenSetupGuide={() => setShowSetupModal(true)}
            />
            <HowItWorks />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#333333] py-5 sm:py-6 px-3 sm:px-4 text-center text-[11px] sm:text-[12px] text-[#333333] bg-[#ffe600]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-bold uppercase">
          <p>© {new Date().getFullYear()} YouTube Roast • Pop-Up Storybook Diorama</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[#333333]">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <Link href="/duel" className="hover:underline">
              Duel Arena ⚔️
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {result && (
        <ShareCardModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          result={result}
        />
      )}

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <DeleteDataModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        roastId={result?.id}
        onDeletedSuccess={handleDataDeleted}
      />

      <SetupGuideModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingRoast />}>
      <YouTubeRoastApp />
    </Suspense>
  );
}
