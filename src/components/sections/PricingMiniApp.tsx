"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { nftMoods } from "@/data/nftMoods";
import { useMintNFT } from "@/hooks/useMintNFT";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useFrameWallet } from "@/hooks/useFrameWallet";
import { getTransactionUrl } from "@/config/contracts";

// Helper function to validate image URL
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function PricingMiniApp() {
  const { isConnected } = useFrameWallet();
  const { farcasterData, setFarcasterData } = useFarcaster();
  const { isReady: sdkReady, user: sdkUser } = useFarcasterSDK();

  const {
    mintFree,
    mintHD,
    mintType,
    isPending,
    isConfirming,
    isSuccess,
    uploadingToIPFS,
    isDevAddress,
    error: mintError,
    hash,
  } = useMintNFT();

  const [selectedTier, setSelectedTier] = useState<"free" | "hd">("free");
  const [gradientIndex, setGradientIndex] = useState(0);
  const [localMintError, setLocalMintError] = useState<string>("");
  const [isDetectingMood, setIsDetectingMood] = useState(true);
  const [pfpError, setPfpError] = useState(false);

  const currentMood = useMemo(() => {
    if (!farcasterData) return null;

    const found = nftMoods.find((mood) => mood.id === farcasterData.moodId);

    if (!found) {
      console.error(
        "[MiniApp] ❌ Mood not found for ID:",
        farcasterData.moodId
      );
      console.log(
        "[MiniApp] Available mood IDs:",
        nftMoods.map((m) => m.id)
      );
    }

    return found || null;
  }, [farcasterData]);

  const hasValidPfp = isValidImageUrl(farcasterData?.pfpUrl) && !pfpError;

  // ✅ AUTO-DETECT MOOD (with 15s fetch timeout)
  useEffect(() => {
    const detectMood = async () => {
      if (!sdkReady || !sdkUser) {
        console.log("[MiniApp] SDK not ready or no user");
        return;
      }

      if (farcasterData?.fid) {
        console.log("[MiniApp] Mood already detected");
        setIsDetectingMood(false);
        return;
      }

      try {
        setIsDetectingMood(true);
        console.log("[MiniApp] 🔍 Detecting mood for FID:", sdkUser.fid);

        // ✅ 15s timeout for API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(
            `/api/farcaster/verify?fid=${sdkUser.fid}`,
            { signal: controller.signal }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();

            console.log("[MiniApp] 📦 API Response:", {
              success: data.success,
              mood: data.activity?.suggestedMood,
              moodId: data.activity?.suggestedMoodId,
              score: data.activity?.engagementScore,
            });

            if (data.success && data.activity) {
              const pfpUrl = data.user.pfpUrl || sdkUser.pfpUrl || "";

              // ✅ VALIDATE MOOD EXISTS
              const moodExists = nftMoods.find(
                (m) => m.id === data.activity.suggestedMoodId
              );

              if (!moodExists) {
                console.error(
                  "[MiniApp] ❌ Invalid moodId from API:",
                  data.activity.suggestedMoodId
                );
                console.log(
                  "[MiniApp] Available moods:",
                  nftMoods.map((m) => m.id)
                );
                // Use fallback
                data.activity.suggestedMood = "Creative Mind";
                data.activity.suggestedMoodId = "creative-mind";
              }

              setFarcasterData({
                fid: data.user.fid,
                username: data.user.username,
                displayName: data.user.displayName,
                pfpUrl: pfpUrl,
                mood: data.activity.suggestedMood,
                moodId: data.activity.suggestedMoodId,
                engagementScore: data.activity.engagementScore,
              });

              console.log(
                "[MiniApp] ✅ Mood detected:",
                data.activity.suggestedMood
              );
              setIsDetectingMood(false);
              return;
            }
          } else {
            const errorData = await response.json();
            console.error("[MiniApp] ❌ API Error:", errorData.error);
          }
        } catch (fetchError: any) {
          console.warn("[MiniApp] API fetch failed:", fetchError.message);
        }

        // ✅ FALLBACK: Use default mood if API fails
        console.warn("[MiniApp] Using fallback mood");
        setFarcasterData({
          fid: sdkUser.fid,
          username: sdkUser.username || "",
          displayName: sdkUser.displayName || `User ${sdkUser.fid}`,
          pfpUrl: sdkUser.pfpUrl || "",
          mood: "Creative Mind",
          moodId: "creative-mind",
          engagementScore: 100,
        });
      } catch (error: any) {
        console.error("[MiniApp] ❌ Mood detection error:", error);

        // ✅ EMERGENCY FALLBACK
        if (sdkUser) {
          setFarcasterData({
            fid: sdkUser.fid,
            username: sdkUser.username || "",
            displayName: sdkUser.displayName || `User ${sdkUser.fid}`,
            pfpUrl: sdkUser.pfpUrl || "",
            mood: "Creative Mind",
            moodId: "creative-mind",
            engagementScore: 100,
          });
        }
      } finally {
        setIsDetectingMood(false);
      }
    };

    detectMood();
  }, [sdkReady, sdkUser, farcasterData?.fid, setFarcasterData]);

  // ✅ UI SAFETY TIMEOUT (15s max for loading screen)
  useEffect(() => {
    if (isDetectingMood) {
      const timeout = setTimeout(() => {
        console.warn("[MiniApp] ⏰ UI timeout (15s) - forcing fallback");
        setIsDetectingMood(false);

        if (!farcasterData && sdkUser) {
          console.log("[MiniApp] Setting default mood due to UI timeout");
          setFarcasterData({
            fid: sdkUser.fid,
            username: sdkUser.username || "",
            displayName: sdkUser.displayName || `User ${sdkUser.fid}`,
            pfpUrl: sdkUser.pfpUrl || "",
            mood: "Creative Mind",
            moodId: "creative-mind",
            engagementScore: 100,
          });
        }
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [isDetectingMood, farcasterData, sdkUser, setFarcasterData]);

  // Animate gradient
  useEffect(() => {
    if (!currentMood) return;
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % currentMood.gradients.length);
    }, 400);
    return () => clearInterval(interval);
  }, [currentMood]);

  // Auto-clear mint error
  useEffect(() => {
    if (mintError || localMintError) {
      const timer = setTimeout(() => {
        setLocalMintError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mintError, localMintError]);

  // Reset PFP error when URL changes
  useEffect(() => {
    setPfpError(false);
  }, [farcasterData?.pfpUrl]);

  const handlePfpError = () => {
    console.error("[MiniApp] Failed to load PFP:", farcasterData?.pfpUrl);
    setPfpError(true);
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

  const handleMintFree = async () => {
    if (!farcasterData) {
      setLocalMintError("User data not found");
      return;
    }

    if (!isConnected) {
      setLocalMintError("Please connect your wallet first");
      return;
    }

    setLocalMintError("");
    try {
      await mintFree({
        fid: farcasterData.fid,
        moodId: farcasterData.moodId,
        moodName: farcasterData.mood,
        farcasterUsername: farcasterData.username,
        engagementScore: farcasterData.engagementScore,
      });
    } catch (err: any) {
      console.error("[MiniApp] Mint error:", err);
      setLocalMintError(err.message || "Failed to mint NFT");
    }
  };

  const handleMintHD = async () => {
    if (!farcasterData) {
      setLocalMintError("User data not found");
      return;
    }

    if (!isConnected) {
      setLocalMintError("Please connect your wallet first");
      return;
    }

    setLocalMintError("");
    try {
      await mintHD({
        fid: farcasterData.fid,
        moodId: farcasterData.moodId,
        moodName: farcasterData.mood,
        farcasterUsername: farcasterData.username,
        engagementScore: farcasterData.engagementScore,
      });
    } catch (err: any) {
      console.error("[MiniApp] Mint error:", err);
      setLocalMintError(err.message || "Failed to mint NFT");
    }
  };

  const FallbackAvatar = () => {
    const initial = farcasterData?.displayName?.charAt(0).toUpperCase() || "?";

    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-base">
        {initial}
      </div>
    );
  };

  // ✅ LOADING STATE
  if (!sdkReady || isDetectingMood) {
    return (
      <section
        id="pricing"
        className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
              Preparing Your Mint...
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 px-4">
              Analyzing your Farcaster activity
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border-2 border-purple-200 text-center shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Detecting Your Mood...
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Reading your Farcaster activity
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ MAIN CONTENT
  return (
    <section
      id="pricing"
      className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
            Mint Your Mood NFT
          </h2>
          {farcasterData && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 px-4">
              Your vibe:{" "}
              <span className="font-bold text-purple-600">
                {farcasterData.mood}
              </span>
            </p>
          )}
        </div>

        {/* ✅ ID CARD STYLE - Profile Card */}
        {farcasterData && currentMood && (
          <div className="max-w-md mx-auto mb-6 sm:mb-8">
            {/* ✅ Outer Card Container */}
            <div className="relative">
              {/* ✅ Gradient Background Card */}
              <div
                className="rounded-[1.5rem] overflow-hidden shadow-2xl transition-all duration-500 border-4 border-white/20"
                style={{
                  background: getGradientStyle(
                    currentMood.gradients[gradientIndex]
                  ),
                }}
              >
                {/* ✅ Top Section - Mood Image */}
                <div className="relative h-48 sm:h-56 flex items-center justify-center pt-6">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <Image
                      src={currentMood.baseImage}
                      alt={currentMood.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="160px"
                    />
                  </div>

                  {/* ✅ Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/40 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/40 rounded-tr-lg"></div>
                </div>

                {/* ✅ Middle Section - User Info */}
                <div className="relative bg-white/10 backdrop-blur-md border-t border-white/20">
                  {/* ✅ Avatar - Positioned to overlap */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white/20">
                      {hasValidPfp && farcasterData.pfpUrl ? (
                        <Image
                          src={farcasterData.pfpUrl}
                          alt={farcasterData.displayName}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                          onError={handlePfpError}
                        />
                      ) : (
                        <FallbackAvatar />
                      )}
                    </div>
                  </div>

                  {/* ✅ User Details */}
                  <div className="pt-12 pb-4 px-6 text-center text-white">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">
                      {farcasterData.displayName}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-1">
                      @{farcasterData.username}
                    </p>
                    <p className="text-white/60 text-xs">
                      FID {farcasterData.fid}
                    </p>
                  </div>
                </div>

                {/* ✅ Bottom Section - Mood Info */}
                <div className="bg-white/15 backdrop-blur-md border-t border-white/20 px-6 py-4">
                  <div className="text-center mb-4">
                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {currentMood.name}
                    </h4>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {currentMood.description}
                    </p>
                  </div>

                  {/* ✅ Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                      <div className="text-white/70 text-xs mb-1 uppercase tracking-wide">
                        Engagement Score
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold">
                        {farcasterData.engagementScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                      <div className="text-white/70 text-xs mb-1 uppercase tracking-wide">
                        Category
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold uppercase">
                        {currentMood.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Decorative Bottom Corners */}
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/40 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/40 rounded-br-lg"></div>
              </div>

              {/* ✅ Holographic Effect Overlay */}
              <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50"></div>
              </div>
            </div>
          </div>
        )}

        {/* Warning if wallet not connected */}
        {!isConnected && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-sm text-yellow-800 font-medium">
                Connect your wallet to mint your NFT
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Use the profile button in the header to connect
              </p>
            </div>
          </div>
        )}

        {/* Mobile Tier Selector */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-md md:hidden">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedTier("free")}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  selectedTier === "free"
                    ? "gradient-bg text-white shadow-lg"
                    : "text-slate-600 hover:bg-purple-50"
                }`}
              >
                FREE Edition
              </button>
              <button
                onClick={() => setSelectedTier("hd")}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition relative ${
                  selectedTier === "hd"
                    ? "gradient-bg text-white shadow-lg"
                    : "text-slate-600 hover:bg-purple-50"
                }`}
              >
                HD Premium
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  HOT
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Pricing Cards */}
        <div className="md:hidden max-w-md mx-auto">
          {selectedTier === "free" ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <div className="text-sm font-medium text-purple-600 mb-2">
                FREE MINT
              </div>
              <h3 className="text-2xl font-bold mb-2">SD Edition</h3>
              <div className="text-4xl font-bold gradient-text mb-4">FREE</div>
              <p className="text-slate-600 mb-6 text-sm">
                Perfect for trying out mood NFTs
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "512px resolution NFT",
                  "AI-generated mood art",
                  "Minted on Base mainnet",
                  "Shareable on socials",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleMintFree}
                disabled={
                  !isConnected ||
                  (mintType === "free" &&
                    (uploadingToIPFS || isPending || isConfirming)) ||
                  isSuccess
                }
                className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
              >
                {!isConnected && "Connect Wallet First"}
                {isConnected &&
                  uploadingToIPFS &&
                  mintType === "free" &&
                  "Uploading..."}
                {isConnected &&
                  isPending &&
                  mintType === "free" &&
                  !uploadingToIPFS &&
                  "Confirming..."}
                {isConnected &&
                  isConfirming &&
                  mintType === "free" &&
                  !uploadingToIPFS &&
                  "Minting..."}
                {isConnected && isSuccess && mintType === "free" && "Minted!"}
                {isConnected &&
                ((!uploadingToIPFS &&
                  !isPending &&
                  !isConfirming &&
                  !isSuccess) ||
                  mintType !== "free")
                  ? "Mint Free NFT"
                  : ""}
              </button>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                MOST POPULAR
              </div>
              {isDevAddress && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  DEV - FREE
                </div>
              )}
              <div className="text-sm font-medium text-purple-600 mb-2 mt-2">
                HD PREMIUM
              </div>
              <h3 className="text-2xl font-bold mb-2">HD Edition</h3>
              <div className="text-4xl font-bold gradient-text mb-4">
                {isDevAddress ? "FREE" : "0.001 ETH"}
              </div>
              <p className="text-slate-600 mb-6 text-sm">
                {isDevAddress ? "Developer Access" : "For collectors"}
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "2048px high resolution",
                  "Enhanced AI algorithm",
                  "Commercial rights",
                  "Priority support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleMintHD}
                disabled={
                  !isConnected ||
                  (mintType === "hd" &&
                    (uploadingToIPFS || isPending || isConfirming)) ||
                  isSuccess
                }
                className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
              >
                {!isConnected && "Connect Wallet First"}
                {isConnected &&
                  uploadingToIPFS &&
                  mintType === "hd" &&
                  "Uploading..."}
                {isConnected &&
                  isPending &&
                  mintType === "hd" &&
                  !uploadingToIPFS &&
                  "Confirming..."}
                {isConnected &&
                  isConfirming &&
                  mintType === "hd" &&
                  !uploadingToIPFS &&
                  "Minting..."}
                {isConnected && isSuccess && mintType === "hd" && "Minted!"}
                {isConnected &&
                ((!uploadingToIPFS &&
                  !isPending &&
                  !isConfirming &&
                  !isSuccess) ||
                  mintType !== "hd")
                  ? "Mint HD NFT"
                  : ""}
              </button>
            </div>
          )}
        </div>

        {/* Desktop Pricing Cards */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all">
            <div className="text-sm font-medium text-purple-600 mb-2">
              FREE MINT
            </div>
            <h3 className="text-2xl font-bold mb-2">SD Edition</h3>
            <div className="text-4xl font-bold gradient-text mb-4">FREE</div>
            <p className="text-slate-600 mb-6">
              Perfect for trying out mood NFTs
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "512px resolution NFT",
                "AI-generated mood art",
                "Minted on Base mainnet",
                "Shareable on socials",
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleMintFree}
              disabled={
                !isConnected ||
                (mintType === "free" &&
                  (uploadingToIPFS || isPending || isConfirming)) ||
                isSuccess
              }
              className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
            >
              {!isConnected && "Connect Wallet First"}
              {isConnected &&
                uploadingToIPFS &&
                mintType === "free" &&
                "Uploading..."}
              {isConnected &&
                isPending &&
                mintType === "free" &&
                !uploadingToIPFS &&
                "Confirming..."}
              {isConnected &&
                isConfirming &&
                mintType === "free" &&
                !uploadingToIPFS &&
                "Minting..."}
              {isConnected && isSuccess && mintType === "free" && "Minted!"}
              {isConnected &&
              ((!uploadingToIPFS &&
                !isPending &&
                !isConfirming &&
                !isSuccess) ||
                mintType !== "free")
                ? "Mint Free NFT"
                : ""}
            </button>
          </div>

          {/* HD Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-purple-500 hover:border-purple-600 hover:shadow-2xl transition-all relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              MOST POPULAR
            </div>
            {isDevAddress && (
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                DEV - FREE
              </div>
            )}
            <div className="text-sm font-medium text-purple-600 mb-2">
              HD PREMIUM
            </div>
            <h3 className="text-2xl font-bold mb-2">HD Edition</h3>
            <div className="text-4xl font-bold gradient-text mb-4">
              {isDevAddress ? "FREE" : "0.001 ETH"}
            </div>
            <p className="text-slate-600 mb-6">
              {isDevAddress
                ? "Developer Access"
                : "For collectors and believers"}
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "2048px high resolution",
                "Enhanced AI algorithm",
                "Commercial rights included",
                "Priority support",
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleMintHD}
              disabled={
                !isConnected ||
                (mintType === "hd" &&
                  (uploadingToIPFS || isPending || isConfirming)) ||
                isSuccess
              }
              className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
            >
              {!isConnected && "Connect Wallet First"}
              {isConnected &&
                uploadingToIPFS &&
                mintType === "hd" &&
                "Uploading..."}
              {isConnected &&
                isPending &&
                mintType === "hd" &&
                !uploadingToIPFS &&
                "Confirming..."}
              {isConnected &&
                isConfirming &&
                mintType === "hd" &&
                !uploadingToIPFS &&
                "Minting..."}
              {isConnected && isSuccess && mintType === "hd" && "Minted!"}
              {isConnected &&
              ((!uploadingToIPFS &&
                !isPending &&
                !isConfirming &&
                !isSuccess) ||
                mintType !== "hd")
                ? "Mint HD NFT"
                : ""}
            </button>
          </div>
        </div>

        {/* Success Notification */}
        {isSuccess && hash && (
          <div className="fixed top-4 right-4 max-w-sm bg-white rounded-xl p-4 shadow-xl z-50 border-2 border-green-500 animate-slide-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-green-900 text-sm mb-0.5">
                  Minted Successfully
                </h4>
                <p className="text-xs text-slate-500 mb-2 truncate">
                  {hash.slice(0, 8)}...{hash.slice(-6)}
                </p>
                <div className="flex gap-2">
                  <a
                    href={getTransactionUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center gradient-bg text-white text-xs py-1.5 px-2 rounded-md hover:opacity-90 transition font-medium"
                  >
                    View on Basescan
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification - FIXED */}
        {(mintError || localMintError) && (
          <div className="fixed bottom-4 right-4 max-w-md bg-white border-2 border-red-500 rounded-xl p-4 shadow-2xl z-50 animate-slide-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-red-900 text-sm mb-1">
                  Transaction Failed
                </h4>
                <p className="text-xs text-red-700 break-words">
                  {mintError?.message || localMintError || "Unknown error"}
                </p>
              </div>
              {/* ✅ FIXED: Add onClick handler */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLocalMintError("");
                  // ✅ Also reload page to clear error state
                  window.location.reload();
                }}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label="Close"
                type="button"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
