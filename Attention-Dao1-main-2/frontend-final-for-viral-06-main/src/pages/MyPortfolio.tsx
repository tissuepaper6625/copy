import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Trophy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const MyPortfolio = () => {
  // Mock user portfolio data
  const portfolioItems = [
    {
      id: 1,
      title: "Instagram Growth Campaign for Local Coffee Shop",
      type: "Social Media Campaign",
      views: 2547,
      likes: 156,
      leaderboardPosition: 8,
      datePosted: "2024-01-15",
      description: "Complete social media strategy that increased followers by 300%",
      link: "#"
    },
    {
      id: 2,
      title: "Email Marketing Funnel for SaaS Startup",
      type: "Email Marketing",
      views: 1823,
      likes: 98,
      leaderboardPosition: 15,
      datePosted: "2024-01-10",
      description: "5-part email sequence that improved conversion rates by 45%",
      link: "#"
    },
    {
      id: 3,
      title: "TikTok Content Strategy for Fashion Brand",
      type: "Content Strategy",
      views: 987,
      likes: 67,
      leaderboardPosition: 23,
      datePosted: "2024-01-05",
      description: "Viral content framework generating 2M+ views across campaigns",
      link: "#"
    }
  ];

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-yellow-500";
    if (position <= 10) return "text-green-500";
    return "text-blue-500";
  };

  const getTotalStats = () => {
    return portfolioItems.reduce(
      (acc, item) => ({
        totalViews: acc.totalViews + item.views,
        totalLikes: acc.totalLikes + item.likes,
        bestPosition: Math.min(acc.bestPosition, item.leaderboardPosition)
      }),
      { totalViews: 0, totalLikes: 0, bestPosition: Infinity }
    );
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              My Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your marketing work, engagement, and leaderboard performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-viral-purple mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalViews.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Views</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalLikes.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Trophy className={`w-8 h-8 mx-auto mb-2 ${getPositionColor(stats.bestPosition)}`} />
                <div className="text-2xl font-bold glow-text">#{stats.bestPosition}</div>
                <div className="text-muted-foreground">Best Position</div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Items */}
          <div className="space-y-6">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {item.type}
                      </Badge>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPositionColor(item.leaderboardPosition)}`}>
                        #{item.leaderboardPosition}
                      </div>
                      <div className="text-sm text-muted-foreground">Leaderboard</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Posted: {new Date(item.datePosted).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Add More Work?</h3>
            <p className="text-muted-foreground mb-6">
              Keep building your portfolio and climb the leaderboard!
            </p>
            <Button variant="viral" size="lg" asChild>
              <Link to="/create-post">Create New Post</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPortfolio;