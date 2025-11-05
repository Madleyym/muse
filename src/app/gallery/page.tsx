"use client";

import Header from "@/components/layout/Header";
import Link from "next/link";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { nftMoods } from "@/data/nftMoods";

// NFT interface for real minted data
interface MintedNFT {
  id: number;
  tokenId: number;
  moodId: string;
  moodName: string;
  fid: number;
  username: string;
  pfpUrl?: string;
  owner: string;
  mintedAt: string;
  isHD: boolean;
  imageUrl: string;
}

const NFTCard = memo(
  ({
    nft,
    gradientIndex,
    onViewClick,
  }: {
    nft: any;
    gradientIndex: number;
    onViewClick: (nft: any) => void;
  }) => {
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
      <div
        className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="aspect-square relative overflow-hidden cursor-pointer"
          style={{
            background: gradientStyle,
            transition: "background 0.5s ease-in-out",
          }}
          onClick={() => onViewClick(nft)}
        >
          <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white z-10 flex items-center gap-1">
            <span>{nft.isHD ? "0.001 ETH" : "FREE"}</span>
            <div className="relative w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0">
              <Image
                src="/assets/images/layout/eth-base.png"
                alt="Base"
                width={14}
                height={14}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          </div>

          {nft.isHD && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-2 py-0.5 text-[10px] font-bold text-white z-10">
              HD
            </div>
          )}

          <div
            className="absolute -inset-2 blur-xl opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-500"
            style={{ background: gradientStyle }}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
              <Image
                src={nft.baseImage}
                alt={nft.name}
                fill
                className="object-contain drop-shadow-2xl select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                draggable={false}
                sizes="(max-width: 640px) 140px, 180px"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate pr-2">
              {nft.name} #{nft.tokenId}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
              {nft.timeAgo}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src={nft.pfpUrl || getDefaultAvatar(nft.username)}
                  alt={nft.username}
                  fill
                  className="object-cover"
                  sizes="24px"
                  unoptimized
                />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 truncate">
                @{nft.username}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(nft);
              }}
              className="text-[10px] sm:text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all flex-shrink-0 ml-2"
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  }
);

NFTCard.displayName = "NFTCard";

export default function GalleryPage() {
  const [sortBy, setSortBy] = useState("Recently Minted");
  const [globalGradientIndex, setGlobalGradientIndex] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMinted, setTotalMinted] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

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

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // ✅ ONLY ONE fetchMintedNFTs function
  const fetchMintedNFTs = async (forceRefresh = false) => {
    try {
      if (initialLoad) {
        setLoading(true);
      }

      const url = forceRefresh
        ? "/api/nfts/minted?refresh=true"
        : "/api/nfts/minted";

      const response = await fetch(url, {
        cache: forceRefresh ? "no-store" : "force-cache",
        next: { revalidate: 20 },
      });

      const data = await response.json();

      console.log("📦 API Response:", {
        success: data.success,
        count: data.nfts?.length || 0,
        cached: data.cached,
        timestamp: data.timestamp,
      });

      if (data.success && data.nfts) {
        const nfts = data.nfts.map((nft: MintedNFT) => {
          const mood = nftMoods.find((m) => m.id === nft.moodId) || nftMoods[0];

          return {
            id: nft.id,
            tokenId: nft.tokenId,
            mood: mood,
            moodId: nft.moodId,
            name: nft.moodName,
            baseImage: mood.baseImage,
            category: nft.isHD ? "pro" : "free",
            author: `@${nft.username}`,
            username: nft.username,
            fid: nft.fid,
            pfpUrl: nft.pfpUrl || getDefaultAvatar(nft.username),
            owner: nft.owner,
            isHD: nft.isHD,
            mintedAt: nft.mintedAt,
            timeAgo: getTimeAgo(nft.mintedAt),
          };
        });

        console.log(`✅ Displaying ${nfts.length} NFTs`);
        setMintedNFTs(nfts);
        setTotalMinted(data.totalMinted);
      }
    } catch (error) {
      console.error("❌ Failed to fetch minted NFTs:", error);
    } finally {
      setLoading(false);
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  };

  // ✅ ONLY ONE useEffect for fetch
  useEffect(() => {
    fetchMintedNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    await fetchMintedNFTs(true);
  };

  // ✅ Gradient animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalGradientIndex((prev) => (prev + 1) % 10);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleViewClick = (nft: any) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

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

  const uniqueArtists = new Set(mintedNFTs.map((nft) => nft.username)).size;
  const totalVolume = mintedNFTs
    .filter((nft) => nft.isHD)
    .reduce((sum) => sum + 0.001, 0)
    .toFixed(3);

  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3 sm:mb-4">
              Community Gallery
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Explore unique mood NFTs minted by the Farcaster community on Base
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {loading ? "..." : totalMinted}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Total Minted
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {loading ? "..." : uniqueArtists}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Unique Artists
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text flex items-center justify-center gap-2">
                  <span>{loading ? "..." : totalVolume} ETH</span>
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                    <Image
                      src="/assets/images/layout/eth-base.png"
                      alt="Base"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Total Volume
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-b border-purple-100/50 py-4 sm:py-6 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm sm:text-base font-semibold text-slate-700 flex-shrink-0">
                {loading ? "Loading..." : `${mintedNFTs.length} Moods`}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-xs sm:text-sm px-3 py-1.5 border border-purple-200 rounded-lg hover:bg-purple-50 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
            >
              <option>Recently Minted</option>
              <option>Most Popular</option>
              <option>HD Only</option>
              <option>Free Only</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200" />
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : mintedNFTs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 mb-4">No NFTs minted yet</p>
              <Link
                href="/#pricing"
                prefetch={false}
                className="inline-block gradient-bg text-white px-6 py-3 rounded-xl hover:opacity-90 transition font-medium"
              >
                Be the First to Mint
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {mintedNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  gradientIndex={globalGradientIndex}
                  onViewClick={handleViewClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Join the Community
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-purple-100 mb-6 sm:mb-8">
            Mint your unique mood NFT and showcase it alongside these creators
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/#pricing"
              prefetch={false}
              className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[0.625rem] flex"
            >
              Start Minting Free
            </Link>
            <Link
              href="/"
              prefetch={true}
              className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all border border-white/30 bg-purple-500/30 text-white hover:bg-purple-400/40 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[0.625rem] flex"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {showModal && selectedNFT && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-slate-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div
              className="p-6"
              style={{
                background: getGradientStyle(selectedNFT.mood.gradients[0]),
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 bg-slate-100">
                  <Image
                    src={
                      selectedNFT.pfpUrl ||
                      getDefaultAvatar(selectedNFT.username)
                    }
                    alt={selectedNFT.username}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {selectedNFT.name} #{selectedNFT.tokenId}
                  </h3>
                  <p className="text-sm text-white/90">
                    @{selectedNFT.username} · FID {selectedNFT.fid}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  NFT Details
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price:</span>
                    <span className="font-semibold">
                      {selectedNFT.isHD ? "0.001 ETH" : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Edition:</span>
                    <span className="font-semibold">
                      {selectedNFT.isHD ? "HD Premium" : "SD Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Network:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">Base</span>
                      <div className="relative w-4 h-4">
                        <Image
                          src="/assets/images/layout/eth-base.png"
                          alt="Base"
                          width={16}
                          height={16}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Minted:</span>
                    <span className="font-semibold">{selectedNFT.timeAgo}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://basescan.org/token/0x4A8F23ADdEA57Ba5f09e4345CE8D40883Cda0F61?a=${selectedNFT.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border-2 border-purple-200 text-purple-600 py-3 rounded-xl hover:bg-purple-50 transition font-medium text-sm"
                >
                  Basescan
                </a>
                <Link
                  href="/#pricing"
                  prefetch={false}
                  className="flex-1 text-center gradient-bg text-white py-3 rounded-xl hover:opacity-90 transition font-medium text-sm"
                >
                  Mint Yours
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
