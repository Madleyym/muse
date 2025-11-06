"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
});

export function useFarcaster() {
  return useContext(FarcasterContext);
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

        // Check for Farcaster SDK
        let hasFarcasterSDK = false;
        try {
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
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}
