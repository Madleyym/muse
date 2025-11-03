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

// Ethereum Mainnet (optional, for multi-chain support)
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
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
