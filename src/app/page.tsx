import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
