"use client";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useEffect } from "react";
import Image from "next/image";

export default function MiniAppPage() {
  const { environment, farcasterData, ready, isConnecting } = useFarcaster();
  const { isReady: sdkReady, user: sdkUser } = useFarcasterSDK();

  useEffect(() => {
    if (sdkReady && farcasterData) {
      console.log("📱 MiniApp fully loaded:", {
        environment,
        user: farcasterData,
      });
    }
  }, [sdkReady, farcasterData, environment]);

  // ✅ Loading state - while SDK initializing
  if (!sdkReady || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">🚀 Loading Muse...</p>
        </div>
      </div>
    );
  }

  // ✅ Connecting state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">🔌 Connecting wallet...</p>
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
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 px-3 py-1 bg-black text-white text-xs rounded-full z-50 flex items-center gap-2">
          <span>{environment.toUpperCase()}</span>
          {farcasterData && (
            <span className="bg-green-600 px-2 py-0.5 rounded text-[10px]">
              ✓ Connected
            </span>
          )}
        </div>
      )}

      {/* ✅ Profile info banner when connected */}
      {farcasterData && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {farcasterData.pfpUrl && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-300">
                    <Image
                      src={farcasterData.pfpUrl}
                      alt={farcasterData.displayName}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-purple-900">
                    {farcasterData.displayName}
                  </p>
                  <p className="text-xs text-purple-700">
                    @{farcasterData.username} • FID: {farcasterData.fid}
                  </p>
                </div>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-full px-3 py-1 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />
      <HeroSection />
      <PricingSection />
    </main>
  );
}
