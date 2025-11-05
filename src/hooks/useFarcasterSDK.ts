"use client";

import { useState, useEffect } from "react";
import sdk from "@farcaster/miniapp-sdk";

interface FarcasterSDKUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

// ✅ Keep global flag for safety
let sdkInitialized = false;
let initAttempts = 0;
const MAX_ATTEMPTS = 1;

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterSDKUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initSDK = async () => {
      // ✅ Prevent multiple inits
      if (sdkInitialized || initAttempts >= MAX_ATTEMPTS) {
        console.log("[Farcaster SDK] Already initialized, skipping...");
        setIsReady(true);
        return;
      }

      initAttempts++;

      try {
        console.log("[Farcaster SDK] Starting initialization...");

        // Add timeout for SDK init (3s max)
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
        sdkInitialized = true; // ✅ Mark as initialized
      } catch (err: any) {
        console.error("[Farcaster SDK] ❌ Init failed:", err.message);

        // ✅ CRITICAL: Still set isReady to true
        // This prevents app from hanging indefinitely
        if (mounted) {
          setError(err.message);
          setIsReady(true); // ✅ Allow app to proceed
          setUser(null);
        }
      }
    };

    // Only init in browser
    if (typeof window !== "undefined") {
      initSDK();
    } else {
      setIsReady(true);
    }

    return () => {
      mounted = false;
    };
  }, []); // ✅ Empty deps - only run once

  return {
    isReady,
    user,
    error,
  };
}
