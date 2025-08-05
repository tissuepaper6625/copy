import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Trophy, Clock, Coins, Star } from "lucide-react";
import { Link } from "react-router-dom";

const GameCreator = () => {
  // Mock creator dashboard data
  const createdGames = [
    {
      id: 1,
      title: "Ultimate Marketing Strategy Quiz",
      gameType: "Trivia",
      createdDate: "2024-01-20",
      participants: 78,
      status: "Completed",
      topPerformer: {
        username: "MarketingPro_2024",
        score: "95/100",
        completionTime: "8:45"
      },
      tokensEarned: 390, // 78 participants × 5 tokens
      prizePoolContribution: 200
    },
    {
      id: 2,
      title: "Creative Design Speed Challenge",
      gameType: "Creative",
      createdDate: "2024-01-13",
      participants: 56,
      status: "Completed",
      topPerformer: {
        username: "DesignWizard",
        score: "Perfect Submission",
        completionTime: "22:30"
      },
      tokensEarned: 280, // 56 participants × 5 tokens
      prizePoolContribution: 150
    },
    {
      id: 3,
      title: "Social Media Puzzle Hunt",
      gameType: "Puzzle",
      createdDate: "2024-01-06",
      participants: 124,
      status: "Completed",
      topPerformer: {
        username: "PuzzleMaster_X",
        score: "All Clues Found",
        completionTime: "35:15"
      },
      tokensEarned: 620, // 124 participants × 5 tokens
      prizePoolContribution: 300
    },
    {
      id: 4,
      title: "Brand Strategy Workshop",
      gameType: "Strategy",
      createdDate: "2024-01-27",
      participants: 0,
      status: "Upcoming",
      topPerformer: null,
      tokensEarned: 0,
      prizePoolContribution: 175
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600";
      case "Upcoming": return "text-blue-600";
      case "Active": return "text-yellow-600";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Upcoming": return "secondary";
      case "Active": return "destructive";
      default: return "outline";
    }
  };

  const getTotalStats = () => {
    const completedGames = createdGames.filter(game => game.status === "Completed");
    return {
      totalGames: createdGames.length,
      completedGames: completedGames.length,
      totalParticipants: completedGames.reduce((sum, game) => sum + game.participants, 0),
      totalTokensEarned: completedGames.reduce((sum, game) => sum + game.tokensEarned, 0),
      avgParticipants: completedGames.length > 0 
        ? Math.round(completedGames.reduce((sum, game) => sum + game.participants, 0) / completedGames.length)
        : 0
    };
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
              Game Creator Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your created games and track their performance
            </p>
          </div>

          {/* Creator Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Gamepad2 className="w-8 h-8 text-viral-purple mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalGames}</div>
                <div className="text-muted-foreground">Games Created</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalParticipants}</div>
                <div className="text-muted-foreground">Total Participants</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalTokensEarned}</div>
                <div className="text-muted-foreground">Tokens Earned</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.avgParticipants}</div>
                <div className="text-muted-foreground">Avg. Participants</div>
              </CardContent>
            </Card>
          </div>

          {/* Created Games List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Created Games</h2>
              <Link to="/prize-pool-games">
                <Button variant="viral">
                  Create New Game
                </Button>
              </Link>
            </div>
            
            {createdGames.map((game) => (
              <Card key={game.id} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{game.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{game.gameType}</Badge>
                        <Badge variant={getStatusBadge(game.status)}>
                          {game.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(game.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-viral-purple">
                        {game.participants} participants
                      </div>
                      {game.tokensEarned > 0 && (
                        <div className="text-sm text-green-600">
                          +{game.tokensEarned} tokens earned
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {game.topPerformer ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                          Top Performer
                        </h4>
                        <div className="p-3 bg-accent/20 rounded-lg">
                          <p className="font-semibold">{game.topPerformer.username}</p>
                          <p className="text-sm text-muted-foreground">Score: {game.topPerformer.score}</p>
                          <p className="text-sm text-muted-foreground">Time: {game.topPerformer.completionTime}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Game Statistics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Participants:</span>
                            <span className="font-semibold">{game.participants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prize Pool Contribution:</span>
                            <span className="font-semibold">{game.prizePoolContribution} tokens</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Creator Earnings:</span>
                            <span className="font-semibold text-green-600">
                              {game.tokensEarned} tokens
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {game.status === "Upcoming" ? "Game hasn't started yet" : "No participants yet"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Prize pool: {game.prizePoolContribution} tokens
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Creator Insights */}
          <Card className="glass-card mt-12">
            <CardHeader>
              <CardTitle>Creator Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Most Popular Game Type</h4>
                  <p className="text-lg font-bold text-viral-purple">Puzzle Games</p>
                  <p className="text-sm text-muted-foreground">124 avg. participants</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Engagement Day</h4>
                  <p className="text-lg font-bold text-viral-purple">Monday</p>
                  <p className="text-sm text-muted-foreground">Peak participation hours</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Creator Rating</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-muted-foreground ml-2">4.2/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Create Another Amazing Game?</h3>
            <p className="text-muted-foreground mb-6">
              Keep the community engaged with your creative challenges!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prize-pool-games">
                <Button variant="viral" size="lg">
                  Create New Game
                </Button>
              </Link>
              <Link to="/game-rules">
                <Button variant="outline" size="lg">
                  View Game Guidelines
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

export default GameCreator;