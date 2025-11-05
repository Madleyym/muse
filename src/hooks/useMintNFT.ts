"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import { useMintNFTWebsite } from "./useMintNFT.website";
import { useMintNFTMiniApp } from "./useMintNFT.miniapp";

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

  // ✅ WEBSITE: Pakai website hook (dengan RainbowKit)
  const websiteHook = useMintNFTWebsite();

  // ✅ MINIAPP: Pakai miniapp hook (tanpa RainbowKit)
  const miniappHook = useMintNFTMiniApp();

  // ✅ Return appropriate hook
  if (!ready) {
    return defaultReturn;
  }

  if (isMiniApp) {
    return miniappHook;
  }

  return websiteHook;
}
