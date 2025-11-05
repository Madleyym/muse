"use client";

import { useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
} from "viem";
import { base } from "viem/chains";
import { MUSE_NFT_CONTRACT } from "@/config/contracts";
import { useFrameWallet } from "./useFrameWallet";

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

  const { address, isConnected, provider } = useFrameWallet();

  const mintFree = async (params: MintParams) => {
    setMintType("free");
    setUploadingToIPFS(true);
    setError(null);

    try {
      // ✅ Check wallet connection
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

      // 1️⃣ Upload metadata to IPFS
      console.log("[MiniApp] Uploading to IPFS...");
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
      console.log("[MiniApp] ✅ IPFS complete:", metadataURI);

      setUploadingToIPFS(false);

      // 2️⃣ Create wallet client from Frame provider
      console.log("[MiniApp] 🔄 Preparing transaction...");
      setIsPending(true);

      const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http(
          process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
        ),
      });

      // 3️⃣ Send transaction
      console.log("[MiniApp] 📝 Sending transaction...");

      const txHash = await walletClient.writeContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "mintFree",
        args: [
          BigInt(params.fid),
          params.moodId,
          params.moodName,
          params.farcasterUsername,
          BigInt(params.engagementScore),
          metadataURI,
        ],
      });

      console.log("[MiniApp] ✅ Transaction sent:", txHash);
      setHash(txHash);
      setIsPending(false);

      // 4️⃣ Wait for confirmation
      console.log("[MiniApp] ⏳ Waiting for confirmation...");
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log("[MiniApp] 🎉 Mint Free successful!");
    } catch (err: any) {
      console.error("[MiniApp] ❌ Mint Free error:", err);
      setUploadingToIPFS(false);
      setIsPending(false);
      setIsConfirming(false);
      const errorObj = new Error(err.message || "Failed to mint NFT");
      setError(errorObj);
      throw errorObj;
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setUploadingToIPFS(true);
    setError(null);

    try {
      // ✅ Check wallet connection
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

      // 1️⃣ Upload metadata to IPFS
      console.log("[MiniApp] Uploading to IPFS...");
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
      console.log("[MiniApp] ✅ IPFS complete:", metadataURI);

      setUploadingToIPFS(false);

      // 2️⃣ Create wallet client from Frame provider
      console.log("[MiniApp] 🔄 Preparing transaction...");
      setIsPending(true);

      const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http(
          process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
        ),
      });

      // 3️⃣ Send transaction
      console.log("[MiniApp] 📝 Sending transaction...");

      const txHash = await walletClient.writeContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "mintHD",
        args: [
          BigInt(params.fid),
          params.moodId,
          params.moodName,
          params.farcasterUsername,
          BigInt(params.engagementScore),
          metadataURI,
        ],
        value: parseEther("0.001"), // User bayar 0.001 ETH
      });

      console.log("[MiniApp] ✅ Transaction sent:", txHash);
      setHash(txHash);
      setIsPending(false);

      // 4️⃣ Wait for confirmation
      console.log("[MiniApp] ⏳ Waiting for confirmation...");
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log("[MiniApp] 🎉 Mint HD successful!");
    } catch (err: any) {
      console.error("[MiniApp] ❌ Mint HD error:", err);
      setUploadingToIPFS(false);
      setIsPending(false);
      setIsConfirming(false);
      const errorObj = new Error(err.message || "Failed to mint NFT");
      setError(errorObj);
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
    isDevAddress: false,
    isCheckingDev: false,
    error,
    hash,
  };
}
