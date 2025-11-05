"use client";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useEffect, useState } from "react";

export default function MiniAppPage() {
  const { environment, ready } = useFarcaster();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (ready) {
      console.log("📱 MiniApp Page Loaded - Environment:", environment);

      // 🔥 Initialize Farcaster SDK
      if (typeof window !== "undefined" && window.farcasterSdk) {
        try {
          // Call ready() to hide splash screen
          window.farcasterSdk.actions.ready();
          setSdkReady(true);
          console.log("✅ Farcaster SDK ready() called");
        } catch (error) {
          console.log("⚠️ Farcaster SDK not available:", error);
          setSdkReady(true); // Set ready anyway untuk dev/web mode
        }
      } else {
        // Not in Farcaster frame (web mode)
        setSdkReady(true);
      }
    }
  }, [ready, environment]);

  if (!ready || !sdkReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading Muse...</p>
      </div>
    );
  }

  return (
    <main
      className={`
        bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen
        transition-all duration-300
        ${environment === "warpcast" ? "miniapp-optimized" : ""}
      `}
    >
      {/* 🔥 Show environment indicator in dev */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 px-3 py-1 bg-black text-white text-xs rounded-full z-50">
          {environment.toUpperCase()}
        </div>
      )}

      <Header />
      <HeroSection />
      <PricingSection />
    </main>
  );
}
