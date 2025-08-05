import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Building2, FileText, Gamepad2, Filter, Eye, Heart } from "lucide-react";

const Searchr = () => {
  // Mock search results data
  const searchResults = {
    users: [
      {
        id: 1,
        username: "DesignPro_2024",
        type: "Creator",
        followers: 1247,
        postsCount: 23,
        description: "UI/UX Designer specializing in mobile applications and user experience",
        verified: true
      },
      {
        id: 2,
        username: "MarketingGuru",
        type: "Professional",
        followers: 3456,
        postsCount: 67,
        description: "Digital marketing strategist with 10+ years experience",
        verified: false
      }
    ],
    companies: [
      {
        id: 1,
        name: "TechStartup Inc.",
        industry: "Technology",
        employees: "50-100",
        description: "Innovative software solutions for modern businesses",
        verified: true
      },
      {
        id: 2,
        name: "Creative Agency Co.",
        industry: "Marketing",
        employees: "10-50",
        description: "Full-service digital marketing and design agency",
        verified: false
      }
    ],
    posts: [
      {
        id: 1,
        title: "Instagram Growth Strategy That Increased Followers by 300%",
        author: "SocialMediaExpert",
        type: "Social Media Campaign",
        views: 2547,
        likes: 156,
        timeAgo: "2 days ago"
      },
      {
        id: 2,
        title: "Complete Email Marketing Funnel for SaaS Products",
        author: "EmailProMarketer",
        type: "Email Marketing",
        views: 1823,
        likes: 98,
        timeAgo: "1 week ago"
      }
    ],
    games: [
      {
        id: 1,
        title: "Ultimate Marketing Strategy Quiz",
        creator: "GameMaster_Pro",
        participants: 78,
        status: "Completed",
        prizePool: 500,
        timeAgo: "3 days ago"
      },
      {
        id: 2,
        title: "Creative Design Speed Challenge",
        creator: "DesignChallenger",
        participants: 45,
        status: "Active",
        prizePool: 300,
        timeAgo: "6 hours ago"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Search
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover users, companies, posts, and games across the platform
            </p>
          </div>

          {/* Search Interface */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    placeholder="Search for users, companies, posts, games..."
                    className="pl-12 text-lg h-12"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="users">Users Only</SelectItem>
                      <SelectItem value="companies">Companies Only</SelectItem>
                      <SelectItem value="posts">Posts Only</SelectItem>
                      <SelectItem value="games">Games Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="viral" size="lg">
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-8">
            {/* Users Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-viral-purple" />
                Users ({searchResults.users.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.users.map((user) => (
                  <Card key={user.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-viral-purple rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{user.username}</h3>
                            {user.verified && (
                              <Badge variant="default" className="text-xs">Verified</Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">{user.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{user.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{user.followers} followers</span>
                            <span>{user.postsCount} posts</span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Companies Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-2 text-viral-purple" />
                Companies ({searchResults.companies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.companies.map((company) => (
                  <Card key={company.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{company.name}</h3>
                            {company.verified && (
                              <Badge variant="default" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{company.industry}</span>
                            <span>{company.employees} employees</span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            View Company
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-viral-purple" />
                Posts ({searchResults.posts.length})
              </h2>
              <div className="space-y-4">
                {searchResults.posts.map((post) => (
                  <Card key={post.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-sm text-muted-foreground">by {post.author}</span>
                            <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                            <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{post.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Post
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Games Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Gamepad2 className="w-6 h-6 mr-2 text-viral-purple" />
                Games ({searchResults.games.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.games.map((game) => (
                  <Card key={game.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{game.title}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <span className="text-sm text-muted-foreground">by {game.creator}</span>
                            <Badge variant={game.status === "Active" ? "destructive" : "default"} className="text-xs">
                              {game.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{game.participants} participants</span>
                            <span>{game.prizePool} token pool</span>
                            <span>{game.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={game.status === "Active" ? "viral" : "outline"} 
                        size="sm" 
                        className="w-full"
                        disabled={game.status !== "Active"}
                      >
                        {game.status === "Active" ? "Join Game" : "View Results"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Search Tips */}
          <Card className="glass-card mt-12">
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🔍 Search Techniques</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Use quotes for exact phrases: "email marketing"</li>
                    <li>• Search by username: @username</li>
                    <li>• Filter by category using the dropdown</li>
                    <li>• Use keywords relevant to your interests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💡 Discovery Tips</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Browse trending posts and popular creators</li>
                    <li>• Check out active games for quick engagement</li>
                    <li>• Follow companies in your industry</li>
                    <li>• Connect with users who share your interests</li>
                  </ul>
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

export default Searchr;