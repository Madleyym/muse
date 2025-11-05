import type { Metadata } from "next";
import "./globals.css";
import { FarcasterProvider } from "@/contexts/FarcasterContext";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { NavigationProgress } from "@/components/providers/NavigationProgress"; // 🔥 CHANGE: named import

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Turn your vibe into collectible art on Base",
  metadataBase: new URL("https://muse.write3.fun"),
  openGraph: {
    title: "Muse - Mint Your Mood NFT",
    description: "Turn your vibe into collectible art on Base",
    url: "https://muse.write3.fun",
    type: "website",
    images: [
      {
        url: "/assets/Logo/Muse.png",
        width: 1024,
        height: 1024,
        alt: "Muse",
      },
    ],
  },
  // 🔥 Farcaster Mini App Meta Tags
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://muse.write3.fun/assets/Logo/Muse.png",
    "fc:frame:post_url": "https://muse.write3.fun/miniapp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <FarcasterProvider>
          <Web3Provider>
            <NavigationProgress>{children}</NavigationProgress>
          </Web3Provider>
        </FarcasterProvider>
      </body>
    </html>
  );
}
