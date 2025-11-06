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
  isMobile: boolean;
  isDesktop: boolean;
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

let autoConnectAttempted = false;

function AutoConnectInFarcaster() {
  const { connect, connectors } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { isMiniApp, isMobile, ready } = useFarcaster();

  useEffect(() => {
    if (
      autoConnectAttempted ||
      isConnected ||
      !ready ||
      !isMiniApp ||
      isConnecting ||
      !isMobile
    ) {
      return;
    }

    console.log("[AutoConnect] 🚀 Starting...");
    autoConnectAttempted = true;

    const timer = setTimeout(async () => {
      try {
        if (connectors.length === 0) return;

        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (injectedConnector) {
          await connect({ connector: injectedConnector });
        } else if (connectors.length > 0) {
          await connect({ connector: connectors[0] });
        }
      } catch (error: any) {
        console.error("[AutoConnect] ❌ Error:", error?.message);
        autoConnectAttempted = false;
      }
    }, 2000);

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
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [environment, setEnvironment] = useState<
    "web" | "miniapp" | "warpcast"
  >("web");
  const [ready, setReady] = useState(false);
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { isConnecting } = useAccount();

  useEffect(() => {
    // ✅ SAFE DETECTION - No crashes
    const detectEnvironment = () => {
      try {
        if (typeof window === "undefined") {
          setReady(true);
          return;
        }

        const url = new URL(window.location.href);

        // Device detection
        const userAgent = navigator.userAgent.toLowerCase();
        const detectedIsMobile =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
            userAgent
          );
        const detectedIsDesktop = !detectedIsMobile;

        // Warpcast detection
        const fromWarpcast = document.referrer.includes("warpcast.com");
        const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
        const isIframe = window.self !== window.top;
        const warpcastParam = url.searchParams.get("fc") === "true";
        const detectedIsWarpcast =
          fromWarpcast || hasWarpcastUA || isIframe || warpcastParam;

        // Path detection
        const isMiniAppRoute =
          url.pathname.startsWith("/miniapp") ||
          url.searchParams.has("frameContext");

        // ✅ SAFE: Check SDK without importing (avoid crash)
        let hasFarcasterSDK = false;
        try {
          if (
            typeof window !== "undefined" &&
            (window as any).farcaster !== undefined
          ) {
            hasFarcasterSDK = true;
            console.log(
              "[FarcasterContext] ✅ SDK detected via window.farcaster"
            );
          }
        } catch (e) {
          console.log("[FarcasterContext] SDK check safe fail");
        }

        // Final decision
        const finalIsMiniApp =
          isMiniAppRoute && (hasFarcasterSDK || detectedIsWarpcast);

        let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";
        if (detectedIsWarpcast && hasFarcasterSDK) {
          finalEnvironment = "warpcast";
        } else if (finalIsMiniApp) {
          finalEnvironment = "miniapp";
        }

        console.log("[FarcasterContext] 🎯 Detection:", {
          pathname: url.pathname,
          isMiniAppRoute,
          hasFarcasterSDK,
          detectedIsWarpcast,
          detectedIsMobile,
          finalIsMiniApp,
          finalEnvironment,
        });

        setEnvironment(finalEnvironment);
        setIsMiniApp(finalIsMiniApp);
        setIsWarpcast(detectedIsWarpcast);
        setIsMobile(detectedIsMobile);
        setIsDesktop(detectedIsDesktop);
        setIsAutoConnecting(finalIsMiniApp && detectedIsMobile);

        document.body.classList.remove(
          "web-mode",
          "miniapp-mode",
          "warpcast-mode"
        );
        document.body.classList.add(`${finalEnvironment}-mode`);

        setReady(true);
      } catch (error: any) {
        console.error("[FarcasterContext] ❌ Detection error:", error);
        // ✅ SAFE: Set defaults on error
        setEnvironment("web");
        setIsMiniApp(false);
        setReady(true);
      }
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
