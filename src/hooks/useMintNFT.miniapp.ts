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

  // ✅ CHECK IF FID ALREADY MINTED
  const checkIfAlreadyMinted = async (fid: number): Promise<boolean> => {
    try {
      console.log("[MiniApp] Checking if FID", fid, "already minted...");

      const publicClient = createPublicClient({
        chain: base,
        transport: http(
          process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
        ),
      });

      const hasMinted = await publicClient.readContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "hasFIDMinted",
        args: [BigInt(fid)],
      });

      console.log("[MiniApp] FID", fid, "minted status:", hasMinted);
      return hasMinted as boolean;
    } catch (error: any) {
      console.error("[MiniApp] Check minted error:", error);
      return false;
    }
  };

  const mintFree = async (params: MintParams) => {
    setMintType("free");
    setError(null);

    try {
      // ✅ 1. CHECK IF ALREADY MINTED
      console.log("[MiniApp] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        throw new Error(
          "This FID has already minted an NFT. Each FID can only mint once."
        );
      }

      // ✅ 2. CHECK WALLET CONNECTION
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

      // ✅ 3. UPLOAD TO IPFS
      setUploadingToIPFS(true);
      console.log("[MiniApp] Step 2: Uploading to IPFS...");

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

      // ✅ 4. PREPARE TRANSACTION
      console.log("[MiniApp] Step 3: Preparing transaction...");
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

      // ✅ 5. SEND TRANSACTION
      console.log("[MiniApp] Step 4: Sending transaction...");

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

      // ✅ 6. WAIT FOR CONFIRMATION
      console.log("[MiniApp] Step 5: Waiting for confirmation...");
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

      let errorMessage = err.message || "Failed to mint NFT";

      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        errorMessage = "Transaction cancelled by user";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH balance for gas fees";
      }

      const errorObj = new Error(errorMessage);
      setError(errorObj);
      throw errorObj;
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setError(null);

    try {
      // ✅ 1. CHECK IF ALREADY MINTED
      console.log("[MiniApp] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        throw new Error(
          "This FID has already minted an NFT. Each FID can only mint once."
        );
      }

      // ✅ 2. CHECK WALLET CONNECTION
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

      // ✅ 3. UPLOAD TO IPFS
      setUploadingToIPFS(true);
      console.log("[MiniApp] Step 2: Uploading to IPFS...");

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

      // ✅ 4. PREPARE TRANSACTION
      console.log("[MiniApp] Step 3: Preparing transaction...");
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

      // ✅ 5. SEND TRANSACTION
      console.log("[MiniApp] Step 4: Sending transaction...");

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
        value: parseEther("0.001"),
      });

      console.log("[MiniApp] ✅ Transaction sent:", txHash);
      setHash(txHash);
      setIsPending(false);

      // ✅ 6. WAIT FOR CONFIRMATION
      console.log("[MiniApp] Step 5: Waiting for confirmation...");
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

      let errorMessage = err.message || "Failed to mint NFT";

      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected")
      ) {
        errorMessage = "Transaction cancelled by user";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH balance for gas fees";
      }

      const errorObj = new Error(errorMessage);
      setError(errorObj);
      throw errorObj;
    }
  };

  return {
    mintFree,
    mintHD,
    checkIfAlreadyMinted,
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
