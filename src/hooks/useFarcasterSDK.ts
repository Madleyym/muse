"use client";

import { useEffect, useState } from "react";
import { useFarcaster } from "@/contexts/FarcasterContext";

export interface FarcasterSDKContext {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  client: any;
}

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [sdkContext, setSdkContext] = useState<FarcasterSDKContext | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { setFarcasterData, isMiniApp } = useFarcaster();

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        if (typeof window === "undefined") {
          setIsReady(true);
          return;
        }

        console.log("✅ Farcaster SDK loaded");

        // Get Farcaster context (user info dari SDK)
        const context = await sdk.context;
        console.log("👤 Farcaster SDK Context:", context);

        if (context?.user) {
          const { fid, username, displayName, pfpUrl } = context.user;

          console.log("🖼️ PFP URL dari SDK:", pfpUrl); // ✅ DEBUG

          // ✅ Extract user data
          const userData = {
            fid,
            username: username || "",
            displayName: displayName || username || `User ${fid}`,
            pfpUrl: pfpUrl || "/assets/images/layout/connected.png", // ✅ FALLBACK
          };

          console.log("📱 User Data Extracted:", userData);

          // ✅ Store ke context
          setSdkContext({
            user: userData,
            client: context.client,
          });

          // ✅ Update FarcasterContext dengan user data
          setFarcasterData({
            fid,
            username: userData.username,
            displayName: userData.displayName,
            pfpUrl: userData.pfpUrl,
            mood: "", // Will be set later after mood detection
            moodId: "",
            engagementScore: 0,
          });

          console.log("✅ User profile stored in context:", userData);
        } else {
          console.warn("⚠️ No user context found in SDK");
        }

        // ✅ Hide splash screen
        if (typeof sdk.actions?.ready === "function") {
          await sdk.actions.ready();
          console.log("✅ Mini app splash screen hidden");
        }

        setIsReady(true);
      } catch (error: any) {
        const errorMsg = error?.message || "Failed to initialize Farcaster SDK";
        console.log("ℹ️ Not in Farcaster mini app (web mode):", errorMsg);
        setError(errorMsg);
        setIsReady(true);
      }
    };

    // ✅ Only initialize in miniapp
    if (isMiniApp) {
      initializeSDK();
    } else {
      setIsReady(true);
    }
  }, [isMiniApp, setFarcasterData]);

  return {
    isReady,
    sdkContext,
    error,
    user: sdkContext?.user || null,
  };
}
