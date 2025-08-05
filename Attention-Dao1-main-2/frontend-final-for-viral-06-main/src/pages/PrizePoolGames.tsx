import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Trophy, Clock, Copy, Calendar, MapPin, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const PrizePoolGames = () => {
  const { toast } = useToast();
  // Calculate individual countdowns for each game
  const [gameCountdowns, setGameCountdowns] = useState<Record<number, string>>({});

  useEffect(() => {
    const calculateCountdowns = () => {
      const now = new Date();
      const newCountdowns: Record<number, string> = {};

      games.forEach(game => {
        const gameStart = new Date(game.startDateTime);
        const difference = gameStart.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          
          // Cap days at 7 maximum
          const displayDays = Math.min(days, 7);
          
          if (displayDays > 0) {
            newCountdowns[game.id] = `Starts in: ${displayDays}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newCountdowns[game.id] = `Starts in: ${hours}h ${minutes}m`;
          } else if (minutes > 0) {
            newCountdowns[game.id] = `Starts in: ${minutes}m`;
          } else {
            newCountdowns[game.id] = "Starting now!";
          }
        } else {
          const gameEnd = new Date(game.endDateTime);
          const endDifference = gameEnd.getTime() - now.getTime();
          
          if (endDifference > 0) {
            newCountdowns[game.id] = "Game in progress";
          } else {
            newCountdowns[game.id] = "Game ended";
          }
        }
      });

      setGameCountdowns(newCountdowns);
    };

    calculateCountdowns();
    const timer = setInterval(calculateCountdowns, 1000);

    return () => clearInterval(timer);
  }, []);

  const games = [
    {
      id: 1,
      name: "Marketing Kahoot Challenge",
      creator: "Sarah Chen (Berkeley)",
      creatorUsername: "@sarahchen_mktr",
      prizePool: 15000,
      participants: 1247,
      startTime: "12:00 AM",
      endTime: "12:45 AM",
      startDateTime: "2025-08-25T00:00:00-08:00", // Monday 12:00 AM PST
      endDateTime: "2025-08-25T00:45:00-08:00",   // Monday 12:45 AM PST
      timeZone: "PST", 
      duration: "45 minutes",
      donatedTokens: 2500,
      donatedValue: "$2,500",
      description: "Test your marketing knowledge in this fast-paced Kahoot quiz covering everything from digital advertising to consumer psychology.",
      gameLink: "https://viral-dao.com/games/marketing-kahoot-001",
      difficulty: "Beginner",
      category: "Quiz Game"
    },
    {
      id: 2,
      name: "Brand Jeopardy Championship",
      creator: "Prof. Marcus Rodriguez (NYU)",
      creatorUsername: "@marcus_strategy",
      prizePool: 25000,
      participants: 892,
      startTime: "6:00 AM",
      endTime: "7:30 AM",
      startDateTime: "2025-08-25T06:00:00-05:00", // Monday 6:00 AM EST
      endDateTime: "2025-08-25T07:30:00-05:00",   // Monday 7:30 AM EST
      timeZone: "EST",
      duration: "1.5 hours",
      donatedTokens: 8500,
      donatedValue: "$8,500",
      description: "Classic Jeopardy format with categories like 'Famous Campaigns', 'Marketing Metrics', and 'Brand Fails'. Answer in the form of a question!",
      gameLink: "https://viral-dao.com/games/brand-jeopardy-003",
      difficulty: "Intermediate",
      category: "Trivia Game"
    },
    {
      id: 3,
      name: "Social Media Challenge Sprint",
      creator: "Emma Thompson (USC)",
      creatorUsername: "@emma_influence",
      prizePool: 12000,
      participants: 654,
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      startDateTime: "2025-08-25T14:00:00-06:00", // Monday 2:00 PM CST
      endDateTime: "2025-08-25T16:00:00-06:00",   // Monday 4:00 PM CST
      timeZone: "CST",
      duration: "2 hours",
      donatedTokens: 1200,
      donatedValue: "$1,200",
      description: "Create viral content for a mystery brand in real-time. Judged on creativity, engagement potential, and strategic thinking.",
      gameLink: "https://viral-dao.com/games/social-challenge-002",
      difficulty: "Intermediate",
      category: "Content Creation"
    },
    {
      id: 4,
      name: "Marketing Escape Room",
      creator: "Alex Kim (MIT)",
      creatorUsername: "@alexkim_growth",
      prizePool: 18000,
      participants: 743,
      startTime: "8:30 PM",
      endTime: "9:30 PM",
      startDateTime: "2025-08-25T20:30:00-05:00", // Monday 8:30 PM EST
      endDateTime: "2025-08-25T21:30:00-05:00",   // Monday 9:30 PM EST
      timeZone: "EST",
      duration: "1 hour",
      donatedTokens: 4200,
      donatedValue: "$4,200",
      description: "Solve marketing puzzles and challenges to 'escape' - think campaign optimization, budget allocation, and customer journey mapping!",
      gameLink: "https://viral-dao.com/games/marketing-escape-004",
      difficulty: "Advanced",
      category: "Puzzle Game"
    }
  ];

  const copyGameLink = (link: string, gameName: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: `Game link for "${gameName}" copied to clipboard`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/20 text-green-400";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400";
      case "Advanced": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Prize Pool{" "}
              <span className="viral-gradient bg-clip-text text-transparent">
                Games
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Compete with fellow marketing students in challenges and games you never thought you could get paid for! 
              From Kahoot quizzes and Jeopardy games to social media challenges - build your portfolio, 
              earn tokens, and win cash prizes while having fun and mastering marketing skills.
            </p>
            
            {/* Game Schedule Info */}
            <div className="glass-card p-6 rounded-2xl mb-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-viral-purple" />
                <span className="text-lg font-semibold">Your Monday Game Schedule</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4 text-center">
                Games run throughout Monday • Each player sets their own Monday schedule • All games must end before 11:59 PM in creator's time zone
              </div>
              
              {/* Today's Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {games.map(game => (
                  <div key={game.id} className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-xs font-semibold text-viral-purple mb-1">{game.name}</div>
                    <div className="text-sm font-bold">{game.startTime} - {game.endTime}</div>
                    <div className="text-xs text-muted-foreground">{game.timeZone}</div>
                    <div className="text-xs text-viral-cyan mt-1">{gameCountdowns[game.id] || "Loading..."}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {games.slice(0, 4).map((game) => (
              <Card key={game.id} className="glass-card border-border/20 hover:scale-105 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-viral-purple/20 text-viral-purple hover:bg-viral-purple/30">
                          {game.category}
                        </Badge>
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {game.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-viral-purple transition-colors">
                        {game.name}
                      </CardTitle>
                    </div>
                    <Trophy className="w-8 h-8 text-viral-purple opacity-50" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>Created by</span>
                    <span className="font-semibold text-foreground">{game.creator}</span>
                    <span className="text-viral-purple">{game.creatorUsername}</span>
                  </div>
                  
                  {/* Live Countdown */}
                  <div className="bg-viral-purple/10 border border-viral-purple/20 rounded-lg p-3 mb-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Game Status</div>
                    <div className="text-lg font-bold text-viral-purple">
                      {gameCountdowns[game.id] || "Loading..."}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>

                  {/* Game Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-viral-pink" />
                      <div>
                        <div className="font-bold text-lg">${game.prizePool.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Prize Pool</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-viral-cyan" />
                      <div>
                        <div className="font-bold text-lg">{game.participants.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-viral-purple" />
                      <div>
                        <div className="font-bold text-lg">{game.donatedTokens}</div>
                        <div className="text-xs text-muted-foreground">Donated ({game.donatedValue})</div>
                      </div>
                    </div>
                  </div>

                  {/* Game Schedule */}
                  <div className="space-y-2 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-viral-purple" />
                      <span className="text-sm">
                        <strong>Start Time:</strong> {game.startTime} {game.timeZone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-viral-pink" />
                      <span className="text-sm">
                        <strong>End Time:</strong> {game.endTime} {game.timeZone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-viral-cyan" />
                      <span className="text-sm">
                        <strong>Duration:</strong> {game.duration}
                      </span>
                    </div>
                  </div>

                  {/* Game Link */}
                  <div className="flex items-center gap-2 p-3 bg-muted/10 rounded-lg">
                    <code className="flex-1 text-xs text-muted-foreground truncate">
                      {game.gameLink}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyGameLink(game.gameLink, game.name)}
                      className="hover:bg-viral-purple/20"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button 
                    variant="viral" 
                    size="lg" 
                    className="flex-1 group-hover:scale-105 transition-transform"
                    onClick={() => window.open(game.gameLink, '_blank')}
                  >
                    Join Game
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1"
                  >
                    Unjoin Game
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* View More Games Button */}
          <div className="text-center mb-16">
            <Button variant="viral-outline" size="lg" className="flex items-center gap-2">
              View All Prize Pool Games
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">How Prize Pool Games Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="w-8 h-8 bg-viral-purple/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-viral-purple font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Join Before Monday</h3>
                  <p className="text-sm text-muted-foreground">
                    Register before games start — registration ends at 11:59 PM Sunday (local time).
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-viral-pink/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-viral-pink font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Compete Monday</h3>
                  <p className="text-sm text-muted-foreground">
                    Games run at different times throughout Monday. Check each game's individual schedule!
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-viral-cyan/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-viral-cyan font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Win Prizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Top performers win cash prizes and tokens. Build your portfolio while earning!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrizePoolGames;