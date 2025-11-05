"use client";

import { useEffect, useState } from "react";

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // 🔥 Import official SDK
        const { sdk } = await import("@farcaster/miniapp-sdk");

        // Check if we're in a mini app environment
        if (typeof window !== "undefined") {
          console.log("🔥 Farcaster SDK available, calling ready()...");

          // Call ready() to hide splash screen
          await sdk.actions.ready();

          setIsInMiniApp(true);
          console.log("✅ Mini app ready!");
        }
      } catch (error) {
        // SDK not available = web mode
        console.log("ℹ️ Not in mini app environment (web mode):", error);
        setIsInMiniApp(false);
      } finally {
        setIsReady(true);
      }
    };

    initializeSDK();
  }, []);

  return { isReady, isInMiniApp };
}
