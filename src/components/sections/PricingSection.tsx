"use client";

import { useFarcaster } from "@/contexts/FarcasterContext";
import PricingMiniApp from "./PricingMiniApp";
import PricingWebsite from "./PricingWebsite";

export default function PricingSection() {
  const { isMiniApp } = useFarcaster();

  return isMiniApp ? <PricingMiniApp /> : <PricingWebsite />;
}
