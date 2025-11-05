"use client";

import { useEffect, useState } from "react";

interface FarcasterWalletInfo {
  address?: string;
  verified?: boolean;
}

export function useFarcasterWallet() {
  const [walletInfo, setWalletInfo] = useState<FarcasterWalletInfo | null>(
    null
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dalam Farcaster context dengan wallet info
    const getWalletFromFrame = async () => {
      try {
        // Jika ada Farcaster Frame SDK
        if ((window as any).fd) {
          const user = await (window as any).fd.getUser();
          if (user?.wallet?.address) {
            setWalletInfo({
              address: user.wallet.address,
              verified: true,
            });
          }
        }
      } catch (error) {
        console.log("No Farcaster wallet available");
      }
    };

    getWalletFromFrame();
  }, []);

  return walletInfo;
}
