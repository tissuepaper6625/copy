import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad2, Clock, Users, Link } from "lucide-react";

const PostGame = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Post a New Game
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create an exciting challenge for the community and build the prize pool
            </p>
          </div>

          {/* Game Creation Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Gamepad2 className="w-6 h-6 text-viral-purple" />
                <span>Game Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Title */}
              <div className="space-y-2">
                <Label htmlFor="gameTitle">Game Title</Label>
                <Input 
                  id="gameTitle"
                  placeholder="Enter an exciting title for your game"
                  className="w-full"
                />
              </div>

              {/* Game Type */}
              <div className="space-y-2">
                <Label htmlFor="gameType">Game Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trivia">Trivia Challenge</SelectItem>
                    <SelectItem value="puzzle">Puzzle Game</SelectItem>
                    <SelectItem value="speed">Speed Challenge</SelectItem>
                    <SelectItem value="creative">Creative Challenge</SelectItem>
                    <SelectItem value="skill">Skill Competition</SelectItem>
                    <SelectItem value="strategy">Strategy Game</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Game Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Monday)</Label>
                  <Input 
                    id="startTime"
                    type="time"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Games can start from 12:00 AM Monday</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Monday)</Label>
                  <Input 
                    id="endTime"
                    type="time"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Games must end before 11:59 PM Monday</p>
                </div>
              </div>

              {/* Duration Info */}
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Timing Requirements</span>
                  </div>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Minimum game duration: 30 minutes</li>
                    <li>• Users cannot overlap their game schedule</li>
                    <li>• All times are in your local timezone</li>
                    <li>• Registration closes Sunday at 11:59 PM</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Game Description */}
              <div className="space-y-2">
                <Label htmlFor="gameDescription">Game Description</Label>
                <Textarea 
                  id="gameDescription"
                  placeholder="Describe your game, rules, objectives, and what makes it exciting..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Game Link */}
              <div className="space-y-2">
                <Label htmlFor="gameLink">Game URL</Label>
                <Input 
                  id="gameLink"
                  type="url"
                  placeholder="https://your-game-platform.com/your-game"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Link to your hosted game (Kahoot, custom website, etc.)
                </p>
              </div>

              {/* Game Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Maximum Players</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select max players" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 players</SelectItem>
                      <SelectItem value="25">25 players</SelectItem>
                      <SelectItem value="50">50 players</SelectItem>
                      <SelectItem value="100">100 players</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prize Pool Contribution */}
              <div className="space-y-2">
                <Label htmlFor="prizeContribution">Prize Pool Contribution (Tokens)</Label>
                <Input 
                  id="prizeContribution"
                  type="number"
                  min="50"
                  placeholder="Minimum 50 tokens"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Your contribution helps build the prize pool for winners
                </p>
              </div>

              {/* Game Rules */}
              <div className="space-y-2">
                <Label htmlFor="gameRules">Specific Game Rules</Label>
                <Textarea 
                  id="gameRules"
                  placeholder="List any specific rules, scoring methods, or instructions participants need to know..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Creator Benefits Info */}
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Creator Benefits</span>
                  </div>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Earn 5 tokens for each participant</li>
                    <li>• Build your reputation as a game creator</li>
                    <li>• Gain followers and community recognition</li>
                    <li>• Note: Creators cannot participate in their own games</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button variant="viral" className="flex-1">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Submit Game
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button variant="ghost">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>Tips for Creating Great Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Clear Objectives</h4>
                  <p className="text-muted-foreground">Make sure players understand exactly how to win and what success looks like.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⏱️ Appropriate Duration</h4>
                  <p className="text-muted-foreground">Balance engagement with accessibility - not too short, not too long.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔗 Test Your Links</h4>
                  <p className="text-muted-foreground">Ensure your game URL works and is accessible to all participants.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📱 Mobile Friendly</h4>
                  <p className="text-muted-foreground">Consider players who might be joining from mobile devices.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostGame;