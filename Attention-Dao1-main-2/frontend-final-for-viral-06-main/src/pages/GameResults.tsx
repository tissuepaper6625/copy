import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Clock, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const GameResults = () => {
  // Mock user game results data
  const gameResults = [
    {
      id: 1,
      gameTitle: "Marketing Strategy Quiz Championship",
      createdBy: "GameMaster_Pro",
      participationDate: "2024-01-22",
      ranking: 2,
      totalParticipants: 45,
      tokenReward: 150,
      gameType: "Trivia",
      score: "85/100",
      completionTime: "12:45"
    },
    {
      id: 2,
      gameTitle: "Creative Design Speed Challenge",
      createdBy: "DesignGuru_2024",
      participationDate: "2024-01-15",
      ranking: 1,
      totalParticipants: 32,
      tokenReward: 225,
      gameType: "Creative",
      score: "Perfect Score",
      completionTime: "28:30"
    },
    {
      id: 3,
      gameTitle: "Social Media Puzzle Hunt",
      createdBy: "PuzzleCreator",
      participationDate: "2024-01-08",
      ranking: 7,
      totalParticipants: 67,
      tokenReward: 45,
      gameType: "Puzzle",
      score: "78/100",
      completionTime: "45:20"
    },
    {
      id: 4,
      gameTitle: "Algorithm Optimization Race",
      createdBy: "CodeWarrior",
      participationDate: "2024-01-01",
      ranking: 12,
      totalParticipants: 89,
      tokenReward: 0,
      gameType: "Programming",
      score: "65/100",
      completionTime: "1:15:30"
    }
  ];

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (ranking === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (ranking === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{ranking}</span>;
  };

  const getRankingColor = (ranking: number) => {
    if (ranking <= 3) return "text-yellow-500";
    if (ranking <= 10) return "text-green-500";
    return "text-blue-500";
  };

  const getBadgeVariant = (ranking: number) => {
    if (ranking <= 3) return "default";
    if (ranking <= 10) return "secondary";
    return "outline";
  };

  const getTotalStats = () => {
    return gameResults.reduce(
      (acc, result) => ({
        totalGames: acc.totalGames + 1,
        totalTokens: acc.totalTokens + result.tokenReward,
        bestRanking: Math.min(acc.bestRanking, result.ranking),
        topThreeFinishes: acc.topThreeFinishes + (result.ranking <= 3 ? 1 : 0)
      }),
      { totalGames: 0, totalTokens: 0, bestRanking: Infinity, topThreeFinishes: 0 }
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
              My Game Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your performance across all prize pool games and competitions
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-viral-purple mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalGames}</div>
                <div className="text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.totalTokens}</div>
                <div className="text-muted-foreground">Tokens Earned</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Medal className={`w-8 h-8 mx-auto mb-2 ${getRankingColor(stats.bestRanking)}`} />
                <div className="text-2xl font-bold glow-text">#{stats.bestRanking}</div>
                <div className="text-muted-foreground">Best Ranking</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold glow-text">{stats.topThreeFinishes}</div>
                <div className="text-muted-foreground">Top 3 Finishes</div>
              </CardContent>
            </Card>
          </div>

          {/* Game Results List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Recent Game Participation</h2>
            {gameResults.map((result) => (
              <Card key={result.id} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{result.gameTitle}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{result.gameType}</Badge>
                        <Badge variant={getBadgeVariant(result.ranking)}>
                          Rank #{result.ranking} of {result.totalParticipants}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created by: {result.createdBy} • Played on: {new Date(result.participationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center justify-end space-x-2 mb-2">
                        {getRankingIcon(result.ranking)}
                        <span className={`text-lg font-bold ${getRankingColor(result.ranking)}`}>
                          #{result.ranking}
                        </span>
                      </div>
                      {result.tokenReward > 0 && (
                        <div className="text-sm text-green-600 font-semibold">
                          +{result.tokenReward} tokens
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Score: <strong>{result.score}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Time: <strong>{result.completionTime}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Reward: <strong className={result.tokenReward > 0 ? "text-green-600" : "text-muted-foreground"}>
                          {result.tokenReward > 0 ? `${result.tokenReward} tokens` : "No reward"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Insights */}
          <Card className="glass-card mt-12">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Strong Categories</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Creative Challenges</span>
                      <span className="text-sm font-semibold text-green-600">Avg. Rank #2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trivia Games</span>
                      <span className="text-sm font-semibold text-green-600">Avg. Rank #4</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Programming Challenges</span>
                      <span className="text-sm font-semibold text-orange-600">Avg. Rank #12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Speed Challenges</span>
                      <span className="text-sm font-semibold text-orange-600">Avg. Rank #8</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Ready for Your Next Challenge?</h3>
            <p className="text-muted-foreground mb-6">
              Keep improving your skills and climb the leaderboards!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prize-pool-games">
                <Button variant="viral" size="lg">
                  Browse Active Games
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

export default GameResults;