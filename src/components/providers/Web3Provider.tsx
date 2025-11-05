"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
  Wallet,
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
import { useAccount, useConnect } from "wagmi";

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

// 🔥 CUSTOM FARCASTER WALLET
const farcasterWallet = (): Wallet => ({
  id: "farcaster",
  name: "Farcaster Wallet",
  iconUrl: "/assets/images/layout/farcaster.png",
  iconBackground: "#8A63D2",
  downloadUrls: {
    android: "https://warpcast.com/",
    ios: "https://warpcast.com/",
    chrome: "https://warpcast.com/",
    qrCode: "https://warpcast.com/",
  },
  mobile: {
    getUri: () => "farcaster://",
  },
  qrCode: {
    getUri: () => "farcaster://",
    instructions: {
      learnMoreUrl: "https://warpcast.com/",
      steps: [
        {
          description: "Open Farcaster app on your phone",
          step: "install",
          title: "Open Farcaster",
        },
        {
          description: "Scan QR code with Farcaster camera",
          step: "scan",
          title: "Scan QR",
        },
      ],
    },
  },
  createConnector: (walletDetails) => {
    const coinbaseConnector = coinbaseWallet({
      appName: "Muse - Mint Your Mood",
    });
    return coinbaseConnector.createConnector(walletDetails);
  },
});

// 🔥 Detect environment
function detectEnvironment() {
  if (typeof window === "undefined") return "web";

  const url = new URL(window.location.href);
  const isMiniApp =
    url.pathname.startsWith("/miniapp") ||
    url.searchParams.get("miniApp") === "true" ||
    url.searchParams.get("fc") === "true";

  const isWarpcast =
    document.referrer.includes("warpcast.com") ||
    navigator.userAgent.includes("Warpcast") ||
    window.self !== window.top; // Inside iframe

  if (isWarpcast) return "warpcast";
  if (isMiniApp) return "miniapp";
  return "web";
}

// 🔥 CONDITIONAL WALLET LIST
function getConnectors() {
  if (typeof window === "undefined") return [];

  const environment = detectEnvironment();

  // Mini app / Warpcast: Show Farcaster + Coinbase only
  if (environment === "warpcast" || environment === "miniapp") {
    return connectorsForWallets(
      [
        {
          groupName: "🎨 Farcaster",
          wallets: [farcasterWallet],
        },
        {
          groupName: "Wallet",
          wallets: [coinbaseWallet],
        },
      ],
      {
        appName: "Muse - Mint Your Mood",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      }
    );
  }

  // Web: Show all wallets
  return connectorsForWallets(
    [
      {
        groupName: "🎨 Farcaster",
        wallets: [farcasterWallet],
      },
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
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }
  );
}

const connectors = getConnectors();

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

// 🔥 SMART AUTO-CONNECT (NO MODAL IN MINI APP)
function AutoConnectMiniApp() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (hasAttempted || isConnected) return;

    const environment = detectEnvironment();

    // Only auto-connect in mini app/warpcast
    if (environment !== "warpcast" && environment !== "miniapp") {
      setHasAttempted(true);
      return;
    }

    const attemptConnection = async () => {
      setHasAttempted(true);

      // Wait for provider
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        if (typeof window.ethereum !== "undefined") {
          console.log(`🎨 ${environment.toUpperCase()}: Wallet detected`);

          // Check existing connection
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            console.log(
              `🎨 ${environment.toUpperCase()}: Already connected, syncing...`
            );

            // Find appropriate connector
            const connector =
              connectors.find((c) => c.id === "farcaster") ||
              connectors.find((c) =>
                c.name.toLowerCase().includes("coinbase")
              ) ||
              connectors.find((c) => c.type === "injected") ||
              connectors[0];

            if (connector) {
              await connectAsync({ connector });
              console.log(
                `✅ ${environment.toUpperCase()}: Auto-connected via`,
                connector.name
              );
            }
          }
        }
      } catch (error: any) {
        console.log(
          `🎨 ${environment.toUpperCase()}: Auto-connect skipped -`,
          error.message
        );
      }
    };

    attemptConnection();
  }, [isConnected, connectAsync, connectors, hasAttempted]);

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
