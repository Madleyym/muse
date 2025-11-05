"use client";

import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

// Website config: with injected + others
const websiteConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
    ),
  },
});

// Mini app config: ONLY injected (Farcaster native wallet)
const miniAppConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
    ),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const inMiniApp = path.startsWith("/miniapp");
      setIsMiniApp(inMiniApp);
      console.log("[Web3Provider] Path:", path, "isMiniApp:", inMiniApp);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  // Choose config based on environment
  const config = isMiniApp ? miniAppConfig : websiteConfig;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {isMiniApp ? (
          // Mini app: RainbowKit provider TANPA modal UI exposed
          <RainbowKitProvider modalSize="compact" initialChain={base}>
            {children}
          </RainbowKitProvider>
        ) : (
          // Website: RainbowKit provider DENGAN modal UI
          <RainbowKitProvider modalSize="compact" initialChain={base}>
            {children}
          </RainbowKitProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
