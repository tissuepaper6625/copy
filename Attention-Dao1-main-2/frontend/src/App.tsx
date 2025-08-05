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
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
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
            <Route path="/account" element={<Account />} />
            <Route path="/sign-in" element={<SignIn />} />
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
