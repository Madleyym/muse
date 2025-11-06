import { Web3Provider } from "@/components/providers/Web3Provider";
import { NavigationProgress } from "@/components/providers/NavigationProgress";
import TopBanner from "@/components/layout/TopBanner";
import Header from "@/components/layout/Header";
import FooterWebsite from "@/components/layout/FooterWebsite"; // ✅ CHANGED
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";

export default function HomePage() {
  return (
    <Web3Provider>
      <NavigationProgress>
        <TopBanner />
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
          <Header />
          <HeroSection />
          <HowItWorksSection />
          <PricingSection />
          <FooterWebsite /> {/* ✅ CHANGED */}
        </main>
      </NavigationProgress>
    </Web3Provider>
  );
}
