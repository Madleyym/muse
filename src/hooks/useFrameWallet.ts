"use client";

import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

interface WalletConnection {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isFrameWallet: boolean;
  provider: any;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// ✅ NEW: Define type for Frame check result
interface FrameCheckResult {
  address: string;
  provider: any;
  isFrame: boolean;
}

export const useFrameWallet = (): WalletConnection => {
  const [state, setState] = useState<{
    address: `0x${string}` | undefined;
    isConnected: boolean;
    isFrameWallet: boolean;
    provider: any;
  }>({
    address: undefined,
    isConnected: false,
    isFrameWallet: false,
    provider: null,
  });

  // ✅ Connect function
  const connect = async () => {
    console.log("[Frame Wallet] 🚀 Connecting...");

    try {
      // Priority 1: Frame Wallet (with timeout)
      if (sdk.wallet?.ethProvider) {
        const provider = sdk.wallet.ethProvider;
        console.log("[Frame Wallet] 🟣 Frame provider detected");

        try {
          // ✅ Add timeout to prevent hanging
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Frame wallet timeout")), 5000)
          );

          const connectPromise = provider.request({
            method: "eth_requestAccounts",
          });

          const accounts = await Promise.race([connectPromise, timeoutPromise]);

          if (accounts && (accounts as any[]).length > 0) {
            const address = (accounts as any[])[0] as `0x${string}`;
            console.log("[Frame Wallet] ✅ Connected:", address);

            setState({
              address,
              isConnected: true,
              isFrameWallet: true,
              provider,
            });

            return;
          }
        } catch (frameError: any) {
          console.error("[Frame Wallet] ❌ Frame error:", frameError.message);

          // ✅ If timeout, try browser wallet as fallback
          if (frameError.message.includes("timeout")) {
            console.log("[Frame Wallet] Frame timeout, trying browser...");
          } else {
            throw new Error("User rejected Frame wallet connection");
          }
        }
      }

      // Priority 2: Browser Wallet (fallback for desktop or if Frame fails)
      if (typeof window !== "undefined" && window.ethereum) {
        console.log("[Frame Wallet] 🦊 Using browser wallet");

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          const address = accounts[0] as `0x${string}`;
          console.log("[Frame Wallet] ✅ Browser connected:", address);

          setState({
            address,
            isConnected: true,
            isFrameWallet: false,
            provider: window.ethereum,
          });

          return;
        }
      }

      throw new Error("No wallet provider available");
    } catch (error: any) {
      console.error("[Frame Wallet] 💥 Connection failed:", error.message);
      throw error;
    }
  };

  // ✅ Disconnect function
  const disconnect = () => {
    console.log("[Frame Wallet] 🔌 Disconnecting...");

    setState({
      address: undefined,
      isConnected: false,
      isFrameWallet: false,
      provider: null,
    });
  };

  // ✅ Auto-check existing connection on mount (with timeout)
  useEffect(() => {
    let mounted = true;

    const checkExistingConnection = async () => {
      try {
        // ✅ Try Frame wallet FIRST (with timeout)
        const timeoutPromise = new Promise<null>(
          (_, reject) =>
            setTimeout(() => reject(new Error("Check timeout")), 2000) // ✅ Faster timeout for check
        );

        const checkFrame = async (): Promise<FrameCheckResult | null> => {
          if (sdk.wallet?.ethProvider) {
            const provider = sdk.wallet.ethProvider;

            const accounts = await provider.request({
              method: "eth_accounts", // ✅ Check existing, no popup
            });

            if (accounts && accounts.length > 0) {
              return { address: accounts[0], provider, isFrame: true };
            }
          }
          return null;
        };

        const frameResult = await Promise.race([
          checkFrame(),
          timeoutPromise,
        ]).catch(() => null);

        if (frameResult && mounted) {
          const address = frameResult.address as `0x${string}`;
          console.log("[Frame Wallet] ✅ Frame auto-connected:", address);

          setState({
            address,
            isConnected: true,
            isFrameWallet: true,
            provider: frameResult.provider,
          });
          return;
        }
      } catch (error: any) {
        console.warn("[Frame Wallet] Frame check failed:", error.message);
      }

      // ✅ Fallback: Check browser wallet
      try {
        if (typeof window !== "undefined" && window.ethereum && mounted) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0 && mounted) {
            const address = accounts[0] as `0x${string}`;
            console.log(
              "[Frame Wallet] ✅ Browser already connected:",
              address
            );

            setState({
              address,
              isConnected: true,
              isFrameWallet: false,
              provider: window.ethereum,
            });
          }
        }
      } catch (error: any) {
        console.warn("[Frame Wallet] Browser check failed:", error.message);
      }
    };

    checkExistingConnection();

    // ✅ Account change listener
    const handleAccountsChanged = (
      accounts: readonly `0x${string}`[] | string[]
    ) => {
      if (!mounted) return;

      if (accounts.length > 0) {
        const address = accounts[0] as `0x${string}`;
        console.log("[Frame Wallet] 🔄 Account changed:", address);

        setState((prev) => ({
          ...prev,
          address,
          isConnected: true,
        }));
      } else {
        console.log("[Frame Wallet] 🔌 Account disconnected");
        disconnect();
      }
    };

    // Setup listeners
    try {
      if (sdk.wallet?.ethProvider?.on) {
        sdk.wallet.ethProvider.on("accountsChanged", handleAccountsChanged);
      }

      if (typeof window !== "undefined" && window.ethereum?.on) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
    } catch (e) {
      console.warn("[Frame Wallet] Listener setup failed:", e);
    }

    return () => {
      mounted = false;

      // Cleanup listeners
      try {
        if (sdk.wallet?.ethProvider?.removeListener) {
          sdk.wallet.ethProvider.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }

        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      } catch (e) {
        console.warn("[Frame Wallet] Cleanup failed:", e);
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
  };
};
