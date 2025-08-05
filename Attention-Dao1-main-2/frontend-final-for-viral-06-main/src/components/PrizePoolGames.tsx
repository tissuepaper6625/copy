import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Trophy, Clock, ArrowRight } from "lucide-react";

const PrizePoolGames = () => {
  const featuredGames = [
    {
      id: 1,
      name: "Social Media Campaign Challenge",
      description: "Create viral content for emerging brands and compete for the biggest engagement metrics. Show your creativity and strategic thinking!",
      participants: 1247,
      prizePool: 15000,
      startTime: "Monday 12:30 AM EST",
      endTime: "Monday 6:45 PM EST",
      timeLeft: "Starts in 2 days, 14 hours",
      duration: "18 hours 15 minutes",
      difficulty: "Intermediate",
      category: "Content Creation",
      gradient: "from-viral-purple to-viral-pink",
      creator: "Sarah Chen (Berkeley)",
      timezone: "EST"
    },
    {
      id: 2,
      name: "Brand Strategy Sprint",
      description: "Develop comprehensive marketing strategies for startups in 72 hours. Test your analytical skills and strategic vision.",
      participants: 892,
      prizePool: 25000,
      startTime: "Monday 6:00 AM PST", 
      endTime: "Monday 11:00 PM PST",
      timeLeft: "Starts in 1 day, 8 hours",
      duration: "17 hours",
      difficulty: "Advanced",
      category: "Strategy",
      gradient: "from-viral-pink to-viral-cyan",
      creator: "Prof. Martinez (NYU)",
      timezone: "PST"
    },
    {
      id: 3,
      name: "Quick Design Challenge",
      description: "Design a logo and brand identity for a new startup in under 4 hours. Perfect for testing your creative speed and efficiency.",
      participants: 634,
      prizePool: 8000,
      startTime: "Monday 3:00 PM CST",
      endTime: "Monday 7:30 PM CST",
      timeLeft: "Starts in 3 days, 2 hours",
      duration: "4 hours 30 minutes",
      difficulty: "Beginner",
      category: "Design",
      gradient: "from-viral-cyan to-viral-purple",
      creator: "Alex Park (USC)",
      timezone: "CST"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="viral-gradient bg-clip-text text-transparent">
              Prize Pool Games
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compete with fellow marketing students, showcase your skills, and earn real money while building your portfolio. Games run at different times throughout Monday - creators set their own schedules!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-viral-purple/20 text-viral-purple text-xs font-semibold rounded-full">
                        {game.category}
                      </span>
                      <span className="px-3 py-1 bg-viral-pink/20 text-viral-pink text-xs font-semibold rounded-full">
                        {game.difficulty}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-viral-purple transition-colors">
                      {game.name}
                    </h3>
                  </div>
                  <Trophy className="w-8 h-8 text-viral-purple opacity-50" />
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {game.description}
                </p>

                {/* Game Schedule */}
                <div className="mb-6 p-4 bg-viral-purple/5 rounded-lg border border-viral-purple/10">
                  <div className="text-sm text-muted-foreground mb-2">
                    Game Schedule ({game.timezone}) - Created by {game.creator}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span>Start:</span>
                      <span className="font-medium text-viral-purple">{game.startTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>End:</span>
                      <span className="font-medium text-viral-pink">{game.endTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Duration:</span>
                      <span className="font-medium text-viral-cyan">{game.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-viral-purple" />
                    </div>
                    <div className="text-lg font-bold">{game.participants.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="w-5 h-5 text-viral-pink" />
                    </div>
                    <div className="text-lg font-bold">${game.prizePool.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-viral-cyan" />
                    </div>
                    <div className="text-lg font-bold text-viral-cyan">{game.timeLeft}</div>
                    <div className="text-xs text-muted-foreground">Countdown</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="viral" className="w-full group-hover:scale-105 transition-transform" asChild>
                  <Link to="/prize-pool-games">
                    Join Competition
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Games Button */}
        <div className="text-center">
          <Link to="/prize-pool-games">
            <Button variant="viral-outline" size="lg" className="px-8">
              View All Prize Pool Games
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 viral-gradient opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-viral-cyan opacity-5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default PrizePoolGames;