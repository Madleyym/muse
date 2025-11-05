"use client";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useEffect } from "react";

export default function MiniAppPage() {
  const { environment, ready } = useFarcaster();
  const { isReady: sdkReady, isInMiniApp } = useFarcasterSDK(); // 🔥 USE THIS

  useEffect(() => {
    if (sdkReady) {
      console.log("📱 MiniApp Status:", {
        environment,
        inMiniApp: isInMiniApp,
        ready: sdkReady,
      });
    }
  }, [sdkReady, environment, isInMiniApp]);

  // Show loading only while initializing
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
      `}
    >
      {/* Dev indicator */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 px-3 py-1 bg-black text-white text-xs rounded-full z-50">
          {environment.toUpperCase()} {isInMiniApp ? "✅" : "🌐"}
        </div>
      )}

      <Header />
      <HeroSection />
      <PricingSection />
    </main>
  );
}
