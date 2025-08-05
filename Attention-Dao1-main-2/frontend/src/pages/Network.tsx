import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageCircle, 
  Building2, 
  Eye, 
  Trophy, 
  GamepadIcon,
  ExternalLink,
  Heart,
  Send
} from "lucide-react";

const Network = () => {
  // Sample data for followers/following
  const followingUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      handle: "@sarahc_designs",
      school: "NYU",
      major: "Graphic Design",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      handle: "@mikerod_marketing",
      school: "UCLA",
      major: "Marketing",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const followers = [
    {
      id: 3,
      name: "Emma Wilson",
      handle: "@emmaw_creative",
      school: "Stanford",
      major: "Business",
      avatar: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Alex Kim",
      handle: "@alexkim_dev",
      school: "MIT",
      major: "Computer Science",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Sample congratulatory comments
  const congratsComments = [
    {
      id: 1,
      from: "Jessica Martinez",
      reason: "Hire",
      message: "Congrats on landing the internship at Google! Well deserved! 🎉",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      from: "David Park",
      reason: "Game",
      message: "Amazing game creation! Your marketing strategy game was so creative.",
      timeAgo: "1 day ago"
    },
    {
      id: 3,
      from: "Lisa Thompson",
      reason: "Viral Post",
      message: "Your Instagram campaign case study went viral! So inspiring 🚀",
      timeAgo: "3 days ago"
    }
  ];

  // Sample portfolios
  const portfolios = [
    {
      id: 1,
      name: "Marcus Johnson",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
      twitterLink: "https://twitter.com/marcus_creates",
      tokensEarned: 1250,
      views: 3420,
      rank: 12
    },
    {
      id: 2,
      name: "Priya Patel",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop",
      twitterLink: "https://twitter.com/priya_designs",
      tokensEarned: 890,
      views: 2150,
      rank: 24
    },
    {
      id: 3,
      name: "Tyler Brooks",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop",
      twitterLink: "https://twitter.com/tyler_marketing",
      tokensEarned: 2100,
      views: 5680,
      rank: 7
    },
    {
      id: 4,
      name: "Zoe Chang",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
      twitterLink: "https://twitter.com/zoe_creates",
      tokensEarned: 1560,
      views: 4200,
      rank: 15
    }
  ];

  // Sample game participation data
  const createdGames = [
    {
      id: 1,
      title: "Brand Strategy Challenge",
      date: "2024-01-20",
      views: 847,
      rank: 3,
      payout: 500
    },
    {
      id: 2,
      title: "Social Media Quiz Battle",
      date: "2024-01-15",
      views: 623,
      rank: 8,
      payout: 200
    }
  ];

  const playedGames = [
    {
      id: 1,
      title: "Marketing Fundamentals Quiz",
      score: 92,
      result: "Win",
      prize: 150
    },
    {
      id: 2,
      title: "Creative Campaign Contest",
      score: 78,
      result: "Loss",
      prize: 0
    },
    {
      id: 3,
      title: "Viral Content Strategy",
      score: 88,
      result: "Win",
      prize: 100
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
              Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow marketers, share achievements, and discover amazing portfolios
            </p>
          </div>

          {/* Followers & Following Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Followers & Following</h2>
            </div>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <Tabs defaultValue="following" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="following">People I Follow</TabsTrigger>
                    <TabsTrigger value="followers">People Following Me</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="following" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {followingUsers.map((user) => (
                        <Card key={user.id} className="glass-card">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.handle}</p>
                                {user.school && (
                                  <p className="text-xs text-muted-foreground">{user.school} • {user.major}</p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              View Portfolio
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="followers" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {followers.map((user) => (
                        <Card key={user.id} className="glass-card">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.handle}</p>
                                {user.school && (
                                  <p className="text-xs text-muted-foreground">{user.school} • {user.major}</p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              View Portfolio
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Congratulatory Comments Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Congratulatory Comments</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Congratulations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {congratsComments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-viral-purple pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.from}</span>
                          <Badge variant="secondary" className="text-xs">
                            {comment.reason}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{comment.message}</p>
                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Leave a Congratulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Search user to congratulate..." />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="What are you congratulating them for?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hire">Getting Hired</SelectItem>
                        <SelectItem value="game">Game Win</SelectItem>
                        <SelectItem value="viral">Viral Post</SelectItem>
                        <SelectItem value="leaderboard">Leaderboard Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Write your congratulatory message..." />
                    <Button variant="viral" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Congratulations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Brand Outreach Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Brand Outreach</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Messages from Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-border/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Nike</Badge>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm">
                        Hey! We loved your campaign strategy portfolio. Would you be interested in discussing an internship opportunity?
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Reply
                      </Button>
                    </div>
                    <div className="border border-border/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Spotify</Badge>
                        <span className="text-sm text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-sm">
                        Your music marketing case study was impressive! We'd love to chat about potential collaboration.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Message a Brand</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nike">Nike</SelectItem>
                        <SelectItem value="spotify">Spotify</SelectItem>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sponsorship">Sponsorship</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Write your message to the brand..." />
                    <Button variant="viral" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Discover Portfolios Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Discover Portfolios</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="glass-card overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={portfolio.thumbnail} 
                      alt={`${portfolio.name}'s portfolio`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{portfolio.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="font-medium">{portfolio.tokensEarned}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium">{portfolio.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rank:</span>
                        <span className="font-medium">#{portfolio.rank}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Twitter
                      </Button>
                      <Button variant="viral" size="sm" className="flex-1">
                        View Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Game Participation Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <GamepadIcon className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Game Participation</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Games I Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {createdGames.map((game) => (
                      <div key={game.id} className="border border-border/20 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{game.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <span className="ml-2">{new Date(game.date).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Views:</span>
                            <span className="ml-2">{game.views}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rank:</span>
                            <span className="ml-2">#{game.rank}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payout:</span>
                            <span className="ml-2">{game.payout} tokens</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Games I Played</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playedGames.map((game) => (
                      <div key={game.id} className="border border-border/20 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{game.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <span className="ml-2">{game.score}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Result:</span>
                            <Badge 
                              variant={game.result === "Win" ? "default" : "secondary"}
                              className="ml-2"
                            >
                              {game.result}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Prize:</span>
                            <span className="ml-2">{game.prize} tokens</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Network;