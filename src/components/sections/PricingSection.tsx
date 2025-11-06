"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import PricingMiniApp from "./PricingMiniApp";
import PricingWebsite from "./PricingWebsite";

export default function PricingSection() {
  const { isMiniApp, ready } = useFarcaster();

  // ✅ Wait until detection is complete
  if (!ready) {
    return (
      <section
        id="pricing"
        className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="text-center">
            <div className="animate-spin mx-auto w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ EXTRA SAFETY: Double-check SDK availability
  if (isMiniApp) {
    // Only use MiniApp if we're truly in Farcaster environment
    if (typeof window !== "undefined") {
      try {
        // Check if Farcaster SDK is actually available
        const hasFarcasterSDK = (window as any).farcaster !== undefined;

        if (!hasFarcasterSDK) {
          console.warn(
            "[PricingSection] MiniApp mode but no SDK - using Website"
          );
          return <PricingWebsite />;
        }
      } catch (e) {
        console.warn("[PricingSection] SDK check failed - using Website");
        return <PricingWebsite />;
      }
    }

    console.log("[PricingSection] ✅ Rendering MiniApp");
    return <PricingMiniApp />;
  }

  console.log("[PricingSection] ✅ Rendering Website");
  return <PricingWebsite />;
}
