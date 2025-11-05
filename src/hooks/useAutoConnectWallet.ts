"use client";

import { useEffect, useRef } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { useFarcaster } from "@/contexts/FarcasterContext";

export function useAutoConnectWallet() {
  const { connect, connectors, isPending } = useConnect();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const { isConnected } = useAccount();
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Jangan auto-connect jika sudah connected atau belum ready
    if (!ready || isConnected || hasAttempted.current) {
      return;
    }

    // Hanya auto-connect jika di Farcaster mini app atau Warpcast
    if (!isMiniApp && !isWarpcast) {
      return;
    }

    hasAttempted.current = true;

    // Tunggu sebentar untuk wallet inject tersedia
    const timer = setTimeout(() => {
      try {
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (injectedConnector && !isPending) {
          console.log("🔗 Auto-connecting wallet from Farcaster/Warpcast...");
          connect({ connector: injectedConnector });
        } else {
          console.log("⚠️ Injected connector not found or already connecting");
        }
      } catch (error) {
        console.warn("⚠️ Auto-connect failed:", error);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    ready,
    isMiniApp,
    isWarpcast,
    connect,
    connectors,
    isPending,
    isConnected,
  ]);
}
