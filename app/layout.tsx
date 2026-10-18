import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Roast • How Cooked Is Your Attention Span?",
  description:
    "Audit your YouTube habits, sub-60s dopamine traps, and playlists. Get a deterministic Brainrot Score (0–100) and savage AI roast grounded in real creator data.",
  keywords: [
    "YouTube Roast",
    "Brainrot Score",
    "AI Roast",
    "Gemini Roast",
    "Shorts addiction",
    "YouTube taste analyzer",
  ],
  authors: [{ name: "YouTube Roast AI" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  openGraph: {
    title: "YouTube Roast • AI Dopamine Audit",
    description: "Find out your Brainrot Score (0–100) based on your real YouTube watch data.",
    type: "website",
    siteName: "YouTube Roast",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Roast • How Cooked Is Your Attention Span?",
    description: "Get roasted by Gemini AI based on your real YouTube history.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe600",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#ffe600] text-[#333333] antialiased selection:bg-[#007fff] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
