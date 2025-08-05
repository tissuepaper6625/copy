import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import WhatIsViral from "@/components/WhatIsViral";
import FeaturedPosts from "@/components/FeaturedPosts";
import PrizePoolGames from "@/components/PrizePoolGames";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <StatsSection />
        <WhatIsViral />
        <FeaturedPosts />
        <PrizePoolGames />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;