"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useAccount,
  useReadContract,
  usePublicClient,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { MUSE_NFT_CONTRACT } from "@/config/contracts";

export interface MintParams {
  fid: number;
  moodId: string;
  moodName: string;
  farcasterUsername: string;
  engagementScore: number;
}

const DEV_ADDRESSES = ["0x9b5f284fd3f9e9d35311d4061200873e817472dc"];

export function useMintNFTWebsite() {
  const [mintType, setMintType] = useState<"free" | "hd" | null>(null);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);

  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const publicClient = usePublicClient();

  const { data: isDevAddressFromContract, isLoading: isCheckingDev } =
    useReadContract({
      address: MUSE_NFT_CONTRACT.address,
      abi: MUSE_NFT_CONTRACT.abi,
      functionName: "checkIsDevAddress",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    });

  const isDevAddress =
    DEV_ADDRESSES.includes(address?.toLowerCase() || "") ||
    !!isDevAddressFromContract;

  useEffect(() => {
    if (address) {
      console.log("[useMintNFT] Dev check:", {
        address,
        isDevAddress,
        balance: balance ? formatEther(balance.value) : "0",
      });
    }
  }, [address, isDevAddress, balance]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // ✅ ADD: Check if FID already minted
  const checkIfAlreadyMinted = async (fid: number): Promise<boolean> => {
    try {
      console.log("[Website] Checking if FID", fid, "already minted...");

      if (!publicClient) {
        console.warn("[Website] Public client not available");
        return false;
      }

      const hasMinted = await publicClient.readContract({
        address: MUSE_NFT_CONTRACT.address,
        abi: MUSE_NFT_CONTRACT.abi,
        functionName: "hasFIDMinted",
        args: [BigInt(fid)],
      });

      console.log("[Website] FID", fid, "minted status:", hasMinted);
      return hasMinted as boolean;
    } catch (error: any) {
      console.error("[Website] Check minted error:", error);
      return false;
    }
  };

  const mintFree = async (params: MintParams) => {
    setMintType("free");
    setUploadingToIPFS(true);

    try {
      // ✅ 1. CHECK IF ALREADY MINTED
      console.log("[Website] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        setUploadingToIPFS(false);
        throw new Error(
          "This FID has already minted an NFT. Each FID can only mint once."
        );
      }

      // ✅ 2. UPLOAD TO IPFS
      console.log("[Website] Step 2: Uploading to IPFS...");
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
      console.log("[Website] ✅ IPFS complete:", metadataURI);
      setUploadingToIPFS(false);

      // ✅ 3. MINT
      console.log("[Website] Step 3: Minting...");
      writeContract({
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
        chainId: 8453,
      });
    } catch (error: any) {
      setUploadingToIPFS(false);
      throw error;
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setUploadingToIPFS(true);

    try {
      // ✅ 1. CHECK IF ALREADY MINTED
      console.log("[Website] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        setUploadingToIPFS(false);
        throw new Error(
          "This FID has already minted an NFT. Each FID can only mint once."
        );
      }

      // ✅ 2. UPLOAD TO IPFS
      console.log("[Website] Step 2: Uploading to IPFS...");
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
      console.log("[Website] ✅ IPFS complete:", metadataURI);
      setUploadingToIPFS(false);

      // ✅ 3. MINT
      console.log("[Website] Step 3: Minting...");
      const mintValue = isDevAddress ? parseEther("0") : parseEther("0.001");

      writeContract({
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
        value: mintValue,
        chainId: 8453,
      });
    } catch (error: any) {
      setUploadingToIPFS(false);
      throw error;
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
    isDevAddress,
    isCheckingDev,
    error,
    hash,
  };
}
