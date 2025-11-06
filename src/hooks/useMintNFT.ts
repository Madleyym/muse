"use client";

/**
 * ⚠️ DEPRECATED: DO NOT USE THIS HOOK!
 * 
 * This hook causes "Transaction hooks must be used within RainbowKitProvider" error
 * because it unconditionally calls both wagmi hooks and frame wallet hooks.
 * 
 * USE INSTEAD:
 * - In PricingMiniApp: import { useMintNFTMiniApp } from "./useMintNFT.miniapp"
 * - In PricingWebsite: import { useMintNFTWebsite } from "./useMintNFT.website"
 */

export function useMintNFT() {
  throw new Error(
    "useMintNFT is deprecated! Import useMintNFTMiniApp or useMintNFTWebsite directly."
  );
}