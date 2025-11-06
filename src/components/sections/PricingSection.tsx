"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

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
  const { isMiniApp, ready, environment } = useFarcaster();
  const pathname = usePathname();

  // ✅ CRITICAL FIX: Pathname check OVERRIDES everything
  const isOnMiniAppRoute = pathname?.startsWith("/miniapp");

  console.log("[PricingSection] 🔍 Render state:", {
    pathname,
    isOnMiniAppRoute,
    isMiniApp,
    environment,
    ready,
    willRender: isOnMiniAppRoute
      ? "MiniApp (FORCED)"
      : isMiniApp
      ? "MiniApp (Context)"
      : "Website",
  });

  // ✅ FIX 1: If pathname is /miniapp, ALWAYS use MiniApp (EVEN IF CONTEXT NOT READY)
  if (isOnMiniAppRoute) {
    console.log("[PricingSection] ✅ FORCED MiniApp (pathname match)");
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PricingMiniApp />
      </Suspense>
    );
  }

  // ✅ FIX 2: For non-miniapp routes, wait for context ready
  if (!ready) {
    console.log("[PricingSection] ⏳ Waiting for context...");
    return <LoadingSpinner />;
  }

  // ✅ FIX 3: Only use context detection for non-miniapp routes
  console.log("[PricingSection] Using context detection:", { isMiniApp });
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMiniApp ? <PricingMiniApp /> : <PricingWebsite />}
    </Suspense>
  );
}
