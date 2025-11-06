"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { usePathname } from "next/navigation"; // ✅ ADD THIS
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
  const pathname = usePathname(); // ✅ ADD PATHNAME CHECK

  // ✅ CRITICAL: Check pathname FIRST (immediate, no async)
  const isOnMiniAppRoute = pathname?.startsWith("/miniapp");

  console.log("[PricingSection] 🔍 Render state:", {
    pathname,
    isOnMiniAppRoute,
    isMiniApp,
    environment,
    ready,
    willRender: isOnMiniAppRoute || isMiniApp ? "MiniApp" : "Website",
  });

  // ✅ If on /miniapp route, ALWAYS use MiniApp (even if context not ready)
  if (isOnMiniAppRoute) {
    console.log("[PricingSection] ✅ Force MiniApp (pathname match)");
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PricingMiniApp />
      </Suspense>
    );
  }

  // ✅ For other routes, wait for context ready
  if (!ready) {
    return <LoadingSpinner />;
  }

  // ✅ Use context detection for non-miniapp routes
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMiniApp ? <PricingMiniApp /> : <PricingWebsite />}
    </Suspense>
  );
}
