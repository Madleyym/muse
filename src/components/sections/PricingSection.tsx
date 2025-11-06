"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamic import to prevent SSR issues
const PricingMiniApp = dynamic(() => import("./PricingMiniApp"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const PricingWebsite = dynamic(() => import("./PricingWebsite"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

function LoadingSpinner() {
  return (
    <section
      id="pricing"
      className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center">
          <div className="animate-spin mx-auto w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          <p className="mt-4 text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    </section>
  );
}

export default function PricingSection() {
  const { isMiniApp, ready } = useFarcaster();

  if (!ready) {
    return <LoadingSpinner />;
  }

  console.log("[PricingSection] Rendering:", isMiniApp ? "MiniApp" : "Website");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMiniApp ? <PricingMiniApp /> : <PricingWebsite />}
    </Suspense>
  );
}
