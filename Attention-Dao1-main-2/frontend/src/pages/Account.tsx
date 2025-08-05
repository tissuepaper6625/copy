import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Email:</strong>{" "}
                {user?.email && "address" in user.email
                  ? user.email.address
                  : "Not linked"}
              </p>
              <p>
                <strong>Wallet:</strong>{" "}
                {user?.wallet?.address || "No wallet found"}
              </p>
              <p>
                <strong>Twitter:</strong>{" "}
                {user?.twitter?.username
                  ? `@${user.twitter.username}`
                  : "Not connected"}
              </p>

              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
