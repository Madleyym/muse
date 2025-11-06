"use client";

import { Web3Provider } from "@/components/providers/Web3Provider";
import { NavigationProgress } from "@/components/providers/NavigationProgress";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterWebsite";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { nftMoods } from "@/data/nftMoods";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { useRouter } from "next/navigation";

interface MintedNFT {
  id: number;
  tokenId: number;
  moodId: string;
  moodName: string;
  username: string;
  fid: number;
  pfpUrl?: string;
  mintedAt: string;
  isHD: boolean;
}

const NFTShowcaseCard = memo(
  ({ nft, gradientIndex }: { nft: any; gradientIndex: number }) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const getGradientStyle = (gradient: {
      from: string;
      via?: string;
      to: string;
    }) => {
      const fromRgb = hexToRgb(gradient.from);
      const toRgb = hexToRgb(gradient.to);
      const viaRgb = gradient.via ? hexToRgb(gradient.via) : null;

      return viaRgb
        ? `linear-gradient(135deg, rgb(${fromRgb.r},${fromRgb.g},${fromRgb.b}) 0%, rgb(${viaRgb.r},${viaRgb.g},${viaRgb.b}) 50%, rgb(${toRgb.r},${toRgb.g},${toRgb.b}) 100%)`
        : `linear-gradient(135deg, rgb(${fromRgb.r},${fromRgb.g},${fromRgb.b}) 0%, rgb(${toRgb.r},${toRgb.g},${toRgb.b}) 100%)`;
    };

    const currentGradient = nft.mood.gradients[gradientIndex];
    const gradientStyle = getGradientStyle(currentGradient);

    const getDefaultAvatar = (username: string) => {
      const firstLetter = username.charAt(0).toUpperCase();
      return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&size=64&bold=true`;
    };

    return (
      <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div
          className="aspect-square relative overflow-hidden"
          style={{
            background: gradientStyle,
            transition: "background 0.5s ease-in-out",
          }}
        >
          {nft.isHD && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-2 py-0.5 text-xs font-bold text-white z-10">
              HD
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-[180px] h-[180px]">
              <Image
                src={nft.baseImage}
                alt={nft.name}
                fill
                className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                sizes="180px"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700 truncate">
              {nft.name}
            </span>
            <span className="text-xs text-slate-500">{nft.timeAgo}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
              <Image
                src={nft.pfpUrl || getDefaultAvatar(nft.username)}
                alt={nft.username}
                fill
                className="object-cover"
                sizes="24px"
                unoptimized
              />
            </div>
            <span className="text-xs text-slate-600 truncate">
              @{nft.username}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

NFTShowcaseCard.displayName = "NFTShowcaseCard";

export default function ShowcasePage() {
  const { farcasterData, ready } = useFarcaster();
  const router = useRouter();
  const [recentMints, setRecentMints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalGradientIndex, setGlobalGradientIndex] = useState(0);
  const [filter, setFilter] = useState<"today" | "all">("today");

  // ✅ NEW: Check if user is admin
  const isAdmin = farcasterData?.fid === 1346047;

  // ✅ NEW: Redirect non-admin users
  useEffect(() => {
    if (ready && !isAdmin) {
      console.log("[Showcase] Access denied - redirecting to home");
      router.push("/");
    }
  }, [ready, isAdmin, router]);

  const getDefaultAvatar = (username: string) => {
    const firstLetter = username.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&size=128&bold=true`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const minted = new Date(timestamp).getTime();
    const diff = now - minted;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nfts/minted?filter=${filter}`);
        const data = await response.json();

        if (data.success && data.nfts) {
          const formatted = data.nfts.map((nft: MintedNFT) => {
            const mood = nftMoods.find((m) => m.id === nft.moodId);
            return {
              ...nft,
              mood,
              baseImage: mood?.baseImage || "/assets/Logo/Muse.png",
              timeAgo: getTimeAgo(nft.mintedAt),
              pfpUrl: nft.pfpUrl || getDefaultAvatar(nft.username),
            };
          });
          setRecentMints(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [filter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalGradientIndex((prev) => (prev + 1) % 10);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const generateWarpcastPost = () => {
    const topMoods = recentMints
      .slice(0, 3)
      .map((nft) => `${nft.moodName} by @${nft.username}`)
      .join("\n");

    const text = `Fresh mood NFTs minted ${
      filter === "today" ? "today" : "recently"
    } on miniapp muse!\n\n${topMoods}\n\nTotal: ${
      recentMints.length
    } moods minted\n\nMint your vibe: https://farcaster.xyz/miniapps/5R8ES6mG26Bl/muse`;

    return `https://warpcast.com/~/compose?text=${encodeURIComponent(
      text
    )}&embeds[]=${encodeURIComponent(
      "https://farcaster.xyz/miniapps/5R8ES6mG26Bl/muse"
    )}`;
  };

  // ✅ NEW: Show loading while checking admin status
  if (!ready) {
    return (
      <Web3Provider>
        <NavigationProgress>
          <TopBanner />
          <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin mx-auto w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"></div>
              <p className="text-slate-600">Loading...</p>
            </div>
          </main>
        </NavigationProgress>
      </Web3Provider>
    );
  }

  // ✅ NEW: Show access denied if not admin
  if (!isAdmin) {
    return (
      <Web3Provider>
        <NavigationProgress>
          <TopBanner />
          <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-4">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-red-900 mb-2">
                  Access Denied
                </h1>
                <p className="text-red-700 mb-6">
                  This page is only accessible to administrators.
                </p>
                <Link
                  href="/"
                  className="inline-block gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </main>
        </NavigationProgress>
      </Web3Provider>
    );
  }

  return (
    <Web3Provider>
      <NavigationProgress>
        <TopBanner />
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
          <Header />

          <section className="py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4 text-sm font-medium">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span>Admin Showcase</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
                  {filter === "today"
                    ? "Today's Fresh Mints"
                    : "All Minted NFTs"}
                </h1>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Share these amazing mood NFTs with the Farcaster community!
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {loading ? "..." : recentMints.length}
                    </div>
                    <div className="text-xs text-slate-500">
                      {filter === "today" ? "Today" : "Total"} Mints
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {loading
                        ? "..."
                        : new Set(recentMints.map((n) => n.username)).size}
                    </div>
                    <div className="text-xs text-slate-500">Artists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {loading
                        ? "..."
                        : recentMints.filter((n) => n.isHD).length}
                    </div>
                    <div className="text-xs text-slate-500">HD Editions</div>
                  </div>
                </div>

                {/* Share Button */}
                <a
                  href={generateWarpcastPost()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share to Warpcast
                </a>
              </div>

              {/* Filter Selector */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-700">
                  Recent NFTs
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("today")}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                      filter === "today"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    Mint Today
                  </button>
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                      filter === "all"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-white text-slate-600 border border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    All Mints
                  </button>
                </div>
              </div>

              {/* NFT Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200" />
                      <div className="p-4">
                        <div className="h-4 bg-slate-200 rounded mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentMints.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-600 mb-4">
                    {filter === "today" ? "No mints today yet" : "No mints yet"}
                  </p>
                  <Link
                    href="/#pricing"
                    className="inline-block gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium"
                  >
                    Be the First to Mint
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentMints.map((nft) => (
                    <NFTShowcaseCard
                      key={nft.id}
                      nft={nft}
                      gradientIndex={globalGradientIndex}
                    />
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="text-center mt-12">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/gallery"
                    className="inline-block border-2 border-purple-200 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition font-medium"
                  >
                    View Full Gallery
                  </Link>
                  <Link
                    href="/#pricing"
                    className="inline-block gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium shadow-lg"
                  >
                    Mint Your Mood
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </NavigationProgress>
    </Web3Provider>
  );
}
