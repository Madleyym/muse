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
import { injected } from "wagmi/connectors";

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
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
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
    default: { http: ["https://eth.llamarpc.com"] },
    public: { http: ["https://eth.llamarpc.com"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
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

// 🔥 SILENT AUTO-CONNECT - NO MODAL
function AutoConnectMiniApp() {
  const { connectAsync, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (attempted || isConnected) return;

    // Detect Mini App
    const isMiniApp =
      window.location.pathname.startsWith("/miniapp") ||
      window.location.search.includes("miniApp=true") ||
      window.location.search.includes("fc=true");

    if (!isMiniApp) {
      setAttempted(true);
      return;
    }

    const autoConnect = async () => {
      setAttempted(true);

      try {
        // 🔥 METHOD 1: Try injected provider first (Farcaster injects this)
        if (typeof window.ethereum !== "undefined") {
          console.log("🎨 Detected injected provider, connecting...");

          // Find injected connector
          const injectedConnector = connectors.find(
            (c) => c.type === "injected" || c.id === "injected"
          );

          if (injectedConnector) {
            await connectAsync({ connector: injectedConnector });
            console.log("✅ Connected via injected provider!");
            return;
          }
        }

        // 🔥 METHOD 2: Fallback to Coinbase Wallet
        const coinbase = connectors.find((c) =>
          c.name.toLowerCase().includes("coinbase")
        );

        if (coinbase) {
          console.log("🎨 Trying Coinbase Wallet...");
          await connectAsync({ connector: coinbase });
          console.log("✅ Connected via Coinbase!");
        }
      } catch (error: any) {
        console.log(
          "🎨 Auto-connect failed (user can manually connect):",
          error.message
        );
      }
    };

    // Delay to ensure providers are loaded
    const timer = setTimeout(autoConnect, 1000);
    return () => clearTimeout(timer);
  }, [connectAsync, connectors, isConnected, attempted]);

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
              <AutoConnectMiniApp />
              {children}
            </>
          )}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
