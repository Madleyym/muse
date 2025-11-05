"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";

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

  if (isMiniApp || !ready) {
    return defaultReturn;
  }

  // ✅ Dynamically import internal hook
  // This will ONLY be called on website
  const { useMintNFTWebsite } = require("./useMintNFT.website");
  return useMintNFTWebsite();
}
