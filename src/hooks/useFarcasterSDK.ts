"use client";

import { useEffect, useState } from "react";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { validatePfpUrl } from "@/lib/farcaster";

export interface FarcasterSDKContext {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  client: any;
}

// ✅ Global flag to prevent duplicate initialization across all instances
let sdkInitialized = false;
let sdkInitializing = false;

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [sdkContext, setSdkContext] = useState<FarcasterSDKContext | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { setFarcasterData, isMiniApp } = useFarcaster();

  useEffect(() => {
    // Skip if already initialized or initializing
    if (sdkInitialized || sdkInitializing) {
      console.log(
        "[Farcaster SDK] Already initialized/initializing, skipping..."
      );
      setIsReady(true);
      return;
    }

    // Skip if not in miniapp
    if (!isMiniApp) {
      setIsReady(true);
      return;
    }

    const initializeSDK = async () => {
      // Double check before proceeding
      if (sdkInitialized || sdkInitializing) {
        return;
      }

      sdkInitializing = true;

      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        if (typeof window === "undefined") {
          setIsReady(true);
          sdkInitializing = false;
          return;
        }

        console.log("[Farcaster] SDK loaded successfully");

        // Get Farcaster context
        const context = await sdk.context;
        console.log("[Farcaster] SDK Context:", context);

        if (context?.user) {
          const { fid, username, displayName, pfpUrl } = context.user;

          // Validate PFP URL
          const validPfpUrl = validatePfpUrl(pfpUrl);

          console.log("[Farcaster] PFP URL from SDK:", {
            original: pfpUrl,
            validated: validPfpUrl,
            isValid: !!validPfpUrl,
          });

          const userData = {
            fid,
            username: username || "",
            displayName: displayName || username || `User ${fid}`,
            pfpUrl: validPfpUrl,
          };

          console.log("[Farcaster] User Data Extracted:", userData);

          // Store to context
          setSdkContext({
            user: userData,
            client: context.client,
          });

          // Update FarcasterContext
          setFarcasterData({
            fid,
            username: userData.username,
            displayName: userData.displayName,
            pfpUrl: userData.pfpUrl,
            mood: "",
            moodId: "",
            engagementScore: 0,
          });

          console.log("[Farcaster] User profile stored in context");
        } else {
          console.warn("[Farcaster] No user context found in SDK");
        }

        // Hide splash screen (only once)
        if (typeof sdk.actions?.ready === "function") {
          await sdk.actions.ready();
          console.log("[Farcaster] Mini app splash screen hidden");
        }

        setIsReady(true);
        sdkInitialized = true; // Mark as fully initialized
        sdkInitializing = false;
      } catch (error: any) {
        const errorMsg = error?.message || "Failed to initialize Farcaster SDK";
        console.log(
          "[Farcaster] Not in Farcaster mini app (web mode):",
          errorMsg
        );
        setError(errorMsg);
        setIsReady(true);
        sdkInitializing = false;
      }
    };

    initializeSDK();
  }, [isMiniApp, setFarcasterData]);

  return {
    isReady,
    sdkContext,
    error,
    user: sdkContext?.user || null,
  };
}
