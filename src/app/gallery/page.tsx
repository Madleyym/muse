"use client";

import Header from "@/components/layout/Header";
import Link from "next/link";
import { useState, useMemo, useEffect, memo } from "react";
import Image from "next/image";
import { generateGalleryData, type GalleryNFT } from "@/data/nftMoods";

// 🚀 Memoized NFT Card Component
const NFTCard = memo(
  ({
    nft,
    gradientIndex,
    onViewClick,
  }: {
    nft: GalleryNFT;
    gradientIndex: number;
    onViewClick: (nft: GalleryNFT) => void;
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

    return (
      <div
        className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* NFT Card - Clean Image Area */}
        <div
          className="aspect-square relative overflow-hidden cursor-pointer"
          style={{
            background: gradientStyle,
            transition: "background 0.5s ease-in-out",
          }}
          onClick={() => onViewClick(nft)}
        >
          {/* Price Badge */}
          <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white z-10 flex items-center gap-1">
            {nft.category === "free" ? (
              <span>FREE</span>
            ) : (
              <>
                <span>0.001 ETH</span>
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
              </>
            )}
          </div>

          {/* Glow effect on hover */}
          <div
            className="absolute -inset-2 blur-xl opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-500"
            style={{ background: gradientStyle }}
          />

          {/* NFT Image - CLEAN, NO TEXT */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
              <Image
                src={nft.baseImage}
                alt={nft.name}
                fill
                className="object-contain drop-shadow-xl select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                sizes="(max-width: 640px) 140px, 180px"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate pr-2">
              {nft.name}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 flex-shrink-0">
              {nft.time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 transition-all duration-500"
                style={{ background: gradientStyle }}
              ></div>
              <span className="text-[10px] sm:text-xs text-slate-600 truncate">
                {nft.author}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(nft);
              }}
              className="text-[10px] sm:text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all flex-shrink-0 ml-2 cursor-pointer"
            >
              View #{String(nft.id).padStart(4, "0")}
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
  const [selectedNFT, setSelectedNFT] = useState<GalleryNFT | null>(null);

  const allGalleryData = useMemo(() => generateGalleryData(30), []);

  const sortedGalleryData = useMemo(() => {
    let sorted = [...allGalleryData];

    if (sortBy === "Highest Price") {
      sorted.sort((a, b) => (b.priceValue || 0) - (a.priceValue || 0));
    } else if (sortBy === "Lowest Price") {
      sorted.sort((a, b) => (a.priceValue || 0) - (b.priceValue || 0));
    } else if (sortBy === "Most Popular") {
      sorted.sort(() => Math.random() - 0.5);
    }

    return sorted;
  }, [allGalleryData, sortBy]);

  // 🔥 Gradient animation - 400ms (sama seperti Hero)
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalGradientIndex((prev) => (prev + 1) % 10);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleViewClick = (nft: GalleryNFT) => {
    setSelectedNFT(nft);
    console.log("View NFT Details:", {
      id: nft.id,
      name: nft.name,
      category: nft.category,
      price: nft.price,
      author: nft.author,
      moodId: nft.moodId,
    });
    alert(
      `Viewing NFT #${String(nft.id).padStart(4, "0")}: ${nft.name}\nby ${
        nft.author
      }`
    );
  };

  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />

      {/* Hero Section */}
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
                  1,234
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Total Minted
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  567
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Unique Artists
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text flex items-center justify-center gap-2">
                  <span>0.45 ETH</span>
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

      {/* 🔥 Filter Section - FIXED */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-b border-purple-100/50 py-4 sm:py-6 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm sm:text-base font-semibold text-slate-700 flex-shrink-0">
              All Moods
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors"
            >
              <option>Recently Minted</option>
              <option>Most Popular</option>
              <option>Highest Price</option>
              <option>Lowest Price</option>
            </select>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 sm:py-12" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {sortedGalleryData.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                gradientIndex={globalGradientIndex}
                onViewClick={handleViewClick}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 sm:mt-12 text-center">
            <button className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all focus:shadow-[0_0px_0px_2px_rgba(139,92,246,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-purple-100 bg-white text-purple-600 hover:border-purple-200 hover:bg-purple-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[0.625rem] inline-flex">
              Load More NFTs
              <svg
                className="shrink-0 ml-2 h-3.5 sm:h-4 w-3.5 sm:w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Mint Your Own?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-purple-100 mb-6 sm:mb-8">
            Join the community and create your unique mood NFT today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/#pricing"
              className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] bg-white text-purple-600 hover:bg-purple-50 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[0.625rem] flex"
            >
              Start Minting Free
            </Link>
            <Link
              href="/"
              className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all border border-white/30 bg-purple-500/30 text-white hover:bg-purple-400/40 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[0.625rem] flex"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
