"use client";

import { useEffect, useRef } from "react";
import { useConnect, useAccount } from "wagmi";
import { useFarcaster } from "@/contexts/FarcasterContext";

/**
 * 🔥 Auto-connect wallet di Farcaster mini app
 * Menggunakan Farcaster signer jika tersedia
 */
export function FarcasterAutoConnect() {
  const { connect, connectors } = useConnect();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const { isConnected } = useAccount();
  const hasAttempted = useRef(false);
  const attemptCount = useRef(0);

  useEffect(() => {
    // Validation checks
    if (!ready) {
      console.log("⏳ Farcaster context not ready yet");
      return;
    }

    if (!isMiniApp && !isWarpcast) {
      console.log("ℹ️ Not in Farcaster mini app, skipping auto-connect");
      return;
    }

    if (isConnected) {
      console.log("✅ Already connected!");
      return;
    }

    if (hasAttempted.current && attemptCount.current >= 3) {
      console.log("⚠️ Max auto-connect attempts reached");
      return;
    }

    attemptCount.current += 1;
    console.log(`🔍 Auto-connect attempt ${attemptCount.current}/3...`);

    const timer = setTimeout(async () => {
      try {
        // Try to get Farcaster context first
        let farcasterSignerAvailable = false;

        try {
          const { sdk } = await import("@farcaster/miniapp-sdk");
          const context = await sdk.context;

          if (context?.user?.fid) {
            console.log("✅ Farcaster context found:", context.user.fid);
            farcasterSignerAvailable = true;
          }
        } catch (e) {
          console.log("ℹ️ Farcaster SDK not available");
        }

        // Find injected connector
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        console.log("📊 Debug info:", {
          attempt: attemptCount.current,
          connectorFound: !!injectedConnector,
          windowEthereumExists: !!window.ethereum,
          farcasterSignerAvailable,
          connectorType: injectedConnector?.type,
          connectorId: injectedConnector?.id,
        });

        if (!injectedConnector) {
          console.warn("⚠️ No injected connector available, retrying...");
          return;
        }

        // Try to connect
        console.log("🔗 Attempting to connect wallet...");

        connect({ connector: injectedConnector });
        hasAttempted.current = true;

        console.log("🎉 Auto-connect triggered!");
      } catch (error) {
        console.error("❌ Auto-connect error:", error);
      }
    }, 500 * attemptCount.current); // Exponential backoff: 500ms, 1s, 1.5s

    return () => clearTimeout(timer);
  }, [ready, isMiniApp, isWarpcast, isConnected, connect, connectors]);

  return null;
}
