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
          console.log("[AutoConnect] ✅ Connected!");
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

        // Warpcast/Farcaster indicators
        const fromWarpcast = document.referrer.includes("warpcast.com");
        const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
        const hasFarcasterUA = navigator.userAgent.includes("Farcaster");
        const isIframe = window.self !== window.top;
        const warpcastParam = url.searchParams.get("fc") === "true";

        // Path check
        const isMiniAppRoute = url.pathname.startsWith("/miniapp");

        // ✅ CRITICAL: Check for Farcaster SDK
        let hasFarcasterSDK = false;
        try {
          // Check if window.farcaster exists (injected by Farcaster app)
          if ((window as any).farcaster !== undefined) {
            hasFarcasterSDK = true;
            console.log("[FarcasterContext] ✅ SDK found via window.farcaster");
          }
        } catch (e) {
          console.log("[FarcasterContext] SDK check failed");
        }

        const detectedIsWarpcast =
          fromWarpcast ||
          hasWarpcastUA ||
          hasFarcasterUA ||
          isIframe ||
          warpcastParam;

        // ✅ KEY LOGIC: MiniApp = /miniapp path AND (SDK exists OR Warpcast indicators)
        const finalIsMiniApp =
          isMiniAppRoute && (hasFarcasterSDK || detectedIsWarpcast);

        let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";

        if (finalIsMiniApp) {
          if (detectedIsWarpcast && hasFarcasterSDK) {
            finalEnvironment = "warpcast";
          } else {
            finalEnvironment = "miniapp";
          }
        }

        console.log("[FarcasterContext] 🎯 Detection Result:", {
          pathname: url.pathname,
          isMiniAppRoute,
          hasFarcasterSDK,
          hasWarpcastUA,
          hasFarcasterUA,
          fromWarpcast,
          isIframe,
          detectedIsWarpcast,
          detectedIsMobile,
          finalIsMiniApp,
          finalEnvironment,
          userAgent: userAgent.substring(0, 50),
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
        console.error("[FarcasterContext] ❌ Error:", error);
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
