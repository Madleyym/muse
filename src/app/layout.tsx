import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { NavigationProgress } from "@/components/providers/NavigationProgress";
import { FarcasterProvider } from "@/contexts/FarcasterContext";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Turn your Farcaster vibe into collectible art on Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <NavigationProgress>
            <FarcasterProvider>
              <TopBanner />
              <div className="page-transition">{children}</div>
              <Footer />
            </FarcasterProvider>
          </NavigationProgress>
        </Web3Provider>
      </body>
    </html>
  );
}
