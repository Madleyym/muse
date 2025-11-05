"use client";

import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

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
    let initAttempted = false;

    const initSDK = async () => {
      if (initAttempted) {
        console.log("[Farcaster SDK] Already attempted initialization");
        return;
      }

      initAttempted = true;

      try {
        console.log("[Farcaster SDK] Starting initialization...");

        // Add timeout for SDK init
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SDK init timeout")), 3000)
        );

        const initPromise = sdk.actions.ready();

        await Promise.race([initPromise, timeoutPromise]);

        if (!mounted) return;

        console.log("[Farcaster SDK] ✅ SDK ready");

        // Get context
        const context = await sdk.context;
        console.log("[Farcaster SDK] Context:", context);

        if (!context || !context.user) {
          throw new Error("No user in SDK context");
        }

        const userData = {
          fid: context.user.fid,
          username: context.user.username || undefined,
          displayName: context.user.displayName || undefined,
          pfpUrl: context.user.pfpUrl || undefined,
        };

        console.log("[Farcaster SDK] ✅ User data extracted:", userData);

        setUser(userData);
        setIsReady(true);
      } catch (err: any) {
        console.error("[Farcaster SDK] ❌ Init failed:", err.message);

        // ✅ IMPORTANT: Still set isReady to true so app doesn't hang
        // Just set user to null
        if (mounted) {
          setError(err.message);
          setIsReady(true); // ✅ Allow app to proceed with null user
          setUser(null);
        }
      }
    };

    // Only init in browser
    if (typeof window !== "undefined") {
      initSDK();
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
