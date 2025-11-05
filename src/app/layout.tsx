import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { NavigationProgress } from "@/components/providers/NavigationProgress";
import { FarcasterProvider } from "@/contexts/FarcasterContext";
import TopBanner from "@/components/layout/TopBanner";
// ❌ REMOVE: import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Turn your Farcaster vibe into collectible art on Base",
  metadataBase: new URL("https://muse.write3.fun"),
  keywords: ["NFT", "Farcaster", "mood", "Base", "mint", "social"],
  authors: [{ name: "Muse" }],
  creator: "Muse",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Muse - Mint Your Mood NFT",
    description: "Turn your Farcaster vibe into collectible art on Base",
    url: "https://muse.write3.fun",
    siteName: "Muse",
    type: "website",
    images: [
      {
        url: "/assets/Logo/Muse.png",
        width: 1024,
        height: 1024,
        alt: "Muse Logo",
      },
    ],
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
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://muse.write3.fun" />
      </head>
      <body className={inter.className}>
        <Web3Provider>
          <FarcasterProvider>
            <NavigationProgress>
              <TopBanner />
              <div className="page-transition">{children}</div>
              {/* ❌ REMOVED: <Footer /> */}
            </NavigationProgress>
          </FarcasterProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
