import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, AlertTriangle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const GameRules = () => {
  const prizeDistribution = [
    { position: "1st Place", percentage: "30%", color: "text-yellow-500" },
    { position: "2nd Place", percentage: "20%", color: "text-gray-400" },
    { position: "3rd Place", percentage: "10%", color: "text-orange-500" },
    { position: "4th Place", percentage: "10%", color: "text-orange-500" },
    { position: "5th-10th Place", percentage: "6% each", color: "text-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Prize Pool Games Rules
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about participating in and creating prize pool games
            </p>
          </div>

          {/* Weekly Timeline */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-viral-purple" />
                <span>Weekly Game Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold text-red-500">Sunday</h4>
                  <p className="text-sm text-muted-foreground">Registration closes at 11:59 PM (creator's local time)</p>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold text-green-500">Monday</h4>
                  <p className="text-sm text-muted-foreground">Games run from 12:00 AM to 11:59 PM (creator's local time)</p>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold text-blue-500">Tuesday</h4>
                  <p className="text-sm text-muted-foreground">Prizes distributed in the evening</p>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <h4 className="font-semibold text-purple-500">Wed-Sat</h4>
                  <p className="text-sm text-muted-foreground">New game submissions and planning</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-viral-purple" />
                  <span>Participation Rules</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Users can join a maximum of <strong>4 games per week</strong></p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Game creators <strong>cannot participate</strong> in their own games</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Game start times <strong>cannot overlap</strong> on Monday</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">All participants must follow community guidelines</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-viral-purple" />
                  <span>Timing Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Games must start Monday at <strong>12:00 AM</strong> or later</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Games must end before <strong>11:59 PM Monday</strong></p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">Minimum game duration is <strong>30 minutes</strong></p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-viral-purple rounded-full mt-2"></div>
                  <p className="text-sm">All times are based on creator's local timezone</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prize Distribution */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-viral-purple" />
                <span>Prize Distribution Formula</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {prizeDistribution.map((prize, index) => (
                  <div key={index} className="text-center p-4 border border-border rounded-lg">
                    <div className={`text-2xl font-bold ${prize.color} mb-2`}>
                      {prize.percentage}
                    </div>
                    <div className="text-sm font-medium">{prize.position}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Prize distribution is calculated based on the total prize pool for each game. 
                  Remaining tokens (4%) go to platform maintenance and future prize pools.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Warnings */}
          <Card className="glass-card border-yellow-500/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <span>Important Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <h4 className="font-semibold text-yellow-600 mb-2">Fair Play Policy</h4>
                <p className="text-sm">Any attempt to manipulate game results, create fake accounts, or violate community guidelines will result in immediate disqualification and potential account suspension.</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">Creator Restrictions</h4>
                <p className="text-sm">Game creators found participating in their own games (directly or through alternative accounts) will forfeit all creator rewards and face penalties.</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">Technical Issues</h4>
                <p className="text-sm">In case of technical difficulties or disputes, our support team will review each case individually. Decisions made by the moderation team are final.</p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Think you got what it takes to win the big prize pool?</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join the competition and prove your skills against the best!
            </p>
            <Link to="/prize-pool-games">
              <Button variant="viral" size="lg" className="text-lg px-8 py-3">
                Play Now!
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GameRules;