"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useConnect, useAccount } from "wagmi";

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
 * 🔥 Auto-connect component - HARUS di dalam provider agar ready = true
 */
function AutoConnectWallet() {
  const { connect, connectors } = useConnect();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const { isConnected } = useAccount();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (!ready || isConnected || hasAttempted) {
      if (!ready) {
        console.log("⏳ Context not ready");
      }
      return;
    }

    if (!isMiniApp && !isWarpcast) {
      console.log("ℹ️ Not in Farcaster mini app");
      return;
    }

    setHasAttempted(true);
    console.log("🔍 Starting auto-connect...");

    const injectedConnector = connectors.find(
      (c) => c.id === "injected" || c.type === "injected"
    );

    console.log("📊 Connector check:", {
      found: !!injectedConnector,
      windowEthereum: !!window.ethereum,
      isMiniApp,
      isWarpcast,
      ready,
    });

    if (!injectedConnector) {
      console.warn("⚠️ No injected connector");
      return;
    }

    if (!window.ethereum) {
      console.warn("⚠️ No window.ethereum");
      return;
    }

    try {
      console.log("🔗 Connecting wallet...");
      connect({ connector: injectedConnector });
      console.log("✅ Connect triggered");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }, [
    ready,
    isMiniApp,
    isWarpcast,
    isConnected,
    connect,
    connectors,
    hasAttempted,
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

    setReady(true);

    console.log("🔥 Farcaster Environment:", {
      environment: finalEnvironment,
      isMiniApp: finalIsMiniApp,
      isWarpcast: detectedIsWarpcast,
    });
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
      {/* 🔥 AutoConnectWallet HARUS di sini - DALAM provider */}
      <AutoConnectWallet />
      {children}
    </FarcasterContext.Provider>
  );
}
