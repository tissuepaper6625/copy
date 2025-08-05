import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Vote, Gamepad2, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const UseTokens = () => {
  const tokenUses = [
    {
      icon: Vote,
      title: "Voting",
      description: "Use your tokens to vote on community decisions and influence the platform's direction.",
      action: "Go to Voting",
      link: "/voting"
    },
    {
      icon: Gamepad2,
      title: "Prize Pool Games",
      description: "Enter exciting competitions and tournaments to win big token prizes.",
      action: "Join Games",
      link: "/prize-pool-games"
    },
    {
      icon: Heart,
      title: "Donations",
      description: "Support your favorite creators and community members with token donations.",
      action: "Make Donation",
      link: "/create-post"
    },
    {
      icon: ShoppingBag,
      title: "ViralShop Merch",
      description: "Purchase exclusive merchandise and designs from the ViralShop using your tokens.",
      action: "Shop Now",
      link: "/viralshop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              How to Use Your Tokens
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover all the ways you can spend and use your earned tokens across the platform
            </p>
          </div>

          {/* Token Uses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {tokenUses.map((use, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 viral-gradient rounded-lg flex items-center justify-center">
                      <use.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{use.title}</CardTitle>
                  </div>
                </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground mb-4">{use.description}</p>
                   <Link to={use.link}>
                     <Button variant="outline" className="w-full">
                       {use.action}
                     </Button>
                   </Link>
                 </CardContent>
              </Card>
            ))}
          </div>

          {/* ViralShop Special Section */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <Coins className="w-16 h-16 text-viral-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">ViralShop Special Offers</h3>
                <p className="text-muted-foreground mb-6">
                  Get exclusive access to limited merchandise and enjoy special discounts throughout the year.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">30% Off First Purchase</h4>
                    <p className="text-sm text-muted-foreground">New users get an automatic discount on their first ViralShop order.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Random Discount Drops</h4>
                    <p className="text-sm text-muted-foreground">Stay alert for surprise flash sales and limited-time offers.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Using Your Tokens?</h3>
            <p className="text-muted-foreground mb-6">
              Check your current balance and start exploring all the amazing ways to use your tokens.
            </p>
            <Link to="/account">
              <Button variant="viral" size="lg">
                View My Balance
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UseTokens;