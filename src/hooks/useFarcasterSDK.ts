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
        // ✅ SAFE: Dynamic import to avoid crash
        const sdk = await import("@farcaster/frame-sdk").then((m) => m.default);

        if (!mounted) return;

        console.log("[Farcaster SDK] Starting init...");

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SDK timeout")), 5000)
        );

        await Promise.race([sdk.actions.ready(), timeoutPromise]);

        if (!mounted) return;

        const context = await sdk.context;

        if (context && context.user) {
          const userData = {
            fid: context.user.fid,
            username: context.user.username || undefined,
            displayName: context.user.displayName || undefined,
            pfpUrl: context.user.pfpUrl || undefined,
          };

          console.log("[Farcaster SDK] ✅ User:", userData);
          setUser(userData);
          setIsReady(true);
        } else {
          throw new Error("No user in context");
        }
      } catch (err: any) {
        console.error("[Farcaster SDK] ❌ Error:", err.message);

        // ✅ SAFE: Set ready even on error
        if (mounted) {
          setError(err.message);
          setIsReady(true);
          setUser(null);
        }
      }
    };

    // ✅ SAFE: Only init in browser
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
