"use client";

import { useState, useEffect, useRef } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
} from "viem";
import { base } from "viem/chains";
import { MUSE_NFT_CONTRACT, BASE_RPC_ENDPOINTS } from "@/config/contracts";
import { useFrameWallet } from "./useFrameWallet";

export interface MintParams {
  fid: number;
  moodId: string;
  moodName: string;
  farcasterUsername: string;
  engagementScore: number;
}

// ❌ REMOVED: DEV_ADDRESSES (not needed for MiniApp)

const parseErrorMessage = (error: any): string => {
  const errorString = error?.message || error?.toString() || "";
  console.log("[MiniApp] 🔍 Raw error:", errorString);

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

// ✅ RETRY LOGIC
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

export function useMintNFTMiniApp() {
  const [mintType, setMintType] = useState<"free" | "hd" | null>(null);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isDevAddress, setIsDevAddress] = useState(false);
  const [isCheckingDev, setIsCheckingDev] = useState(false);

  const { address, isConnected, provider } = useFrameWallet();

  const checkedFidsRef = useRef<Set<number>>(new Set());

  // ✅ CHECK DEV ADDRESS (only from contract, no hardcoded list)
  useEffect(() => {
    const checkDevAddress = async () => {
      if (!address) {
        setIsDevAddress(false);
        return;
      }

      setIsCheckingDev(true);

      try {
        console.log("[MiniApp] Checking dev address from contract:", address);

        // ✅ Check from contract only
        const isDevFromContract = await retryWithFallback(async (rpcUrl) => {
          const publicClient = createPublicClient({
            chain: base,
            transport: http(rpcUrl),
          });

          return await publicClient.readContract({
            address: MUSE_NFT_CONTRACT.address,
            abi: MUSE_NFT_CONTRACT.abi,
            functionName: "checkIsDevAddress",
            args: [address],
          });
        });

        setIsDevAddress(!!isDevFromContract);
        console.log("[MiniApp] Dev address check result:", {
          address,
          isDevAddress: !!isDevFromContract,
        });
      } catch (error: any) {
        console.error("[MiniApp] Dev check error:", error);
        setIsDevAddress(false);
      } finally {
        setIsCheckingDev(false);
      }
    };

    checkDevAddress();
  }, [address]);

  const checkIfAlreadyMinted = async (fid: number): Promise<boolean> => {
    try {
      console.log("[MiniApp] Checking if FID", fid, "already minted...");

      const hasMinted = await retryWithFallback(async (rpcUrl) => {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(rpcUrl),
        });

        return await publicClient.readContract({
          address: MUSE_NFT_CONTRACT.address,
          abi: MUSE_NFT_CONTRACT.abi,
          functionName: "hasFIDMinted",
          args: [BigInt(fid)],
        });
      });

      console.log("[MiniApp] FID", fid, "minted status:", hasMinted);
      checkedFidsRef.current.add(fid);
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
      console.log("[MiniApp] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        throw new Error(parseErrorMessage("FID already minted"));
      }

      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

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

      console.log("[MiniApp] Step 3: Preparing transaction...");
      setIsPending(true);

      const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_ENDPOINTS[0]),
      });

      console.log("[MiniApp] Step 4: Sending transaction...");

      let txHash: `0x${string}`;
      try {
        txHash = await walletClient.writeContract({
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
      } catch (txError: any) {
        console.error("[MiniApp] ❌ Transaction error:", txError);
        throw new Error(parseErrorMessage(txError));
      }

      console.log("[MiniApp] ✅ Transaction sent:", txHash);
      setHash(txHash);
      setIsPending(false);

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

      const errorMessage = parseErrorMessage(err);
      const errorObj = new Error(errorMessage);
      setError(errorObj);
      throw errorObj;
    }
  };

  const mintHD = async (params: MintParams) => {
    setMintType("hd");
    setError(null);

    try {
      console.log("[MiniApp] Step 1: Checking if FID already minted...");
      const alreadyMinted = await checkIfAlreadyMinted(params.fid);

      if (alreadyMinted) {
        throw new Error(parseErrorMessage("FID already minted"));
      }

      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Wallet provider not found");
      }

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

      console.log("[MiniApp] Step 3: Preparing transaction...");
      setIsPending(true);

      const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http(BASE_RPC_ENDPOINTS[0]),
      });

      console.log("[MiniApp] Step 4: Sending transaction...");

      // ✅ Check if dev address and adjust value
      const mintValue = isDevAddress ? parseEther("0") : parseEther("0.001");
      console.log(
        "[MiniApp] Mint value:",
        isDevAddress ? "0 ETH (DEV)" : "0.001 ETH"
      );

      let txHash: `0x${string}`;
      try {
        txHash = await walletClient.writeContract({
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
        });
      } catch (txError: any) {
        console.error("[MiniApp] ❌ Transaction error:", txError);
        throw new Error(parseErrorMessage(txError));
      }

      console.log("[MiniApp] ✅ Transaction sent:", txHash);
      setHash(txHash);
      setIsPending(false);

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

      const errorMessage = parseErrorMessage(err);
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
    isDevAddress,
    isCheckingDev,
    error,
    hash,
  };
}
