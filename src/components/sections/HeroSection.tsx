"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { nftMoods } from "@/data/nftMoods";

export default function HeroSection() {
  const proMoods = useMemo(
    () => nftMoods.filter((mood) => mood.category === "pro"),
    []
  );

  const [featuredGradientIndex, setFeaturedGradientIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // 🔧 FIX 1: Use current mood's gradient length
  useEffect(() => {
    if (!isReady || !proMoods[featuredIndex]) return;

    const currentMood = proMoods[featuredIndex];
    const gradientCount = currentMood.gradients.length;

    const interval = setInterval(() => {
      setFeaturedGradientIndex((prev) => (prev + 1) % gradientCount);
    }, 400);

    return () => clearInterval(interval);
  }, [isReady, featuredIndex, proMoods]);

  // Auto-rotate featured mood
  useEffect(() => {
    if (!isReady || proMoods.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setFeaturedIndex((prev) => (prev + 1) % proMoods.length);
        setFeaturedGradientIndex(0);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isReady, proMoods.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIsTransitioning(true);
        setTimeout(() => {
          setFeaturedIndex(
            (prev) => (prev - 1 + proMoods.length) % proMoods.length
          );
          setFeaturedGradientIndex(0);
          setIsTransitioning(false);
        }, 150);
      } else if (e.key === "ArrowRight") {
        setIsTransitioning(true);
        setTimeout(() => {
          setFeaturedIndex((prev) => (prev + 1) % proMoods.length);
          setFeaturedGradientIndex(0);
          setIsTransitioning(false);
        }, 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [proMoods.length]);

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

  // 🔧 FIX 2: Safety checks
  if (!isReady || proMoods.length === 0) {
    return null;
  }

  const featuredMood = proMoods[featuredIndex];
  if (!featuredMood || !featuredMood.gradients[featuredGradientIndex]) {
    return null;
  }

  const featuredGradient = getGradientStyle(
    featuredMood.gradients[featuredGradientIndex]
  );
  const currentGradientColors = featuredMood.gradients[featuredGradientIndex];

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-12 lg:px-8 xl:gap-x-16 xl:px-10">
          {/* NFT CARD */}
          <div className="relative w-full max-w-[500px] mx-auto lg:max-w-none mb-8 lg:mb-0 lg:order-2">
            <div
              className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 select-none group"
              style={{
                boxShadow: `0 10px 40px -5px rgba(${
                  hexToRgb(currentGradientColors.from).r
                }, ${hexToRgb(currentGradientColors.from).g}, ${
                  hexToRgb(currentGradientColors.from).b
                }, 0.3)`,
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Glow effect */}
              <div
                className="absolute -inset-2 blur-2xl opacity-30 pointer-events-none transition-all duration-500"
                style={{ background: featuredGradient }}
              />

              {/* Background gradient */}
              <div
                className="absolute inset-0 transition-all duration-500 ease-in-out"
                style={{ background: featuredGradient }}
              />

              {/* Shimmer overlay */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />

              {/* NFT Character */}
              <div
                className={`absolute inset-0 flex items-center justify-center pb-20 sm:pb-24 pt-6 px-4 sm:px-6 transition-all duration-300 pointer-events-none ${
                  isTransitioning
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                <div className="relative w-full h-full max-w-[260px] max-h-[260px] sm:max-w-[300px] sm:max-h-[300px] lg:max-w-[350px] lg:max-h-[350px] group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={featuredMood.baseImage}
                    alt={featuredMood.name}
                    fill
                    className="object-contain drop-shadow-2xl select-none pointer-events-none"
                    priority
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 350px"
                  />
                </div>
              </div>

              {/* Bottom shadow */}
              <div
                className="absolute bottom-20 sm:bottom-24 left-0 right-0 h-20 sm:h-24 lg:h-28 opacity-20 blur-2xl pointer-events-none transition-all duration-700"
                style={{
                  background: `linear-gradient(to top, ${currentGradientColors.to}, transparent)`,
                }}
              />

              {/* Particle effects */}
              {(featuredMood.id === "fire-starter" ||
                featuredMood.id === "chaos-energy") && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/60 rounded-full animate-spark"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent backdrop-blur-md">
                <div className="flex items-end justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base sm:text-lg lg:text-2xl mb-1 truncate">
                      {featuredMood.name}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {featuredMood.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* 🔧 FIX 3: Equal padding for PRO badge */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2 sm:p-2.5 shadow-lg">
                      <span className="text-white text-[10px] sm:text-xs font-bold leading-none">
                        PRO
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
              </div>
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:order-1">
            <div className="items-center justify-center rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shadow-[0_2px_10px_0px_rgba(0,0,0,0.15)] inline-flex gradient-bg text-white px-3 py-1 animate-fade-in-up">
              🌈 Social Art on Base
            </div>
            <h1
              className="gradient-text text-3xl sm:text-4xl lg:text-6xl font-bold mt-4 lg:mt-6 leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Mint Your Mood
            </h1>
            <p
              className="text-lg sm:text-xl font-semibold text-slate-700 mt-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Turn your vibe into collectible art
            </p>
            <p
              className="mt-4 lg:mt-6 text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Connect your wallet, enter your Farcaster ID, and mint unique mood
              NFTs based on your social activity. All on Base network.
            </p>

            {/* Stats */}
            <div
              className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md lg:w-auto animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  1.2K
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                  Minted
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  567
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                  Artists
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {proMoods.length}+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                  Pro Moods
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="mt-8 lg:mt-12 flex flex-row items-center gap-2 sm:gap-3 justify-center lg:justify-start animate-fade-in-up w-full sm:w-auto"
              style={{ animationDelay: "0.5s" }}
            >
              {/* 🔧 FIX 4: Added scroll={true} */}
              <Link
                href="#how-it-works"
                scroll={true}
                className="flex-1 sm:flex-none items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-purple-100 bg-white text-purple-600 hover:border-purple-200 hover:bg-purple-50 active:scale-95 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] flex group"
              >
                Learn more
              </Link>
              <Link
                href="#pricing"
                scroll={true}
                className="flex-1 sm:flex-none items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] gradient-bg text-white hover:opacity-90 hover:shadow-[0_4px_20px_0px_rgba(139,92,246,0.4)] active:scale-95 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] flex group"
              >
                Start Minting FREE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
