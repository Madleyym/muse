"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { nftMoods } from "@/data/nftMoods";
import { useMintNFTMiniApp } from "@/hooks/useMintNFT.miniapp";
import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";
import { useFrameWallet } from "@/hooks/useFrameWallet";
import { getTransactionUrl, getOpenSeaUrl } from "@/config/contracts";

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
    checkIfAlreadyMinted,
    mintType,
    isPending,
    isConfirming,
    isSuccess,
    uploadingToIPFS,
    isDevAddress,
    error: mintError,
    hash,
    tokenId,
  } = useMintNFTMiniApp();

  const [selectedTier, setSelectedTier] = useState<"free" | "hd">("free");
  const [gradientIndex, setGradientIndex] = useState(0);
  const [localMintError, setLocalMintError] = useState<string>("");
  const [isDetectingMood, setIsDetectingMood] = useState(true);
  const [pfpError, setPfpError] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [checkingMinted, setCheckingMinted] = useState(false);
  const [inspiredByUsername, setInspiredByUsername] = useState<string>("");

  const checkedFidRef = useRef<number | null>(null);

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

  const getWarpcastShareUrl = () => {
    const baseUrl = "https://warpcast.com/~/compose";

    const inspiredText = inspiredByUsername
      ? `\n\nInspired by @${inspiredByUsername} ✨`
      : "";

    const text = encodeURIComponent(
      `Just minted my ${
        farcasterData?.mood || "Creative Mind"
      } mood NFT! 🎨✨\n\nPowered by Muse on @base${inspiredText}`
    );

    const embedUrl = encodeURIComponent(
      `https://muse.write3.fun${currentMood?.ogImage || "/og/fire-starter.png"}`
    );

    return `${baseUrl}?text=${text}&embeds[]=${embedUrl}`;
  };

  useEffect(() => {
    const checkMinted = async () => {
      if (!farcasterData?.fid || !checkIfAlreadyMinted) return;
      if (checkedFidRef.current === farcasterData.fid) return;

      setCheckingMinted(true);
      try {
        console.log(
          "[MiniApp] Checking mint status for FID:",
          farcasterData.fid
        );
        const minted = await checkIfAlreadyMinted(farcasterData.fid);
        checkedFidRef.current = farcasterData.fid;
        setHasMinted(minted);
        if (minted) {
          console.log("[MiniApp] ⚠️ FID already minted");
        } else {
          console.log("[MiniApp] ✅ FID can mint");
        }
      } catch (error: any) {
        console.error("[MiniApp] Check minted error:", error);
      } finally {
        setCheckingMinted(false);
      }
    };
    checkMinted();
  }, [farcasterData?.fid, checkIfAlreadyMinted]);

  useEffect(() => {
    if (isSuccess && hash) {
      setShowSuccessNotification(true);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (mintError || localMintError) {
      setShowErrorNotification(true);
      const timer = setTimeout(() => {
        setShowErrorNotification(false);
        setLocalMintError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mintError, localMintError]);

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

  useEffect(() => {
    if (!currentMood) return;
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % currentMood.gradients.length);
    }, 400);
    return () => clearInterval(interval);
  }, [currentMood]);

  useEffect(() => {
    setPfpError(false);
  }, [farcasterData?.pfpUrl]);

  const handlePfpError = () => {
    console.error("[MiniApp] Failed to load PFP:", farcasterData?.pfpUrl);
    setPfpError(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessNotification(false);

    if (farcasterData?.fid && checkIfAlreadyMinted) {
      checkedFidRef.current = null;

      checkIfAlreadyMinted(farcasterData.fid).then((minted) => {
        setHasMinted(minted);
        checkedFidRef.current = farcasterData.fid;
        console.log("[MiniApp] 🔄 Re-checked FID status:", minted);
      });
    }
  };

  const handleCloseError = () => {
    setShowErrorNotification(false);
    setLocalMintError("");
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
    setShowErrorNotification(false);
    try {
      await mintFree({
        fid: farcasterData.fid,
        moodId: farcasterData.moodId,
        moodName: farcasterData.mood,
        farcasterUsername: farcasterData.username,
        engagementScore: farcasterData.engagementScore,
        inspiredBy: inspiredByUsername || undefined,
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
    setShowErrorNotification(false);
    try {
      await mintHD({
        fid: farcasterData.fid,
        moodId: farcasterData.moodId,
        moodName: farcasterData.mood,
        farcasterUsername: farcasterData.username,
        engagementScore: farcasterData.engagementScore,
        inspiredBy: inspiredByUsername || undefined,
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

        {farcasterData && currentMood && (
          <div className="max-w-md mx-auto mb-6 px-4">
            <div className="rounded-3xl p-[2px] bg-white/20 shadow-2xl">
              <div
                className="rounded-3xl p-4 text-white transition-all duration-500"
                style={{
                  background: getGradientStyle(
                    currentMood.gradients[gradientIndex]
                  ),
                }}
              >
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/50 bg-white/20 shadow-lg flex-shrink-0">
                    {hasValidPfp && farcasterData.pfpUrl ? (
                      <Image
                        src={farcasterData.pfpUrl}
                        alt={farcasterData.displayName}
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized
                        onError={handlePfpError}
                      />
                    ) : (
                      <FallbackAvatar />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold truncate leading-tight">
                      {farcasterData.displayName}
                    </h3>
                    <p className="text-white/80 text-xs truncate leading-tight">
                      @{farcasterData.username} · FID {farcasterData.fid}
                    </p>
                  </div>
                </div>

                <div className="mb-3.5 flex justify-center">
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
                    <div className="relative w-full h-full p-3">
                      <Image
                        src={currentMood.baseImage}
                        alt={currentMood.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="144px"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3.5">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30 shadow-lg">
                    <p className="text-[11px] text-white/90 leading-relaxed text-center line-clamp-3">
                      {currentMood.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-2 border border-white/30 shadow-lg text-center">
                    <div className="text-[8px] text-white/70 uppercase tracking-wider leading-tight mb-1">
                      Engagement
                    </div>
                    <div className="text-lg font-bold leading-tight">
                      {farcasterData.engagementScore.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-2.5 py-2 border border-white/30 shadow-lg text-center">
                    <div className="text-[8px] text-white/70 uppercase tracking-wider leading-tight mb-1">
                      Category
                    </div>
                    <div className="text-lg font-bold uppercase leading-tight">
                      {currentMood.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasMinted && isConnected && (
          <div className="max-w-md mx-auto mb-6 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-purple-200">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tag someone who inspires this mint (optional) ✨
              </label>
              <input
                type="text"
                placeholder="@username"
                value={inspiredByUsername}
                onChange={(e) =>
                  setInspiredByUsername(e.target.value.replace("@", ""))
                }
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                They'll be mentioned when you share your mint on Warpcast! 💜
              </p>
            </div>
          </div>
        )}

        {hasMinted && !checkingMinted && (
          <div className="max-w-md mx-auto mb-4 px-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-4 shadow-lg">
              <h3 className="text-base font-bold text-orange-900 mb-1 leading-tight">
                Already Minted!
              </h3>
              <p className="text-xs text-orange-800 leading-snug">
                This FID already minted — only one mint allowed.
              </p>
            </div>
          </div>
        )}

        {!isConnected && !hasMinted && (
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
                  checkingMinted ||
                  hasMinted ||
                  !isConnected ||
                  (mintType === "free" &&
                    (uploadingToIPFS || isPending || isConfirming)) ||
                  isSuccess
                }
                className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
              >
                {checkingMinted && "Checking..."}
                {!checkingMinted && hasMinted && "Already Minted"}
                {!checkingMinted &&
                  !hasMinted &&
                  !isConnected &&
                  "Connect Wallet First"}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  uploadingToIPFS &&
                  mintType === "free" &&
                  "Uploading..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isPending &&
                  mintType === "free" &&
                  !uploadingToIPFS &&
                  "Confirming..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isConfirming &&
                  mintType === "free" &&
                  !uploadingToIPFS &&
                  "Minting..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isSuccess &&
                  mintType === "free" &&
                  "Minted!"}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  ((!uploadingToIPFS &&
                    !isPending &&
                    !isConfirming &&
                    !isSuccess) ||
                    mintType !== "free") &&
                  "Mint Free NFT"}
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
                  checkingMinted ||
                  hasMinted ||
                  !isConnected ||
                  (mintType === "hd" &&
                    (uploadingToIPFS || isPending || isConfirming)) ||
                  isSuccess
                }
                className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
              >
                {checkingMinted && "Checking..."}
                {!checkingMinted && hasMinted && "Already Minted"}
                {!checkingMinted &&
                  !hasMinted &&
                  !isConnected &&
                  "Connect Wallet First"}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  uploadingToIPFS &&
                  mintType === "hd" &&
                  "Uploading..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isPending &&
                  mintType === "hd" &&
                  !uploadingToIPFS &&
                  "Confirming..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isConfirming &&
                  mintType === "hd" &&
                  !uploadingToIPFS &&
                  "Minting..."}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  isSuccess &&
                  mintType === "hd" &&
                  "Minted!"}
                {!checkingMinted &&
                  !hasMinted &&
                  isConnected &&
                  ((!uploadingToIPFS &&
                    !isPending &&
                    !isConfirming &&
                    !isSuccess) ||
                    mintType !== "hd") &&
                  "Mint HD NFT"}
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                checkingMinted ||
                hasMinted ||
                !isConnected ||
                (mintType === "free" &&
                  (uploadingToIPFS || isPending || isConfirming)) ||
                isSuccess
              }
              className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
            >
              {checkingMinted && "Checking..."}
              {!checkingMinted && hasMinted && "Already Minted"}
              {!checkingMinted &&
                !hasMinted &&
                uploadingToIPFS &&
                mintType === "free" &&
                "Uploading..."}
              {!checkingMinted &&
                !hasMinted &&
                isPending &&
                mintType === "free" &&
                !uploadingToIPFS &&
                "Confirming..."}
              {!checkingMinted &&
                !hasMinted &&
                isConfirming &&
                mintType === "free" &&
                !uploadingToIPFS &&
                "Minting..."}
              {!checkingMinted &&
                !hasMinted &&
                isSuccess &&
                mintType === "free" &&
                "Minted!"}
              {!checkingMinted &&
                !hasMinted &&
                ((!uploadingToIPFS &&
                  !isPending &&
                  !isConfirming &&
                  !isSuccess) ||
                  mintType !== "free") &&
                "Mint Free NFT"}
            </button>
          </div>

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
                checkingMinted ||
                hasMinted ||
                !isConnected ||
                (mintType === "hd" &&
                  (uploadingToIPFS || isPending || isConfirming)) ||
                isSuccess
              }
              className="block w-full text-center gradient-bg text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-[0.625rem] hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm active:scale-95"
            >
              {checkingMinted && "Checking..."}
              {!checkingMinted && hasMinted && "Already Minted"}
              {!checkingMinted &&
                !hasMinted &&
                uploadingToIPFS &&
                mintType === "hd" &&
                "Uploading..."}
              {!checkingMinted &&
                !hasMinted &&
                isPending &&
                mintType === "hd" &&
                !uploadingToIPFS &&
                "Confirming..."}
              {!checkingMinted &&
                !hasMinted &&
                isConfirming &&
                mintType === "hd" &&
                !uploadingToIPFS &&
                "Minting..."}
              {!checkingMinted &&
                !hasMinted &&
                isSuccess &&
                mintType === "hd" &&
                "Minted!"}
              {!checkingMinted &&
                !hasMinted &&
                ((!uploadingToIPFS &&
                  !isPending &&
                  !isConfirming &&
                  !isSuccess) ||
                  mintType !== "hd") &&
                "Mint HD NFT"}
            </button>
          </div>
        </div>

        {showSuccessNotification && isSuccess && hash && (
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
                  Minted Successfully! 🎉
                </h4>
                <p className="text-xs text-slate-500 mb-2 truncate">
                  {hash.slice(0, 8)}...{hash.slice(-6)}
                </p>

                <div className="space-y-2">
                  {tokenId && (
                    <a
                      href={getOpenSeaUrl(tokenId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      View on OpenSea 🌊
                    </a>
                  )}

                  <a
                    href={getWarpcastShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-purple-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-purple-700 transition font-medium"
                  >
                    Share on Warpcast 🎨
                  </a>
                </div>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Each FID can only mint once
                </p>
              </div>

              <button
                onClick={handleCloseSuccess}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition -mt-1 cursor-pointer"
                aria-label="Close notification"
                type="button"
              >
                <svg
                  className="w-4 h-4"
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

            <div className="mt-2 h-0.5 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-shrink-slow" />
            </div>
          </div>
        )}

        {showErrorNotification && (mintError || localMintError) && (
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
              <button
                onClick={handleCloseError}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label="Close notification"
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
            <div className="mt-3 h-1 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-shrink" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
