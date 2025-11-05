"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { useMintNFTWebsite } from "./useMintNFT.website";
import { useMintNFTMiniApp } from "./useMintNFT.miniapp";

const defaultReturn = {
  mintFree: async () => {
    console.warn("Minting not available");
  },
  mintHD: async () => {
    console.warn("Minting not available");
  },
  checkIfAlreadyMinted: async () => {
    console.warn("Check minted not available");
    return false;
  },
  mintType: null as "free" | "hd" | null,
  isPending: false,
  isConfirming: false,
  isSuccess: false,
  uploadingToIPFS: false,
  isDevAddress: false,
  isCheckingDev: false,
  error: null as Error | null, // ✅ FIXED: Proper type
  hash: undefined as `0x${string}` | undefined, // ✅ FIXED: Proper type
};

export function useMintNFT() {
  const { isMiniApp, ready } = useFarcaster();

  const websiteHook = useMintNFTWebsite();
  const miniappHook = useMintNFTMiniApp();

  if (!ready) {
    return defaultReturn;
  }

  if (isMiniApp) {
    return miniappHook;
  }

  return websiteHook;
}
