import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Medal, Trophy, ExternalLink, Eye, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  // Sample data for viral posts (1,000 views = 10 tokens, $1 = 1 token)
  const viralPosts = [
    {
      rank: 1,
      creator: "Sarah Chen",
      postTitle: "How I Got 1M TikTok Views in 30 Days",
      views: 127500,
      tokens: 1275,
      earnings: "$1,275",
      twitterUrl: "https://twitter.com/example1"
    },
    {
      rank: 2,
      creator: "Marcus Rodriguez",
      postTitle: "Instagram Reels Strategy That Actually Works",
      views: 98200,
      tokens: 982,
      earnings: "$982",
      twitterUrl: "https://twitter.com/example2"
    },
    {
      rank: 3,
      creator: "Emma Thompson",
      postTitle: "Brand Partnerships: My $50K Journey",
      views: 87400,
      tokens: 874,
      earnings: "$874",
      twitterUrl: "https://twitter.com/example3"
    },
    {
      rank: 4,
      creator: "Alex Kim",
      postTitle: "YouTube Shorts Growth Hack",
      views: 76300,
      tokens: 763,
      earnings: "$763",
      twitterUrl: "https://twitter.com/example4"
    },
    {
      rank: 5,
      creator: "Zoe Martinez",
      postTitle: "LinkedIn Content That Converts",
      views: 65100,
      tokens: 651,
      earnings: "$651",
      twitterUrl: "https://twitter.com/example5"
    },
    {
      rank: 6,
      creator: "David Park",
      postTitle: "Twitter Engagement Secrets",
      views: 54800,
      tokens: 548,
      earnings: "$548",
      twitterUrl: "https://twitter.com/example6"
    },
    {
      rank: 7,
      creator: "Luna Williams",
      postTitle: "Pinterest Marketing Case Study",
      views: 43900,
      tokens: 439,
      earnings: "$439",
      twitterUrl: "https://twitter.com/example7"
    },
    {
      rank: 8,
      creator: "Ryan Johnson",
      postTitle: "Viral Video Formula Revealed",
      views: 38600,
      tokens: 386,
      earnings: "$386",
      twitterUrl: "https://twitter.com/example8"
    },
    {
      rank: 9,
      creator: "Maya Patel",
      postTitle: "Influencer Marketing ROI Analysis",
      views: 32400,
      tokens: 324,
      earnings: "$324",
      twitterUrl: "https://twitter.com/example9"
    },
    {
      rank: 10,
      creator: "Jake Wilson",
      postTitle: "Social Media Automation Tools",
      views: 28700,
      tokens: 287,
      earnings: "$287",
      twitterUrl: "https://twitter.com/example10"
    }
  ];

  // Sample data for game creators (100 players = 5 tokens)
  const gameCreators = [
    {
      rank: 1,
      creator: "Sophie Anderson",
      gameName: "Viral Marketing Challenge",
      players: 2340,
      tokens: 117,
      earnings: "$117",
      gameUrl: "https://viral.app/game/marketing-challenge"
    },
    {
      rank: 2,
      creator: "Carlos Rivera",
      gameName: "Brand Strategy Battle",
      players: 1890,
      tokens: 94,
      earnings: "$94",
      gameUrl: "https://viral.app/game/brand-battle"
    },
    {
      rank: 3,
      creator: "Lily Chang",
      gameName: "Content Creator Quest",
      players: 1650,
      tokens: 82,
      earnings: "$82",
      gameUrl: "https://viral.app/game/creator-quest"
    },
    {
      rank: 4,
      creator: "Noah Brooks",
      gameName: "Social Media Mastery",
      players: 1420,
      tokens: 71,
      earnings: "$71",
      gameUrl: "https://viral.app/game/social-mastery"
    },
    {
      rank: 5,
      creator: "Aria Singh",
      gameName: "Influencer Empire",
      players: 1280,
      tokens: 64,
      earnings: "$64",
      gameUrl: "https://viral.app/game/influencer-empire"
    },
    {
      rank: 6,
      creator: "Tyler Green",
      gameName: "Marketing Mix Master",
      players: 1100,
      tokens: 55,
      earnings: "$55",
      gameUrl: "https://viral.app/game/marketing-mix"
    },
    {
      rank: 7,
      creator: "Mia Rodriguez",
      gameName: "Campaign Craft",
      players: 950,
      tokens: 47,
      earnings: "$47",
      gameUrl: "https://viral.app/game/campaign-craft"
    },
    {
      rank: 8,
      creator: "Ethan Lee",
      gameName: "Analytics Arena",
      players: 830,
      tokens: 41,
      earnings: "$41",
      gameUrl: "https://viral.app/game/analytics-arena"
    },
    {
      rank: 9,
      creator: "Chloe Davis",
      gameName: "Trend Tracker",
      players: 720,
      tokens: 36,
      earnings: "$36",
      gameUrl: "https://viral.app/game/trend-tracker"
    },
    {
      rank: 10,
      creator: "Lucas White",
      gameName: "ROI Racing",
      players: 640,
      tokens: 32,
      earnings: "$32",
      gameUrl: "https://viral.app/game/roi-racing"
    }
  ];

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-viral-purple" />
              <h1 className="text-4xl md:text-5xl font-bold glow-text">
                Leaderboard
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See who's leading the viral marketing revolution and earning the most tokens
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Viral Posts Leaderboard */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Eye className="w-6 h-6 text-viral-purple" />
                  Top Viral Posts
                </CardTitle>
                <p className="text-muted-foreground">
                  Portfolio-building posts ranked by views • 1,000 views = 10 tokens
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Creator & Post</TableHead>
                      <TableHead className="text-center">Views</TableHead>
                      <TableHead className="text-center">Earnings</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viralPosts.map((post) => (
                      <TableRow key={post.rank} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {getMedalIcon(post.rank)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{post.creator}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {post.postTitle}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{post.views.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {post.tokens} tokens
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-viral-purple">{post.earnings}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={post.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Game Creators Leaderboard */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6 text-viral-purple" />
                  Game Creators
                </CardTitle>
                <p className="text-muted-foreground">
                  Top game creators ranked by player count • 100 players = 5 tokens
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Creator & Game</TableHead>
                      <TableHead className="text-center">Players</TableHead>
                      <TableHead className="text-center">Earnings</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameCreators.map((creator) => (
                      <TableRow key={creator.rank} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {getMedalIcon(creator.rank)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{creator.creator}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {creator.gameName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{creator.players.toLocaleString()}</span>
                            <Badge variant="secondary" className="text-xs">
                              {creator.tokens} tokens
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-viral-purple">{creator.earnings}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={creator.gameUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Ready to climb the leaderboard?</h3>
                <p className="text-muted-foreground mb-6">
                  Create viral content, build games, and start earning tokens today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="viral" size="lg" asChild>
                    <Link to="/create-post">Create Your First Post</Link>
                  </Button>
                  <Button variant="viral-outline" size="lg" asChild>
                    <Link to="/post-game">Post a Game</Link>
                  </Button>
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

export default Leaderboard;