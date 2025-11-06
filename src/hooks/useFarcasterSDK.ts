"use client";

import { useState, useEffect } from "react";

interface FarcasterSDKUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterSDKUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initSDK = async () => {
      try {
        console.log("[FarcasterSDK] 🚀 Starting initialization...");

        // ✅ Check if running in browser
        if (typeof window === "undefined") {
          console.log("[FarcasterSDK] Not in browser");
          setIsReady(true);
          return;
        }

        // ✅ Dynamic import to avoid SSR issues
        const { default: sdk } = await import("@farcaster/frame-sdk");

        if (!mounted) return;

        // Wait for SDK ready with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SDK timeout (5s)")), 5000)
        );

        await Promise.race([sdk.actions.ready(), timeoutPromise]);

        if (!mounted) return;

        console.log("[FarcasterSDK] ✅ SDK ready, getting context...");

        const context = await sdk.context;

        if (context && context.user) {
          const userData = {
            fid: context.user.fid,
            username: context.user.username || undefined,
            displayName: context.user.displayName || undefined,
            pfpUrl: context.user.pfpUrl || undefined,
          };

          console.log("[FarcasterSDK] ✅ User detected:", userData);
          setUser(userData);
          setIsReady(true);
        } else {
          throw new Error("No user in SDK context");
        }
      } catch (err: any) {
        console.error("[FarcasterSDK] ❌ Init failed:", err.message);

        if (mounted) {
          setError(err.message);
          setIsReady(true);
          setUser(null);
        }
      }
    };

    if (typeof window !== "undefined") {
      initSDK();
    } else {
      setIsReady(true);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return {
    isReady,
    user,
    error,
  };
}
