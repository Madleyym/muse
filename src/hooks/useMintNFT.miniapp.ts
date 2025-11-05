"use client";

import { useState } from "react";

export interface MintParams {
  fid: number;
  moodId: string;
  moodName: string;
  farcasterUsername: string;
  engagementScore: number;
}

export function useMintNFTMiniApp() {
  const [mintType, setMintType] = useState<"free" | "hd" | null>(null);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mintFree = async (params: MintParams) => {
    setMintType("free");
    setUploadingToIPFS(true);
    setError(null);

    try {
      // 1️⃣ Upload metadata to IPFS
      const uploadResponse = await fetch("/api/metadata/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: params.fid,
          moodId: params.moodId,
          moodName: params.moodName,
          username: params.farcasterUsername,
          engagementScore: params.engagementScore,
          isHD: false,
          imageUrl: `/assets/images/Pro/${params.moodId}.png`,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const { metadataURI } = await uploadResponse.json();
      setUploadingToIPFS(false);

      // 2️⃣ Call mint API (miniapp version)
      setIsPending(true);

      const mintResponse = await fetch("/api/miniapp/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: params.fid,
          moodId: params.moodId,
          moodName: params.moodName,
          farcasterUsername: params.farcasterUsername,
          engagementScore: params.engagementScore,
          metadataURI: metadataURI,
          tier: "free",
        }),
      });

      if (!mintResponse.ok) {
        const errorData = await mintResponse.json();
        throw new Error(errorData.error || "Failed to mint NFT");
      }

      const { hash: txHash } = await mintResponse.json();
      setIsPending(false);
      setIsConfirming(true);

      // 3️⃣ Wait for confirmation
      setHash(txHash);
      setIsSuccess(true);
      setIsConfirming(false);

      console.log("[MiniApp] ✅ Mint Free successful:", txHash);
    } catch (err: any) {
      setUploadingToIPFS(false);
      setIsPending(false);
      setIsConfirming(false);
      const errorObj = new Error(err.message || "Failed to mint NFT");
      setError(errorObj);
      console.error("[MiniApp] ❌ Mint Free error:", err);
      throw errorObj;
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setUploadingToIPFS(true);
    setError(null);

    try {
      // 1️⃣ Upload metadata to IPFS
      const uploadResponse = await fetch("/api/metadata/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: params.fid,
          moodId: params.moodId,
          moodName: params.moodName,
          username: params.farcasterUsername,
          engagementScore: params.engagementScore,
          isHD: true,
          imageUrl: `/assets/images/Pro/${params.moodId}.png`,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const { metadataURI } = await uploadResponse.json();
      setUploadingToIPFS(false);

      // 2️⃣ Call mint API (miniapp version)
      setIsPending(true);

      const mintResponse = await fetch("/api/miniapp/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: params.fid,
          moodId: params.moodId,
          moodName: params.moodName,
          farcasterUsername: params.farcasterUsername,
          engagementScore: params.engagementScore,
          metadataURI: metadataURI,
          tier: "hd",
        }),
      });

      if (!mintResponse.ok) {
        const errorData = await mintResponse.json();
        throw new Error(errorData.error || "Failed to mint NFT");
      }

      const { hash: txHash } = await mintResponse.json();
      setIsPending(false);
      setIsConfirming(true);

      // 3️⃣ Wait for confirmation
      setHash(txHash);
      setIsSuccess(true);
      setIsConfirming(false);

      console.log("[MiniApp] ✅ Mint HD successful:", txHash);
    } catch (err: any) {
      setUploadingToIPFS(false);
      setIsPending(false);
      setIsConfirming(false);
      const errorObj = new Error(err.message || "Failed to mint NFT");
      setError(errorObj);
      console.error("[MiniApp] ❌ Mint HD error:", err);
      throw errorObj;
    }
  };

  return {
    mintFree,
    mintHD,
    mintType,
    isPending,
    isConfirming,
    isSuccess,
    uploadingToIPFS,
    isDevAddress: false, // Miniapp tidak perlu check dev address
    isCheckingDev: false,
    error,
    hash,
  };
}
