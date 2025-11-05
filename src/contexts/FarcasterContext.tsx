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
  isAutoConnecting: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  farcasterData: null,
  setFarcasterData: () => {},
  hasFID: false,
  isMiniApp: false,
  isWarpcast: false,
  environment: "web",
  ready: false,
  isAutoConnecting: false,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

// ✅ COMPONENT untuk auto-connect
function AutoConnectInFarcaster() {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { isMiniApp, isWarpcast, ready } = useFarcaster();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // ❌ Don't proceed jika:
    // - Belum ready
    // - Tidak di mini app
    // - Sudah connected
    // - Sudah pernah trigger
    if (
      !ready ||
      !isMiniApp ||
      !isWarpcast ||
      isConnected ||
      isConnecting ||
      isPending ||
      hasTriggered
    ) {
      return;
    }

    // ✅ Mark as triggered untuk hindari double-connect
    setHasTriggered(true);

    console.log(
      "[Farcaster Mini App] ⏳ Attempting auto-connect to native wallet..."
    );

    // ✅ Delay sebentar biar semua siap
    const timer = setTimeout(async () => {
      try {
        // ✅ Cari connector yang correct
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (!injectedConnector) {
          console.error("[Farcaster] ❌ Injected connector not found!");
          console.log(
            "[Farcaster] Available connectors:",
            connectors.map((c) => ({
              id: c.id,
              type: c.type,
              name: c.name,
            }))
          );
          return;
        }

        console.log("[Farcaster] ✅ Found Farcaster native wallet (injected)");
        console.log("[Farcaster] 🔌 Connecting...");

        // ✅ Connect ke wallet
        await connect({ connector: injectedConnector });

        console.log("[Farcaster] ✅ Successfully connected to Farcaster!");
      } catch (error: any) {
        console.error(
          "[Farcaster] ❌ Auto-connect error:",
          error?.message || error
        );
        // ✅ Allow retry by resetting hasTriggered
        setHasTriggered(false);
      }
    }, 800); // ✅ Increase delay sedikit

    return () => clearTimeout(timer);
  }, [
    ready,
    isMiniApp,
    isWarpcast,
    isConnected,
    isConnecting,
    isPending,
    connect,
    connectors,
    hasTriggered,
  ]);

  return null;
}

// ✅ PROVIDER
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
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectEnvironment = () => {
      const url = new URL(window.location.href);

      // ✅ Multiple ways to detect Farcaster/Warpcast
      const fromWarpcast = document.referrer.includes("warpcast.com");
      const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
      const isIframe = window.self !== window.top;
      const warpcastParam = url.searchParams.get("fc") === "true";

      // ✅ Check mini app route
      const isMiniAppRoute =
        url.pathname.startsWith("/miniapp") ||
        url.searchParams.has("frameContext");

      const detectedIsWarpcast =
        fromWarpcast || hasWarpcastUA || isIframe || warpcastParam;
      const finalIsMiniApp = detectedIsWarpcast || isMiniAppRoute;

      let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";

      if (detectedIsWarpcast) {
        finalEnvironment = "warpcast";
      } else if (isMiniAppRoute) {
        finalEnvironment = "miniapp";
      }

      // ✅ Update states
      setEnvironment(finalEnvironment);
      setIsMiniApp(finalIsMiniApp);
      setIsWarpcast(detectedIsWarpcast);
      setIsAutoConnecting(finalIsMiniApp);

      // ✅ Add body class untuk styling
      document.body.classList.remove(
        "web-mode",
        "miniapp-mode",
        "warpcast-mode"
      );
      document.body.classList.add(`${finalEnvironment}-mode`);

      console.log("[Farcaster] 🌍 Environment Detection:", {
        environment: finalEnvironment,
        isMiniApp: finalIsMiniApp,
        isWarpcast: detectedIsWarpcast,
        isIframe,
        url: url.pathname,
        userAgent: navigator.userAgent.substring(0, 50),
      });

      setReady(true);
    };

    // ✅ Detect immediately
    detectEnvironment();

    // ✅ Also detect on URL change (for SPA)
    const handlePopState = () => detectEnvironment();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <FarcasterContext.Provider
      value={{
        farcasterData,
        setFarcasterData,
        hasFID: !!farcasterData?.fid,
        isMiniApp,
        isWarpcast,
        environment,
        ready,
        isAutoConnecting,
      }}
    >
      {/* ✅ Auto-connect component */}
      <AutoConnectInFarcaster />
      {children}
    </FarcasterContext.Provider>
  );
}
