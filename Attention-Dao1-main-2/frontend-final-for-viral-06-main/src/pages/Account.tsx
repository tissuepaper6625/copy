import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Wallet, Mail, Coins, Settings, LogOut, Briefcase } from "lucide-react";

const Account = () => {
  const { ready, authenticated, user, logout } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>Loading Privy...</p>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <p>Please log in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold glow-text mb-4">My Account</h1>
              <p className="text-muted-foreground text-lg">
                Manage your profile and account settings
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Profile Information */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-semibold">{userAccount.fullName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {userAccount.email}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet & Tokens */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet & Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Token Balance</label>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold glow-text">{userAccount.tokenBalance.toLocaleString()}</p>
                      <Badge variant="secondary" className="bg-viral-purple/20 text-viral-purple border-viral-purple/30">
                        VIRAL
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">≈ {userAccount.tokenValue} USD</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                    <p className="text-sm font-mono break-all text-muted-foreground">{userAccount.walletAddress}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Privy Wallet ID</label>
                    <p className="text-xs font-mono break-all text-muted-foreground">{userAccount.privyWalletId}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Actions */}
            <Card className="glass-card mt-8">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link to="/my-portfolio">
                    <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                      <Briefcase className="h-5 w-5" />
                      View My Portfolio
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                    <Settings className="h-5 w-5" />
                    Edit Account Info
                  </Button>
                  
                  <Link to="/sign-in">
                    <Button variant="destructive" className="w-full h-16 flex flex-col gap-2">
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;