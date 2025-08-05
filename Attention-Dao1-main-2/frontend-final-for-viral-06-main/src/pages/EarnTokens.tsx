import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trophy, Users, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const EarnTokens = () => {
  const earningMethods = [
    {
      icon: Eye,
      title: "Views on Posts",
      description: "Earn tokens based on the number of views your portfolio posts receive.",
      calculation: "1 token per 100 views",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "First Portfolio Post",
      description: "Get a welcome bonus when you create and publish your very first portfolio post.",
      calculation: "50 tokens (one-time bonus)",
      color: "text-green-500"
    },
    {
      icon: Trophy,
      title: "Winning Games",
      description: "Place in the top positions of prize pool games to earn substantial token rewards.",
      calculation: "Based on prize pool distribution",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Game Participation",
      description: "Earn tokens when other users participate in games you've created.",
      calculation: "5 tokens per participant",
      color: "text-purple-500"
    },
    {
      icon: Gift,
      title: "Random Promotions",
      description: "Participate in special events, challenges, and seasonal promotions for bonus tokens.",
      calculation: "Varies by promotion",
      color: "text-red-500"
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
              How to Earn Tokens
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover all the ways to earn tokens and build your digital wealth on the platform
            </p>
          </div>

          {/* Earning Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {earningMethods.map((method, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <method.icon className={`w-8 h-8 ${method.color}`} />
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <p className="text-sm font-semibold">{method.calculation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How Metrics Are Calculated */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">How We Calculate Your Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">View-Based Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Views are tracked in real-time. Tokens are credited to your account every 24 hours based on verified, unique views from registered users.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Game Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Prize pools are distributed automatically based on final rankings. Creator rewards are calculated based on total participation and engagement.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Promotion Events</h4>
                  <p className="text-sm text-muted-foreground">
                    Special promotions are announced via notifications. Rewards vary based on participation level and achievement of specific goals.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality Standards</h4>
                  <p className="text-sm text-muted-foreground">
                    All content must meet community guidelines. Spam or low-quality content may result in reduced token earnings or account restrictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-muted-foreground mb-6">
              Create your first post, join some games, and watch your token balance grow!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-post">
                <Button variant="viral" size="lg">
                  Create First Post
                </Button>
              </Link>
              <Link to="/prize-pool-games">
                <Button variant="outline" size="lg">
                  Browse Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EarnTokens;