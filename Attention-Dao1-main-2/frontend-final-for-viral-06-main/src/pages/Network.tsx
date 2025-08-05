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
  Eye, 
  Send
} from "lucide-react";
import { Link } from "react-router-dom";

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
      tokensEarned: 1250,
      views: 3420,
      rank: 12
    },
    {
      id: 2,
      name: "Priya Patel",
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop",
      tokensEarned: 890,
      views: 2150,
      rank: 24
    },
    {
      id: 3,
      name: "Tyler Brooks",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop",
      tokensEarned: 2100,
      views: 5680,
      rank: 7
    },
    {
      id: 4,
      name: "Zoe Chang",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
      tokensEarned: 1560,
      views: 4200,
      rank: 15
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
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                View Portfolio
                              </Button>
                              <Button variant="destructive" size="sm" className="flex-1">
                                Unfollow
                              </Button>
                            </div>
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

          {/* Say Congrats Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-viral-purple" />
              <h2 className="text-2xl font-bold">Say Congrats</h2>
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

          
          {/* Discover Portfolios Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-6 h-6 text-viral-purple" />
                <h2 className="text-xl font-bold">Discover Portfolios</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  ←
                </Button>
                <Button variant="outline" size="sm">
                  →
                </Button>
              </div>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="glass-card min-w-[280px] flex-shrink-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} alt={portfolio.name} />
                        <AvatarFallback>{portfolio.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{portfolio.name}</h3>
                        <p className="text-sm text-muted-foreground">Marketing Student</p>
                        <p className="text-xs text-muted-foreground">NYU • Senior</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to="/messages">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Message
                        </Link>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Network;