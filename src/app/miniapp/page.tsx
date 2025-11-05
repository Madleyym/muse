"use client";

import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useEffect } from "react";

export default function MiniAppPage() {
  const { environment, ready } = useFarcaster();

  useEffect(() => {
    if (ready) {
      console.log("📱 MiniApp Page Loaded - Environment:", environment);
    }
  }, [ready, environment]);

  if (!ready) {
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

export const metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Mint NFTs based on your Farcaster social activity",
  // 🔥 CRITICAL: Farcaster Frame embed meta tags
  openGraph: {
    title: "Muse - Mint Your Mood NFT",
    description: "Mint NFTs based on your Farcaster social activity",
    url: "https://muse.write3.fun/miniapp",
    type: "website",
    images: [
      {
        url: "https://muse.write3.fun/assets/Logo/Muse.png",
        width: 1024,
        height: 1024,
        alt: "Muse Logo",
      },
    ],
  },
  other: {
    // 🔥 Farcaster Mini App Frame Tags
    "fc:frame": "vNext",
    "fc:frame:image": "https://muse.write3.fun/assets/Logo/Muse.png",
    "fc:frame:post_url": "https://muse.write3.fun/miniapp",
    "fc:frame:button:1": "Start Minting",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://muse.write3.fun/miniapp",
  },
};
