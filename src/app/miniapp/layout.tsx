import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood | Farcaster MiniApp",
  description: "Transform your Farcaster vibe into unique mood NFTs on Base",
  openGraph: {
    title: "Muse - Mint Your Mood | Farcaster MiniApp",
    description:
      "Transform your Farcaster vibe into unique mood NFTs on Base. Free SD or Premium HD editions.",
    url: "https://muse.write3.fun/miniapp",
    type: "website",
    images: [
      {
        url: "https://muse.write3.fun/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muse - Mint Your Mood NFT",
      },
    ],
  },
  };

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
