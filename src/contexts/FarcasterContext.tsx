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

{
  /* ✅ AUTO-CONNECT COMPONENT - FIXED */
}
function AutoConnectInFarcaster() {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected, isConnecting } = useAccount();
  const { isMiniApp, ready } = useFarcaster();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    {
      /* ✅ Conditions untuk auto-connect */
    }
    if (
      !ready ||
      !isMiniApp ||
      isConnected ||
      isConnecting ||
      isPending ||
      hasTriggered
    ) {
      return;
    }

    setHasTriggered(true);

    console.log(
      "[Farcaster Mini App] ⏳ Attempting auto-connect to native wallet..."
    );

    {
      /* ✅ Delay untuk memastikan semua state siap */
    }
    const timer = setTimeout(async () => {
      try {
        {
          /* ✅ Cari injected connector (Farcaster native wallet) */
        }
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
          setHasTriggered(false);
          return;
        }

        console.log("[Farcaster] ✅ Found Farcaster native wallet (injected)");
        console.log("[Farcaster] 🔌 Connecting with injected connector...");

        {
          /* ✅ Trigger connect */
        }
        await connect({ connector: injectedConnector });

        console.log("[Farcaster] ✅ Successfully connected to Farcaster!");
      } catch (error: any) {
        console.error(
          "[Farcaster] ❌ Auto-connect error:",
          error?.message || error
        );
        {
          /* ✅ Allow retry */
        }
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

{
  /* ✅ FARCASTER PROVIDER */
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

      {
        /* ✅ Multiple detection methods untuk Farcaster/Warpcast */
      }
      const fromWarpcast = document.referrer.includes("warpcast.com");
      const hasWarpcastUA = navigator.userAgent.includes("Warpcast");
      const isIframe = window.self !== window.top;
      const warpcastParam = url.searchParams.get("fc") === "true";

      {
        /* ✅ Check mini app route */
      }
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

      {
        /* ✅ Update states */
      }
      setEnvironment(finalEnvironment);
      setIsMiniApp(finalIsMiniApp);
      setIsWarpcast(detectedIsWarpcast);
      setIsAutoConnecting(finalIsMiniApp);

      {
        /* ✅ Add body class untuk styling */
      }
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

    {
      /* ✅ Detect immediately */
    }
    detectEnvironment();

    {
      /* ✅ Also detect on URL change (for SPA) */
    }
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
      {/* ✅ Auto-connect component - render di sini */}
      <AutoConnectInFarcaster />
      {children}
    </FarcasterContext.Provider>
  );
}
