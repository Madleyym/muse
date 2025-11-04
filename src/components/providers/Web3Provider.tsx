"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";

// Define Base Mainnet chain
const base = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11" as `0x${string}`,
      blockCreated: 5022,
    },
  },
};

// Ethereum Mainnet
const mainnet = {
  id: 1,
  name: "Ethereum",
  network: "mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://eth.llamarpc.com"],
    },
    public: {
      http: ["https://eth.llamarpc.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
};

const connectors =
  typeof window !== "undefined"
    ? connectorsForWallets(
        [
          {
            groupName: "🔵 Best for Base",
            wallets: [coinbaseWallet],
          },
          {
            groupName: "Popular Wallets",
            wallets: [
              metaMaskWallet,
              walletConnectWallet,
              rainbowWallet,
              trustWallet,
            ],
          },
        ],
        {
          appName: "Muse - Mint Your Mood",
          projectId: "6036ef8f00ca882753a4d728036495b3",
        }
      )
    : [];

const config = createConfig({
  connectors,
  chains: [base, mainnet] as any,
  transports: {
    [base.id]: http("https://mainnet.base.org"),
    [mainnet.id]: http("https://eth.llamarpc.com"),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

// 🔥 NEW: Auto Connect Component for Mini App
function AutoConnectMiniApp() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    // Only run once
    if (hasAttempted || isConnected) return;

    // Check if in Mini App mode
    const url = new URL(window.location.href);
    const isMiniApp =
      url.pathname.startsWith("/miniapp") ||
      url.searchParams.get("miniApp") === "true" ||
      url.searchParams.get("fc") === "true" ||
      document.referrer.includes("warpcast.com");

    if (!isMiniApp) return;

    // 🔥 Auto-connect to first available connector (Coinbase Wallet for Farcaster)
    const autoConnect = async () => {
      try {
        setHasAttempted(true);

        // Try Coinbase Wallet first (used by Farcaster)
        const coinbaseConnector = connectors.find((connector) =>
          connector.name.toLowerCase().includes("coinbase")
        );

        if (coinbaseConnector) {
          console.log("🎨 Mini App: Auto-connecting to Coinbase Wallet...");
          await connect({ connector: coinbaseConnector });
        } else if (connectors[0]) {
          // Fallback to first connector
          console.log("🎨 Mini App: Auto-connecting to", connectors[0].name);
          await connect({ connector: connectors[0] });
        }
      } catch (error) {
        console.log(
          "🎨 Mini App: Auto-connect failed, user can manually connect:",
          error
        );
      }
    };

    // Delay slightly to ensure connectors are ready
    const timer = setTimeout(autoConnect, 500);

    return () => clearTimeout(timer);
  }, [connect, connectors, isConnected, hasAttempted]);

  return null;
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={base as any}
          showRecentTransactions={true}
        >
          {mounted && (
            <>
              {/* 🔥 NEW: Auto-connect in Mini App mode */}
              <AutoConnectMiniApp />
              {children}
            </>
          )}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
