import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Mint NFTs based on your Farcaster social activity",
  openGraph: {
    title: "Muse - Mint Your Mood NFT",
    description: "Mint NFTs based on your Farcaster social activity",
    url: "https://muse.write3.fun/miniapp",
    type: "website",
    images: [
      {
        url: "https://muse.write3.fun/assets/Logo/Muse.png",
        width: 1024,
        height: 1024,
        alt: "Muse Logo",
      },
    ],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://muse.write3.fun/assets/Logo/Muse.png",
    "fc:frame:post_url": "https://muse.write3.fun/miniapp",
    "fc:frame:button:1": "Start Minting",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://muse.write3.fun/miniapp",
  },
};

export default function MiniAppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
