"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FarcasterData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  mood: string;
  moodId: string;
  engagementScore: number;
}

interface FarcasterContextType {
  farcasterData: FarcasterData | null;
  setFarcasterData: (data: FarcasterData | null) => void;
  hasFID: boolean;
  isMiniApp: boolean; // 🔥 NEW
}

const FarcasterContext = createContext<FarcasterContextType>({
  farcasterData: null,
  setFarcasterData: () => {},
  hasFID: false,
  isMiniApp: false,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [farcasterData, setFarcasterData] = useState<FarcasterData | null>(
    null
  );
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    // 🔥 Detect Mini App Environment
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isMini =
      url.pathname.startsWith("/miniapp") ||
      url.searchParams.get("miniApp") === "true" ||
      url.searchParams.get("fc") === "true" ||
      document.referrer.includes("warpcast.com");

    setIsMiniApp(isMini);

    // 🔥 Add visual indicator for Mini App
    if (isMini) {
      document.body.classList.add("miniapp-mode");
    }
  }, []);

  return (
    <FarcasterContext.Provider
      value={{
        farcasterData,
        setFarcasterData,
        hasFID: !!farcasterData,
        isMiniApp,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}
