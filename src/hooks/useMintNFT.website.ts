"use client";

import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useAccount,
  useReadContract,
  usePublicClient,
} from "wagmi";
import { parseEther, formatEther, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { MUSE_NFT_CONTRACT, BASE_RPC_ENDPOINTS } from "@/config/contracts";

export interface MintParams {
  fid: number;
  moodId: string;
  moodName: string;
  farcasterUsername: string;
  engagementScore: number;
}

const DEV_ADDRESSES = ["0x9b5f284fd3f9e9d35311d4061200873e817472dc"];

// ✅ PARSE ERROR MESSAGE
const parseErrorMessage = (error: any): string => {
  const errorString = error?.message || error?.toString() || "";
  console.log("[Website] 🔍 Raw error:", errorString);

  if (
    errorString.includes("User rejected") ||
    errorString.includes("user rejected") ||
    errorString.includes("rejected the request") ||
    errorString.includes("User denied") ||
    errorString.includes("user denied")
  ) {
    return "Transaction cancelled by user";
  }

  if (
    errorString.includes("FID already minted") ||
    errorString.includes("already minted")
  ) {
    return "This FID already minted — only one mint allowed.";
  }

  if (
    errorString.includes("insufficient funds") ||
    errorString.includes("insufficient balance")
  ) {
    return "Insufficient ETH balance for gas fees";
  }

  if (
    errorString.includes("network") ||
    errorString.includes("timeout") ||
    errorString.includes("fetch")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  if (errorString.includes("execution reverted")) {
    return "Transaction failed. Please try again.";
  }

  if (errorString.length > 150) {
    return "Transaction failed. Please try again.";
  }

  return errorString || "An unknown error occurred";
};

// ✅ RETRY LOGIC FOR RPC CALLS
async function retryWithFallback<T>(
  fn: (rpcUrl: string) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < BASE_RPC_ENDPOINTS.length && i < maxRetries; i++) {
    try {
      console.log(
        `[Retry] Attempting RPC ${i + 1}/${maxRetries}:`,
        BASE_RPC_ENDPOINTS[i]
      );
      return await fn(BASE_RPC_ENDPOINTS[i]);
    } catch (error: any) {
      console.warn(`[Retry] RPC ${i + 1} failed:`, error.message);

      if (
        error.message?.includes("429") ||
        error.message?.includes("rate limit")
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }

      if (i === BASE_RPC_ENDPOINTS.length - 1 || i === maxRetries - 1) {
        throw error;
      }
    }
  }
  throw new Error("All RPC endpoints failed");
}

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

  // ✅ CHECK IF FID ALREADY MINTED (with retry + ref to prevent infinite loop)
  const checkedFidsRef = useRef<Set<number>>(new Set());

  const checkIfAlreadyMinted = async (fid: number): Promise<boolean> => {
    try {
      console.log("[Website] Checking if FID", fid, "already minted...");

      const hasMinted = await retryWithFallback(async (rpcUrl) => {
        const client = createPublicClient({
          chain: base,
          transport: http(rpcUrl),
        });

        return await client.readContract({
          address: MUSE_NFT_CONTRACT.address,
          abi: MUSE_NFT_CONTRACT.abi,
          functionName: "hasFIDMinted",
          args: [BigInt(fid)],
        });
      });

      console.log("[Website] FID", fid, "minted status:", hasMinted);
      checkedFidsRef.current.add(fid);
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
      console.log("[Website] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        setUploadingToIPFS(false);
        throw new Error(parseErrorMessage("FID already minted"));
      }

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
      const parsed = parseErrorMessage(error);
      throw new Error(parsed);
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setUploadingToIPFS(true);

    try {
      console.log("[Website] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        setUploadingToIPFS(false);
        throw new Error(parseErrorMessage("FID already minted"));
      }

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
      const parsed = parseErrorMessage(error);
      throw new Error(parsed);
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
