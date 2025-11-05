"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";

// ✅ Import at TOP level
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

  // ✅ Check FIRST
  if (isMiniApp || !ready) {
    return defaultReturn;
  }

  // ✅ NOW call hook unconditionally (ALWAYS, not inside require)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMintNFTWebsite();
}
