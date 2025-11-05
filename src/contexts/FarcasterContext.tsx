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
  isConnecting: boolean;
  connectionError: string | null;
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
  isConnecting: false,
  connectionError: null,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

function AutoConnectInFarcaster() {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { isMiniApp, ready } = useFarcaster();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    console.log("[AutoConnect] Checking conditions:", {
      ready,
      isMiniApp,
      isConnected,
      isConnecting,
      isPending,
      hasTriggered,
      connectorsCount: connectors.length,
    });

    if (
      !ready ||
      !isMiniApp ||
      isConnected ||
      isConnecting ||
      isPending ||
      hasTriggered
    ) {
      console.log("[AutoConnect] ❌ Skipping - condition not met");
      return;
    }

    setHasTriggered(true);

    console.log(
      "[Farcaster Mini App] ⏳ Attempting auto-connect to native wallet..."
    );

    const timer = setTimeout(async () => {
      try {
        console.log(
          "[AutoConnect] 🔍 Available connectors:",
          connectors.map((c) => ({
            id: c.id,
            type: c.type,
            name: c.name,
          }))
        );

        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (!injectedConnector) {
          console.error("[Farcaster] ❌ Injected connector not found!");
          console.log(
            "[Farcaster] Trying fallback - first available connector..."
          );

          if (connectors.length > 0) {
            const fallbackConnector = connectors[0];
            console.log("[Farcaster] Using fallback connector:", {
              id: fallbackConnector.id,
              type: fallbackConnector.type,
              name: fallbackConnector.name,
            });

            await connect({ connector: fallbackConnector });
            console.log("[Farcaster] ✅ Connected with fallback!");
            return;
          }

          setHasTriggered(false);
          return;
        }

        console.log("[Farcaster] ✅ Found Farcaster native wallet (injected)");
        console.log("[Farcaster] 🔌 Connecting with injected connector...");

        await connect({ connector: injectedConnector });

        console.log("[Farcaster] ✅ Successfully connected to Farcaster!");
      } catch (error: any) {
        console.error(
          "[Farcaster] ❌ Auto-connect error:",
          error?.message || error
        );
        setHasTriggered(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    ready,
    isMiniApp,
    isConnected,
    isConnecting,
    isPending,
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
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { isConnecting } = useAccount();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectEnvironment = () => {
      const url = new URL(window.location.href);

      const fromWarpcast = document.referrer.includes("warpcast.com");
      const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
      const isIframe = window.self !== window.top;
      const warpcastParam = url.searchParams.get("fc") === "true";

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

      setEnvironment(finalEnvironment);
      setIsMiniApp(finalIsMiniApp);
      setIsWarpcast(detectedIsWarpcast);
      setIsAutoConnecting(finalIsMiniApp);

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

    detectEnvironment();

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
        isConnecting,
        connectionError,
      }}
    >
      <AutoConnectInFarcaster />
      {children}
    </FarcasterContext.Provider>
  );
}
