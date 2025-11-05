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

// Global flag to prevent multiple auto-connect attempts
let autoConnectAttempted = false;

function AutoConnectInFarcaster() {
  const { connect, connectors } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { isMiniApp, ready } = useFarcaster();

  useEffect(() => {
    // Skip if already attempted
    if (autoConnectAttempted) {
      console.log("[AutoConnect] Already attempted, skipping...");
      return;
    }

    // Skip if already connected
    if (isConnected) {
      console.log("[AutoConnect] Already connected");
      return;
    }

    // Skip if not ready or not miniapp
    if (!ready || !isMiniApp) {
      return;
    }

    // Skip if already connecting
    if (isConnecting) {
      console.log("[AutoConnect] Already connecting");
      return;
    }

    console.log("[AutoConnect] Starting auto-connect process...");
    autoConnectAttempted = true;

    const timer = setTimeout(async () => {
      try {
        console.log(
          "[AutoConnect] Available connectors:",
          connectors.map((c) => ({
            id: c.id,
            type: c.type,
            name: c.name,
          }))
        );

        // Find injected connector
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (!injectedConnector) {
          console.error("[Farcaster] Injected connector not found!");

          // Try fallback
          if (connectors.length > 0) {
            const fallbackConnector = connectors[0];
            console.log(
              "[Farcaster] Using fallback connector:",
              fallbackConnector.name
            );
            await connect({ connector: fallbackConnector });
            console.log("[Farcaster] Connected with fallback!");
            return;
          }

          console.error("[Farcaster] No connectors available");
          return;
        }

        console.log("[Farcaster] Found injected connector, connecting...");
        await connect({ connector: injectedConnector });
        console.log("[Farcaster] Successfully connected!");
      } catch (error: any) {
        console.error(
          "[Farcaster] Auto-connect error:",
          error?.message || error
        );
        // Allow retry on next mount if failed
        autoConnectAttempted = false;
      }
    }, 1500); // Increased to 1.5s for stability

    return () => clearTimeout(timer);
  }, [ready, isMiniApp, isConnected, isConnecting, connect, connectors]);

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

      console.log("[Farcaster] Environment Detection:", {
        environment: finalEnvironment,
        isMiniApp: finalIsMiniApp,
        isWarpcast: detectedIsWarpcast,
      });

      setReady(true);
    };

    detectEnvironment();
  }, []); // ✅ Empty deps - run once only

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
