"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useConnect, useAccount } from "wagmi";
import sdk from "@farcaster/frame-sdk";

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
    if (autoConnectAttempted) {
      console.log("[AutoConnect] Already attempted");
      return;
    }

    if (isConnected) {
      console.log("[AutoConnect] ✅ Already connected");
      return;
    }

    if (!ready || !isMiniApp) {
      console.log("[AutoConnect] Not ready or not miniapp");
      return;
    }

    if (isConnecting) {
      console.log("[AutoConnect] Already connecting");
      return;
    }

    if (!isMobile) {
      console.log("[AutoConnect] Desktop - skip auto-connect");
      autoConnectAttempted = true;
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

        const injectedConnector = connectors.find(
          (c) => c.id === "injected" || c.type === "injected"
        );

        if (injectedConnector) {
          console.log("[AutoConnect] 🔌 Connecting with injected...");
          await connect({ connector: injectedConnector });
          console.log("[AutoConnect] ✅ Connected!");
        } else if (connectors.length > 0) {
          console.log("[AutoConnect] Using fallback:", connectors[0].name);
          await connect({ connector: connectors[0] });
          console.log("[AutoConnect] ✅ Connected with fallback!");
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
    if (typeof window === "undefined") return;

    // ✅ ADD: Mounted flag untuk cleanup
    let mounted = true;
    let sdkCheckAborted = false;

    const detectEnvironment = async () => {
      const url = new URL(window.location.href);

      // ✅ DETECTION 1: Device type
      const userAgent = navigator.userAgent.toLowerCase();
      const detectedIsMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
          userAgent
        );
      const detectedIsDesktop = !detectedIsMobile;

      // ✅ DETECTION 2: Warpcast indicators
      const fromWarpcast = document.referrer.includes("warpcast.com");
      const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
      const isIframe = window.self !== window.top;
      const warpcastParam = url.searchParams.get("fc") === "true";

      // ✅ DETECTION 3: Path
      const isMiniAppRoute =
        url.pathname.startsWith("/miniapp") ||
        url.searchParams.has("frameContext");

      // ✅ DETECTION 4: Farcaster SDK (with cleanup)
      let hasFarcasterSDK = false;
      try {
        if (typeof sdk !== "undefined" && sdk.context) {
          // ✅ ADD: AbortController for cleanup
          const abortController = new AbortController();

          const timeoutPromise = new Promise((_, reject) => {
            const timer = setTimeout(() => {
              sdkCheckAborted = true;
              reject(new Error("SDK timeout"));
            }, 2000);

            // Cleanup timeout if aborted
            abortController.signal.addEventListener("abort", () => {
              clearTimeout(timer);
            });
          });

          const contextPromise = sdk.context;

          const context = await Promise.race([contextPromise, timeoutPromise]);

          // ✅ CHECK: Only update if still mounted
          if (!mounted || sdkCheckAborted) {
            console.log(
              "[FarcasterContext] Component unmounted, skipping SDK result"
            );
            return;
          }

          if (context && (context as any).user) {
            hasFarcasterSDK = true;
            console.log("[FarcasterContext] ✅ SDK verified with user data");
          }
        }
      } catch (sdkError) {
        if (!sdkCheckAborted) {
          console.log("[FarcasterContext] SDK not available:", sdkError);
        }
        hasFarcasterSDK = false;
      }

      // ✅ CHECK: Only update state if still mounted
      if (!mounted) {
        console.log(
          "[FarcasterContext] Component unmounted, skipping state update"
        );
        return;
      }

      const detectedIsWarpcast =
        fromWarpcast || hasWarpcastUA || isIframe || warpcastParam;

      const finalIsMiniApp =
        isMiniAppRoute && (hasFarcasterSDK || detectedIsWarpcast);

      let finalEnvironment: "web" | "miniapp" | "warpcast" = "web";

      if (detectedIsWarpcast && hasFarcasterSDK) {
        finalEnvironment = "warpcast";
      } else if (finalIsMiniApp) {
        finalEnvironment = "miniapp";
      }

      console.log("[FarcasterContext] 🔍 Detection Result:", {
        pathname: url.pathname,
        isMiniAppRoute,
        hasFarcasterSDK,
        detectedIsWarpcast,
        detectedIsMobile,
        detectedIsDesktop,
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
    };

    detectEnvironment();

    // ✅ ADD: Cleanup function
    return () => {
      mounted = false;
      sdkCheckAborted = true;
      console.log("[FarcasterContext] Cleanup - component unmounted");
    };
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
