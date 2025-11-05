"use client";

import { useEffect, useState } from "react";
import { useAutoConnectWallet } from "./useAutoConnectWallet";

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);

  // 🔥 Trigger auto-connect saat SDK siap
  useAutoConnectWallet();

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // 🔥 Import official SDK
        const { sdk } = await import("@farcaster/miniapp-sdk");

        if (typeof window !== "undefined") {
          console.log("✅ Farcaster SDK available, calling ready()...");

          // Call ready() to hide splash screen
          await sdk.actions.ready();
          setIsReady(true);
          console.log("✅ Mini app ready! Splash screen hidden.");
          console.log("🔗 Auto-connect should trigger now...");
        }
      } catch (error) {
        // SDK not available in web mode - OK!
        console.log("ℹ️ Not in mini app (web mode):", error);
        setIsReady(true); // Set ready anyway untuk web
      }
    };

    initializeSDK();
  }, []);

  return { isReady };
}
