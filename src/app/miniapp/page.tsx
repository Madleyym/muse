import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";

export default function MiniAppPage() {
  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
      <Header />
      <HeroSection />
      <PricingSection />
    </main>
  );
}

export const metadata = {
  title: "Muse - Mint Your Mood NFT",
  description: "Turn your vibe into collectible art on Base",
};
