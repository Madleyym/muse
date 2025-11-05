"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useConnect, useAccount, useConnectorClient } from "wagmi";
import { useCallback } from "react";

export interface FarcasterData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  mood: string;
  moodId: string;
  engagementScore: number;
}

export interface FarcasterContextType {
  farcasterData: FarcasterData | null;
  setFarcasterData: (data: FarcasterData | null) => void;
  hasFID: boolean;
  isMiniApp: boolean;
  isWarpcast: boolean;
  environment: "web" | "miniapp" | "warpcast";
  ready: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  farcasterData: null,
  setFarcasterData: () => {},
  hasFID: false,
  isMiniApp: false,
  isWarpcast: false,
  environment: "web",
  ready: false,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

/**
 * 🔥 AUTO-CONNECT di Farcaster mini app
 * Trigger connect via Farcaster SDK signer
 */
function AutoConnectInFarcaster() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Hanya jalankan di Farcaster mini app
    if (!ready || !isMiniApp || !isWarpcast || isConnected || hasTriggered) {
      return;
    }

    setHasTriggered(true);

    const attemptAutoConnect = async () => {
      try {
        console.log("🔥 [Farcaster] Attempting auto-connect...");

        // Cari injected connector
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (!injectedConnector) {
          console.warn("⚠️ [Farcaster] No injected connector found");
          console.log(
            "📊 Available connectors:",
            connectors.map((c) => c.id)
          );
          return;
        }

        console.log("✅ [Farcaster] Injected connector found, connecting...");

        // Try to connect
        const result = connect({ connector: injectedConnector });
        console.log("🎉 [Farcaster] Connect triggered!", result);
      } catch (error) {
        console.error("❌ [Farcaster] Auto-connect error:", error);
      }
    };

    // Small delay untuk ensure window.ethereum ready
    const timer = setTimeout(attemptAutoConnect, 300);
    return () => clearTimeout(timer);
  }, [
    ready,
    isMiniApp,
    isWarpcast,
    isConnected,
    connect,
    connectors,
    hasTriggered,
  ]);

  return null;
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [farcasterData, setFarcasterData] = useState<FarcasterData | null>(
    null
  );
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isWarpcast, setIsWarpcast] = useState(false);
  const [environment, setEnvironment] = useState<
    "web" | "miniapp" | "warpcast"
  >("web");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const fromWarpcast = document.referrer.includes("warpcast.com");
    const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
    const isIframe = window.self !== window.top;
    const warpcastParam = url.searchParams.get("fc") === "true";

    const detectedIsWarpcast =
      fromWarpcast || hasWarpcastUA || isIframe || warpcastParam;
    const isMiniAppRoute = url.pathname.startsWith("/miniapp");

    let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";
    let finalIsMiniApp = false;

    if (detectedIsWarpcast) {
      finalEnvironment = "warpcast";
      finalIsMiniApp = true;
    } else if (isMiniAppRoute) {
      finalEnvironment = "miniapp";
      finalIsMiniApp = true;
    }

    setEnvironment(finalEnvironment);
    setIsMiniApp(finalIsMiniApp);
    setIsWarpcast(detectedIsWarpcast);

    document.body.classList.remove("web-mode", "miniapp-mode", "warpcast-mode");
    document.body.classList.add(`${finalEnvironment}-mode`);

    console.log("🔥 Farcaster Environment:", {
      environment: finalEnvironment,
      isMiniApp: finalIsMiniApp,
      isWarpcast: detectedIsWarpcast,
    });

    setReady(true);
  }, []);

  return (
    <FarcasterContext.Provider
      value={{
        farcasterData,
        setFarcasterData,
        hasFID: !!farcasterData,
        isMiniApp,
        isWarpcast,
        environment,
        ready,
      }}
    >
      <AutoConnectInFarcaster />
      {children}
    </FarcasterContext.Provider>
  );
}
