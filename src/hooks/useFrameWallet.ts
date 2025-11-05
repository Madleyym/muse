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
      // Priority 1: Frame Wallet
      if (sdk.wallet?.ethProvider) {
        const provider = sdk.wallet.ethProvider;
        console.log("[Frame Wallet] 🟣 Frame provider detected");

        try {
          // Request accounts (will show approval popup)
          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });

          if (accounts && accounts.length > 0) {
            const address = accounts[0] as `0x${string}`;
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
          throw new Error("User rejected Frame wallet connection");
        }
      }

      // Priority 2: Browser Wallet (fallback for desktop)
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

  // ✅ Auto-check existing connection on mount
  useEffect(() => {
    let mounted = true;

    const checkExistingConnection = async () => {
      try {
        // Check Frame wallet first
        if (sdk.wallet?.ethProvider) {
          const provider = sdk.wallet.ethProvider;

          const accounts = await provider.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0 && mounted) {
            const address = accounts[0] as `0x${string}`;
            console.log("[Frame Wallet] ✅ Already connected:", address);

            setState({
              address,
              isConnected: true,
              isFrameWallet: true,
              provider,
            });
            return;
          }
        }

        // Check browser wallet
        if (typeof window !== "undefined" && window.ethereum) {
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
        console.warn("[Frame Wallet] Check failed:", error.message);
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
