import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Trophy, Clock, Copy, Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const PrizePoolGames = () => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time until next Friday
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextFriday = new Date();
      
      // Find next Friday
      const daysUntilFriday = (5 - now.getDay() + 7) % 7;
      if (daysUntilFriday === 0 && now.getHours() >= 9) {
        // If it's Friday after 9 AM, get next Friday
        nextFriday.setDate(now.getDate() + 7);
      } else {
        nextFriday.setDate(now.getDate() + daysUntilFriday);
      }
      
      nextFriday.setHours(9, 0, 0, 0); // 9 AM Friday
      
      const difference = nextFriday.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const games = [
    {
      id: 1,
      name: "Social Media Viral Challenge",
      creator: "Sarah Chen",
      creatorUsername: "@sarahchen_mktr",
      prizePool: 15000,
      participants: 1247,
      gameTime: "Friday 9:00 AM",
      timeZone: "EST",
      joinDeadline: "Thursday 11:59 PM EST",
      description: "Create the most engaging social media campaign for a mystery brand. Judged on creativity, engagement potential, and strategic thinking.",
      gameLink: "https://viral-dao.com/games/social-viral-challenge-001",
      difficulty: "Intermediate",
      category: "Content Creation"
    },
    {
      id: 2,
      name: "Brand Strategy Sprint",
      creator: "Marcus Rodriguez",
      creatorUsername: "@marcus_strategy",
      prizePool: 25000,
      participants: 892,
      gameTime: "Friday 9:00 AM",
      timeZone: "EST",
      joinDeadline: "Thursday 11:59 PM EST",
      description: "72-hour intensive to develop a complete go-to-market strategy for a tech startup. Teams of up to 4 students compete.",
      gameLink: "https://viral-dao.com/games/brand-strategy-sprint-003",
      difficulty: "Advanced",
      category: "Strategy"
    },
    {
      id: 3,
      name: "Influencer Campaign Design",
      creator: "Emma Thompson",
      creatorUsername: "@emma_influence",
      prizePool: 12000,
      participants: 654,
      gameTime: "Friday 9:00 AM",
      timeZone: "EST",
      joinDeadline: "Thursday 11:59 PM EST",
      description: "Design an influencer marketing campaign with budget allocation, creator selection, and content strategy.",
      gameLink: "https://viral-dao.com/games/influencer-campaign-design-002",
      difficulty: "Beginner",
      category: "Influencer Marketing"
    },
    {
      id: 4,
      name: "Data-Driven Growth Hack",
      creator: "Alex Kim",
      creatorUsername: "@alexkim_growth",
      prizePool: 18000,
      participants: 743,
      gameTime: "Friday 9:00 AM",
      timeZone: "EST",
      joinDeadline: "Thursday 11:59 PM EST",
      description: "Use analytics and growth hacking techniques to propose scalable user acquisition strategies.",
      gameLink: "https://viral-dao.com/games/growth-hack-challenge-004",
      difficulty: "Advanced",
      category: "Growth Marketing"
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
              Compete with fellow marketing students in real-time challenges. Build your portfolio, 
              earn tokens, and win cash prizes while mastering marketing skills.
            </p>
            
            {/* Game Start Info */}
            <div className="glass-card p-6 rounded-2xl mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-viral-purple" />
                <span className="text-lg font-semibold">Games Start Every Friday at 9:00 AM EST</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Registration closes Thursday at 11:59 PM EST
              </div>
              
              {/* Live Timer */}
              <div className="border-t border-border/20 pt-4">
                <p className="text-sm text-muted-foreground mb-2">Next Game Starts In:</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-viral-purple/20 rounded-lg p-2">
                    <div className="text-2xl font-bold text-viral-purple">{timeLeft.days}</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="bg-viral-pink/20 rounded-lg p-2">
                    <div className="text-2xl font-bold text-viral-pink">{timeLeft.hours}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="bg-viral-cyan/20 rounded-lg p-2">
                    <div className="text-2xl font-bold text-viral-cyan">{timeLeft.minutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="bg-viral-blue/20 rounded-lg p-2">
                    <div className="text-2xl font-bold text-viral-blue">{timeLeft.seconds}</div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {games.map((game) => (
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
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>

                  {/* Game Stats */}
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  {/* Time Info */}
                  <div className="space-y-2 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-viral-purple" />
                      <span className="text-sm">
                        <strong>Game Time:</strong> {game.gameTime} {game.timeZone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-viral-pink" />
                      <span className="text-sm">
                        <strong>Join Deadline:</strong> {game.joinDeadline}
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

                <CardFooter>
                  <Button 
                    variant="viral" 
                    size="lg" 
                    className="w-full group-hover:scale-105 transition-transform"
                    onClick={() => window.open(game.gameLink, '_blank')}
                  >
                    Join Game
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
                  <h3 className="font-semibold mb-2">Join Before Deadline</h3>
                  <p className="text-sm text-muted-foreground">
                    Register for games before Thursday 11:59 PM EST. Late entries are not accepted.
                  </p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-viral-pink/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-viral-pink font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Compete Friday</h3>
                  <p className="text-sm text-muted-foreground">
                    All games start Friday at 9:00 AM EST. Be ready to showcase your marketing skills!
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