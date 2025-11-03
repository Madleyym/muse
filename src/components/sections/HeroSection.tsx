"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { nftMoods } from "@/data/nftMoods";

export default function HeroSection() {
  const proMoods = useMemo(
    () => nftMoods.filter((mood) => mood.category === "pro"),
    []
  );

  const [featuredGradientIndex, setFeaturedGradientIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || isPaused) return;

    const interval = setInterval(() => {
      setFeaturedGradientIndex((prev) => (prev + 1) % 10);
    }, 400);

    return () => clearInterval(interval);
  }, [isReady, isPaused]);

  useEffect(() => {
    if (!isReady || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setFeaturedIndex((prev) => (prev + 1) % proMoods.length);
        setFeaturedGradientIndex(0);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isReady, isPaused, proMoods.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setFeaturedIndex(
          (prev) => (prev - 1 + proMoods.length) % proMoods.length
        );
        setFeaturedGradientIndex(0);
      } else if (e.key === "ArrowRight") {
        setFeaturedIndex((prev) => (prev + 1) % proMoods.length);
        setFeaturedGradientIndex(0);
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

  if (!isReady) {
    return null;
  }

  const featuredMood = proMoods[featuredIndex];
  const featuredGradient = getGradientStyle(
    featuredMood.gradients[featuredGradientIndex]
  );
  const currentGradientColors = featuredMood.gradients[featuredGradientIndex];

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-12 lg:px-8 xl:gap-x-16 xl:px-10">
          {/* NFT CARD */}
          <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[600px] flex flex-col gap-3 mb-8 lg:mb-0 lg:order-2">
            <div
              className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 select-none"
              style={{
                boxShadow: `0 20px 60px -10px rgba(${
                  hexToRgb(currentGradientColors.from).r
                }, ${hexToRgb(currentGradientColors.from).g}, ${
                  hexToRgb(currentGradientColors.from).b
                }, 0.4), 0 0 0 1px rgba(${
                  hexToRgb(currentGradientColors.from).r
                }, ${hexToRgb(currentGradientColors.from).g}, ${
                  hexToRgb(currentGradientColors.from).b
                }, 0.1)`,
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <div
                className="absolute -inset-4 blur-3xl opacity-40 pointer-events-none transition-all duration-500"
                style={{ background: featuredGradient }}
              />

              <div
                className="absolute inset-0 transition-all duration-500 ease-in-out"
                style={{ background: featuredGradient }}
              />

              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />

              <div
                className={`absolute inset-0 flex items-center justify-center pb-20 sm:pb-24 pt-6 px-4 sm:px-6 transition-all duration-300 pointer-events-none ${
                  isTransitioning
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                <div className="relative w-full h-full max-w-[260px] max-h-[260px] sm:max-w-[300px] sm:max-h-[300px] lg:max-w-[380px] lg:max-h-[380px]">
                  <Image
                    src={featuredMood.baseImage}
                    alt={featuredMood.name}
                    fill
                    className="object-contain drop-shadow-2xl select-none pointer-events-none"
                    priority
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>

              <div
                className="absolute bottom-20 sm:bottom-24 left-0 right-0 h-28 sm:h-36 lg:h-40 opacity-25 blur-3xl pointer-events-none transition-all duration-700"
                style={{
                  background: `linear-gradient(to top, ${currentGradientColors.to}, transparent)`,
                }}
              />

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

              {/* 🔥 Info Bar - NO BORDER */}
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
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-lg">
                      <span className="text-white text-[10px] sm:text-xs font-bold">
                        PRO
                      </span>
                    </div>
                    {/* <button className="bg-white hover:bg-gray-100 transition-colors rounded-lg px-3 sm:px-4 py-1 sm:py-1.5 shadow-md active:scale-95">
                      <span className="text-purple-600 text-[10px] sm:text-xs font-bold">
                        CLAIM
                      </span>
                    </button> */}
                  </div>
                </div>
              </div>

              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isPaused
                      ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse"
                      : "bg-white/30"
                  }`}
                />
              </div>
            </div>

            {/* Carousel */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-2 sm:gap-2.5 overflow-x-auto py-1.5 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {proMoods.map((mood, index) => {
                  const isActive = index === featuredIndex;
                  const gradientStyle = getGradientStyle(mood.gradients[0]);

                  return (
                    <button
                      key={mood.id}
                      onClick={() => {
                        setFeaturedIndex(index);
                        setFeaturedGradientIndex(0);
                      }}
                      className={`relative flex-shrink-0 snap-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 shadow-lg active:scale-95 ${
                        isActive
                          ? "opacity-100 ring-2 ring-white scale-105 shadow-xl"
                          : "opacity-70 hover:opacity-90"
                      }`}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: gradientStyle }}
                      />

                      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 lg:p-4">
                        <div className="relative w-full h-full">
                          <Image
                            src={mood.baseImage}
                            alt={mood.name}
                            fill
                            className="object-contain drop-shadow-xl"
                          />
                        </div>
                      </div>

                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center gap-1.5 mt-2.5">
                {proMoods.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setFeaturedIndex(index);
                      setFeaturedGradientIndex(0);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === featuredIndex
                        ? "w-6 sm:w-8 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                        : "w-1 bg-slate-300 hover:bg-slate-400 hover:w-2"
                    }`}
                  />
                ))}
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
            // Find this line (around line 180):
            <p
              className="mt-4 lg:mt-6 text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Connect your wallet, enter your Farcaster ID, and mint unique mood
              NFTs based on your social activity. All on Base network.
            </p>
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
                  99+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                  Pro Moods
                </div>
              </div>
            </div>
            {/* 🔥 CTA Buttons - Horizontal on ALL devices, no arrows */}
            <div
              className="mt-8 lg:mt-12 flex flex-row items-center gap-2 sm:gap-3 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                href="#how-it-works"
                className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-purple-100 bg-white text-purple-600 hover:border-purple-200 hover:bg-purple-50 active:scale-95 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] flex group"
              >
                <svg
                  className="shrink-0 mr-1.5 sm:mr-2 h-3.5 sm:h-4 group-hover:rotate-12 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                Learn more
              </Link>
              <Link
                href="#pricing"
                className="items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-200 shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] gradient-bg text-white hover:opacity-90 hover:shadow-[0_4px_20px_0px_rgba(139,92,246,0.4)] active:scale-95 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] flex group"
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
