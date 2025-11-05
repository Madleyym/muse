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
  isMobile: boolean; // ✅ NEW
  isDesktop: boolean; // ✅ NEW
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
  isMobile: false,
  isDesktop: false,
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
  const { isMiniApp, isMobile, ready } = useFarcaster();

  useEffect(() => {
    // Skip if already attempted
    if (autoConnectAttempted) {
      console.log("[AutoConnect] Already attempted");
      return;
    }

    // Skip if already connected
    if (isConnected) {
      console.log("[AutoConnect] ✅ Already connected");
      return;
    }

    // Skip if not ready or not miniapp
    if (!ready || !isMiniApp) {
      console.log("[AutoConnect] Not ready or not miniapp");
      return;
    }

    // Skip if already connecting
    if (isConnecting) {
      console.log("[AutoConnect] Already connecting");
      return;
    }

    // ✅ On MOBILE: auto-connect
    // ✅ On DESKTOP: skip (user will connect manually)
    if (!isMobile) {
      console.log("[AutoConnect] Desktop - skip auto-connect");
      autoConnectAttempted = true; // Prevent retry loop
      return;
    }

    console.log("[AutoConnect] 🚀 Starting auto-connect (Mobile)...");
    autoConnectAttempted = true;

    const timer = setTimeout(async () => {
      try {
        if (connectors.length === 0) {
          console.error("[AutoConnect] ❌ No connectors available");
          return;
        }

        console.log(
          "[AutoConnect] Available connectors:",
          connectors.map((c) => ({ id: c.id, name: c.name }))
        );

        // Find injected connector
        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (injectedConnector) {
          console.log("[AutoConnect] 🔌 Connecting with injected...");
          await connect({ connector: injectedConnector });
          console.log("[AutoConnect] ✅ Connected!");
        } else if (connectors.length > 0) {
          // Fallback to first available
          console.log("[AutoConnect] Using fallback:", connectors[0].name);
          await connect({ connector: connectors[0] });
          console.log("[AutoConnect] ✅ Connected with fallback!");
        }
      } catch (error: any) {
        console.error("[AutoConnect] ❌ Error:", error?.message);
        // Reset flag to allow retry
        autoConnectAttempted = false;
      }
    }, 2000); // 2s delay for stability

    return () => clearTimeout(timer);
  }, [
    ready,
    isMiniApp,
    isMobile,
    isConnected,
    isConnecting,
    connect,
    connectors,
  ]);

  return null;
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [farcasterData, setFarcasterData] = useState<FarcasterData | null>(
    null
  );
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isWarpcast, setIsWarpcast] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ NEW
  const [isDesktop, setIsDesktop] = useState(false); // ✅ NEW
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

      // ✅ Detect Mobile vs Desktop
      const userAgent = navigator.userAgent.toLowerCase();
      const detectedIsMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
          userAgent
        );
      const detectedIsDesktop = !detectedIsMobile;

      let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";

      if (detectedIsWarpcast) {
        finalEnvironment = "warpcast";
      } else if (isMiniAppRoute) {
        finalEnvironment = "miniapp";
      }

      setEnvironment(finalEnvironment);
      setIsMiniApp(finalIsMiniApp);
      setIsWarpcast(detectedIsWarpcast);
      setIsMobile(detectedIsMobile);
      setIsDesktop(detectedIsDesktop);
      setIsAutoConnecting(finalIsMiniApp && detectedIsMobile); // Only auto-connect on mobile

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
        isMobile: detectedIsMobile,
        isDesktop: detectedIsDesktop,
      });

      setReady(true);
    };

    detectEnvironment();
  }, []);

  return (
    <FarcasterContext.Provider
      value={{
        farcasterData,
        setFarcasterData,
        hasFID: !!farcasterData?.fid,
        isMiniApp,
        isWarpcast,
        isMobile,
        isDesktop,
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
