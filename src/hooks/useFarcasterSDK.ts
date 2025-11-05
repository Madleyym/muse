"use client";

import { useEffect, useState } from "react";

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds

      while (attempts < maxAttempts) {
        if (
          typeof window !== "undefined" &&
          window.farcasterSdk?.actions?.ready
        ) {
          try {
            console.log("✅ SDK found, calling ready()");
            window.farcasterSdk.actions.ready();
            setIsAvailable(true);
            setIsReady(true);
            return;
          } catch (error) {
            console.error("Error calling ready():", error);
            setIsReady(true);
            return;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // SDK not found (web mode)
      console.log("ℹ️ SDK not available - web mode");
      setIsReady(true);
    };

    initSDK();
  }, []);

  return { isReady, isAvailable };
}
