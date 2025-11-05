"use client";

import { useEffect, useRef } from "react";
import { useConnect, useAccount } from "wagmi";
import { useFarcaster } from "@/contexts/FarcasterContext";

/**
 * 🔥 Dedicated component untuk auto-connect wallet di Farcaster mini app
 * Component ini harus di-render SEBELUM Header component
 */
export function FarcasterAutoConnect() {
  const { connect, connectors } = useConnect();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const { isConnected } = useAccount();
  const hasAttempted = useRef(false);

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

    if (hasAttempted.current) {
      console.log("⏭️ Auto-connect already attempted");
      return;
    }

    hasAttempted.current = true;

    // Trigger auto-connect
    console.log("🔍 Starting auto-connect process...");
    console.log(
      "📊 Available connectors:",
      connectors.map((c) => ({ id: c.id, type: c.type }))
    );

    const injectedConnector = connectors.find(
      (c) => c.id === "injected" || c.type === "injected"
    );

    if (!injectedConnector) {
      console.warn("⚠️ No injected connector available");
      return;
    }

    if (!window.ethereum) {
      console.warn(
        "⚠️ window.ethereum not available - wallet extension may not be installed"
      );
      return;
    }

    console.log("✅ Conditions met! Auto-connecting wallet...");

    try {
      connect({ connector: injectedConnector });
      console.log("🎉 Auto-connect triggered successfully!");
    } catch (error) {
      console.error("❌ Auto-connect failed:", error);
    }
  }, [ready, isMiniApp, isWarpcast, isConnected, connect, connectors]);

  // Component tidak render anything - hanya trigger side effects
  return null;
}
