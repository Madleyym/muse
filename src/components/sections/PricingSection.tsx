"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useFarcaster } from "@/contexts/FarcasterContext";
import { nftMoods } from "@/data/nftMoods";
import { useMintNFT } from "@/hooks/useMintNFT";
import { getTransactionUrl } from "@/config/contracts";

export default function PricingSection() {
  const { isConnected } = useAccount();
  const { farcasterData, setFarcasterData } = useFarcaster();

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

  const [step, setStep] = useState<"connect" | "fid" | "preview">("connect");
  const [fid, setFid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gradientIndex, setGradientIndex] = useState(0);
  const [localMintError, setLocalMintError] = useState<string>("");

  const currentMood = useMemo(() => {
    if (!farcasterData) return null;
    return nftMoods.find((mood) => mood.id === farcasterData.moodId) || null;
  }, [farcasterData]);

  // Parse and shorten error messages
  const parseErrorMessage = (error: string): string => {
    if (!error) return "Please try again";

    // Shorten contract addresses
    if (error.includes("0x")) {
      error = error.replace(
        /0x[a-fA-F0-9]{40,}/g,
        (match) => `${match.slice(0, 6)}...${match.slice(-4)}`
      );
    }

    // Extract key error messages
    if (error.includes("User rejected") || error.includes("user rejected")) {
      return "You cancelled the transaction";
    }
    if (error.includes("insufficient funds")) {
      return "Insufficient ETH for gas fee";
    }
    if (error.includes("out of gas")) {
      return "This FID has already minted";
    }
    if (error.includes("already minted")) {
      return "This FID has already minted";
    }

    // Limit length
    if (error.length > 120) {
      return error.substring(0, 120) + "...";
    }

    return error;
  };

  useEffect(() => {
    if (!currentMood) return;

    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % currentMood.gradients.length);
    }, 400);

    return () => clearInterval(interval);
  }, [currentMood]);

  useEffect(() => {
    if (isConnected && step === "connect") {
      setStep("fid");
    }
  }, [isConnected, step]);

  useEffect(() => {
    if (farcasterData && isConnected) {
      setStep("preview");
    }
  }, [farcasterData, isConnected]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (mintError || localMintError) {
      const timer = setTimeout(() => {
        setLocalMintError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mintError, localMintError]);

  const handleVerifyFID = async () => {
    if (!fid || isNaN(Number(fid))) {
      setError("Please enter a valid FID number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/farcaster/verify?fid=${fid}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error || "FID not found. Please check your Farcaster ID."
        );
        setLoading(false);
        return;
      }

      setFarcasterData({
        fid: data.user.fid,
        username: data.user.username,
        displayName: data.user.displayName,
        pfpUrl: data.user.pfpUrl,
        mood: data.activity.suggestedMood,
        moodId: data.activity.suggestedMoodId,
        engagementScore: data.activity.engagementScore,
      });

      setStep("preview");
    } catch (err) {
      setError("Failed to verify FID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMintFree = async () => {
    if (!farcasterData) {
      setError("Please verify your Farcaster ID first");
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
      console.error("Mint error:", err);
      setLocalMintError(err.message || "Failed to mint NFT");
    }
  };

  const handleMintHD = async () => {
    if (!farcasterData) {
      setError("Please verify your Farcaster ID first");
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
      console.error("Mint error:", err);
      setLocalMintError(err.message || "Failed to mint NFT");
    }
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

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold gradient-text">
            {step === "connect" && "Connect Wallet to Start"}
            {step === "fid" && "Enter Your Farcaster ID"}
            {step === "preview" && "Choose Your Mint Tier"}
          </h2>
          <p className="mt-4 text-slate-600">
            {step === "connect" &&
              "First, connect your Web3 wallet to mint your mood NFT"}
            {step === "fid" &&
              "We'll analyze your Farcaster activity to generate your unique mood"}
            {step === "preview" &&
              farcasterData &&
              `Your vibe: ${farcasterData.mood}`}
          </p>
        </div>

        {!isConnected && step === "connect" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border-2 border-purple-200 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Connect your wallet to mint mood NFTs based on your Farcaster
                activity
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="inline-flex items-center gradient-bg text-white font-medium px-8 py-4 rounded-xl hover:opacity-90 transition text-lg shadow-lg"
                  >
                    Connect Wallet to Continue
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        )}

        {isConnected && step === "fid" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 gradient-text">
                  Enter Your Farcaster ID
                </h3>
                <p className="text-slate-600">
                  We'll analyze your activity to generate a unique mood NFT
                </p>
              </div>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter FID (e.g., 5650)"
                  value={fid}
                  onChange={(e) => setFid(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fid) {
                      handleVerifyFID();
                    }
                  }}
                  className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
                />
                <button
                  onClick={handleVerifyFID}
                  disabled={loading || !fid}
                  className="px-6 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? "Analyzing..." : "Verify FID"}
                </button>
              </div>

              {error && (
                <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="text-center text-sm text-slate-500 mb-3">
                  Don't know your FID?{" "}
                  <a
                    href="https://warpcast.com/~/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Find it here
                  </a>
                </div>

                <button
                  onClick={() => setStep("preview")}
                  className="w-full text-center text-sm text-slate-600 hover:text-purple-600 transition py-2 hover:bg-purple-50 rounded-lg"
                >
                  Skip and choose mood manually
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      How it works
                    </h4>
                    <p className="text-sm text-blue-700">
                      We analyze your Farcaster likes, casts, and engagement to
                      determine your social vibe and generate a unique mood NFT
                      that represents you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConnected && step === "preview" && (
          <>
            {farcasterData && currentMood && (
              <div className="max-w-3xl mx-auto mb-8">
                <div
                  className="rounded-2xl p-6 text-white shadow-xl transition-all duration-500"
                  style={{
                    background: getGradientStyle(
                      currentMood.gradients[gradientIndex]
                    ),
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-48 h-48 flex-shrink-0">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
                      <div className="relative w-full h-full p-4">
                        <Image
                          src={currentMood.baseImage}
                          alt={currentMood.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                          sizes="192px"
                        />
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-4 border-white/30">
                          <Image
                            src={farcasterData.pfpUrl}
                            alt={farcasterData.displayName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">
                            {farcasterData.displayName}
                          </h3>
                          <p className="text-white/80 text-sm">
                            @{farcasterData.username} · FID {farcasterData.fid}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl font-bold mb-1">
                          {currentMood.name}
                        </div>
                        <div className="text-sm text-white/80 mb-3">
                          {currentMood.description}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <div>
                            <div className="text-xs text-white/70">
                              Engagement Score
                            </div>
                            <div className="text-xl font-bold">
                              {farcasterData.engagementScore.toLocaleString()}
                            </div>
                          </div>
                          <div className="h-8 w-px bg-white/30"></div>
                          <div>
                            <div className="text-xs text-white/70">
                              Category
                            </div>
                            <div className="text-xl font-bold uppercase">
                              {currentMood.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all">
                <div className="text-sm font-medium text-purple-600 mb-2">
                  FREE MINT
                </div>
                <h3 className="text-2xl font-bold mb-2">SD Edition</h3>
                <div className="text-4xl font-bold gradient-text mb-4">
                  FREE
                </div>
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
                        ></path>
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
                  className="block w-full text-center gradient-bg text-white font-medium px-4 py-3 rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingToIPFS &&
                    mintType === "free" &&
                    "Uploading to IPFS..."}
                  {isPending &&
                    mintType === "free" &&
                    !uploadingToIPFS &&
                    "Confirm in Wallet..."}
                  {isConfirming &&
                    mintType === "free" &&
                    !uploadingToIPFS &&
                    "Minting NFT..."}
                  {isSuccess && mintType === "free" && "Minted Successfully"}
                  {(!uploadingToIPFS &&
                    !isPending &&
                    !isConfirming &&
                    !isSuccess) ||
                  mintType !== "free"
                    ? "Mint Free NFT"
                    : ""}
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
                        ></path>
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
                  className="block w-full text-center gradient-bg text-white font-medium px-4 py-3 rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingToIPFS &&
                    mintType === "hd" &&
                    "Uploading to IPFS..."}
                  {isPending &&
                    mintType === "hd" &&
                    !uploadingToIPFS &&
                    "Confirm in Wallet..."}
                  {isConfirming &&
                    mintType === "hd" &&
                    !uploadingToIPFS &&
                    "Minting NFT..."}
                  {isSuccess && mintType === "hd" && "Minted Successfully"}
                  {(!uploadingToIPFS &&
                    !isPending &&
                    !isConfirming &&
                    !isSuccess) ||
                  mintType !== "hd"
                    ? "Mint HD NFT"
                    : ""}
                </button>
              </div>
            </div>

            {farcasterData && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setStep("fid");
                    setFarcasterData(null);
                    setFid("");
                  }}
                  className="text-sm text-slate-600 hover:text-purple-600 transition"
                >
                  Try different FID
                </button>
              </div>
            )}
          </>
        )}

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
                  Minted Successfully! 🎉
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
                    Basescan
                  </a>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 text-center border border-slate-300 text-slate-700 text-xs py-1.5 px-2 rounded-md hover:bg-slate-50 transition font-medium"
                  >
                    Mint Again
                  </button>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition -mt-1"
                aria-label="Close"
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
                  {parseErrorMessage(mintError?.message || localMintError)}
                </p>
              </div>
              <button
                onClick={() => setLocalMintError("")}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
                aria-label="Close"
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

            {/* Auto-dismiss progress bar */}
            <div className="mt-3 h-1 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-shrink" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
