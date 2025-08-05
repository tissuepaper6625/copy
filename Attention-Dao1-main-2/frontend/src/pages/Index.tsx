import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PrizePoolGames from "@/components/PrizePoolGames";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    fetch(`${baseURL}/auth/user` ,{
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log("Connected to backend:", data))
      .catch((err) => console.error("Backend not working:", err));
    },[]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <PrizePoolGames />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
