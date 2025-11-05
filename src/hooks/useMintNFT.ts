"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { useMintNFTWebsite } from "./useMintNFT.website";

const defaultReturn = {
  mintFree: async () => console.warn("Minting not available"),
  mintHD: async () => console.warn("Minting not available"),
  mintType: null,
  isPending: false,
  isConfirming: false,
  isSuccess: false,
  uploadingToIPFS: false,
  isDevAddress: false,
  isCheckingDev: false,
  error: null,
  hash: null,
};

export function useMintNFT() {
  const { isMiniApp, ready } = useFarcaster();

  // ✅ CALL HOOK FIRST - ALWAYS
  const websiteHook = useMintNFTWebsite();

  // ✅ THEN check condition
  if (isMiniApp || !ready) {
    return defaultReturn;
  }

  // ✅ Return hook result
  return websiteHook;
}
