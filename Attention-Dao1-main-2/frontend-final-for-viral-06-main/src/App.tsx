import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { checkAuth, registerUser } from "./lib/api";


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Leaderboard from "./pages/Leaderboard";
import Voting from "./pages/Voting";
import Campaign from "./pages/Campaign";
import PrizePoolGames from "./pages/PrizePoolGames";
import Community from "./pages/Community";
import Network from "./pages/Network";
import MyPortfolio from "./pages/MyPortfolio";
import CreatePost from "./pages/CreatePost";
import UseTokens from "./pages/UseTokens";
import EarnTokens from "./pages/EarnTokens";
import ViralShop from "./pages/ViralShop";
import GameRules from "./pages/GameRules";
import PostGame from "./pages/PostGame";
import GameResults from "./pages/GameResults";
import GameCreator from "./pages/GameCreator";
import Messages from "./pages/Messages";
import Inbox from "./pages/Inbox";
import Searchr from "./pages/Searchr";
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PartnerWithUs from "./pages/PartnerWithUs";
import HireFromViral from "./pages/HireFromViral";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { ready, authenticated, user } = usePrivy();
  const [backendUser, setBackendUser] = useState(null);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    checkAuth()
      .then(async (res) => {
        console.log("Connected to backend:", res);

        if (!res.isAuthenticated && user?.id && user?.twitter?.username) {
          // Register the user if not authenticated
          await registerUser(user.id, user.twitter.username);
          console.log("User registered");

          // Re-check auth after registration
          const afterRegister = await checkAuth();
          setBackendUser(afterRegister.user);
          console.log("After registration:", afterRegister);
        } else {
          setBackendUser(res.user);
        }
      })
      .catch((err) => {
        console.error("Backend auth check failed", err);
      });
  }, [ready, authenticated, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/prize-pool-games" element={<PrizePoolGames />} />
            <Route path="/community" element={<Community />} />
            <Route path="/network" element={<Network />} />
            <Route path="/my-portfolio" element={<MyPortfolio />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/use-tokens" element={<UseTokens />} />
            <Route path="/earn-tokens" element={<EarnTokens />} />
            <Route path="/viralshop" element={<ViralShop />} />
            <Route path="/game-rules" element={<GameRules />} />
            <Route path="/post-game" element={<PostGame />} />
            <Route path="/game-results" element={<GameResults />} />
            <Route path="/game-creator" element={<GameCreator />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/searchr" element={<Searchr />} />
            <Route path="/account" element={<Account />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/partner-with-us" element={<PartnerWithUs />} />
            <Route path="/hire-from-viral" element={<HireFromViral />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* TEMP: Backend Auth Status (can remove later) */}
        <div className="fixed bottom-2 left-2 text-xs bg-gray-100 px-2 py-1 rounded shadow">
          {backendUser
            ? `Logged in as ${backendUser.username}`
            : "Checking backend auth..."}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
