import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import { Web3Provider } from "@/components/providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood on Base",
  description:
    "Turn your vibe into collectible art. Every interaction on Farcaster becomes a unique NFT.",
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
          <TopBanner />
          {children}
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
