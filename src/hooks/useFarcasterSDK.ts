"use client";

import { useEffect, useState } from "react";

/**
 * Hook untuk initialize Farcaster SDK dan hide splash screen
 * Auto-connect wallet sudah di-handle oleh FarcasterAutoConnect component
 */
export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [farcasterContext, setFarcasterContext] = useState<any>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        if (typeof window !== "undefined") {
          console.log("✅ Farcaster SDK loaded");

          // Get Farcaster context (user info)
          const context = await sdk.context;
          console.log("👤 Farcaster Context:", context);
          setFarcasterContext(context);

          // Hide splash screen
          await sdk.actions.ready();
          console.log("✅ Mini app splash screen hidden");

          setIsReady(true);
        }
      } catch (error) {
        console.log("ℹ️ Not in Farcaster mini app (web mode)");
        setIsReady(true);
      }
    };

    initializeSDK();
  }, []);

  return { isReady, farcasterContext };
}
