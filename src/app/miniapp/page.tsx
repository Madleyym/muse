"use client";

import MiniAppHeader from "@/components/layout/MiniAppHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useEffect } from "react";

export default function MiniAppPage() {
  const { environment, farcasterData, ready, isConnecting } = useFarcaster();
  const { isReady: sdkReady } = useFarcasterSDK();

  useEffect(() => {
    if (sdkReady && farcasterData) {
      console.log("MiniApp fully loaded:", {
        environment,
        user: farcasterData,
      });
    }
  }, [sdkReady, farcasterData, environment]);

  if (!sdkReady || !ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          {/* <p className="text-gray-600">🚀 Loading Muse...</p> */}
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          <p className="text-gray-600">🔌 Connecting wallet...</p>
        </div>
      </div>
    );
  }

 return (
   <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
     <MiniAppHeader />
     <HeroSection />
     <PricingSection />
     <Footer />
   </main>
 );
}
