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
    if (!ready) return;

    console.log("📱 MiniApp Page - Environment:", environment);

    // 🔥 Initialize Farcaster SDK with timeout fallback
    const initSDK = async () => {
      // Wait for SDK to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds with 100ms intervals

      while (attempts < maxAttempts) {
        if (
          typeof window !== "undefined" &&
          window.farcasterSdk?.actions?.ready
        ) {
          try {
            console.log("✅ Calling sdk.actions.ready()");
            window.farcasterSdk.actions.ready();
            setSdkReady(true);
            return;
          } catch (error) {
            console.error("❌ Error calling ready():", error);
            setSdkReady(true);
            return;
          }
        }

        // Wait 100ms and retry
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // Timeout: SDK not available (probably web mode)
      console.log("⚠️ SDK not available after 5s (web mode?)");
      setSdkReady(true);
    };

    initSDK();
  }, [ready, environment]);

  if (!ready || !sdkReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading Muse...</p>
        </div>
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
          {environment.toUpperCase()} • SDK Ready
        </div>
      )}

      <Header />
      <HeroSection />
      <PricingSection />
    </main>
  );
}
